const request = require('supertest');
const express = require('express');
const Order = require('../../../models/Order');
const Cart = require('../../../models/Cart');
const Product = require('../../../models/Product');

// Mock Stripe properly
const mockStripe = {
  paymentIntents: {
    create: jest.fn(),
    confirm: jest.fn()
  }
};

jest.mock('../../../helpers/stripe', () => mockStripe);

// Mock dependencies
jest.mock('../../../models/Order');
jest.mock('../../../models/Cart');
jest.mock('../../../models/Product');

const { 
  createOrder, 
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails
} = require('../order-controller');

const app = express();
app.use(express.json());

// Setup routes for testing
app.post('/orders/create', createOrder);
app.post('/orders/capture', capturePayment);
app.get('/orders/list/:userId', getAllOrdersByUser);
app.get('/orders/details/:id', getOrderDetails);

describe('Order Controller Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create order successfully', () => {
    it('should create order with valid cart items', async () => {
      const orderData = {
        userId: 'user123',
        cartItems: [
          {
            productId: 'prod1',
            quantity: 2,
            title: 'Test Product',
            image: 'test.jpg',
            price: 50
          }
        ],
        addressInfo: {
          address: '123 Main St',
          city: 'Test City',
          zip: '12345'
        },
        orderStatus: 'pending',
        paymentMethod: 'stripe',
        paymentStatus: 'pending',
        totalAmount: 100,
        cartId: 'cart123'
      };

      // Mock Product.findById
      Product.findById.mockResolvedValue({
        _id: 'prod1',
        title: 'Test Product',
        price: 50,
        salePrice: 0,
        totalStock: 10
      });

      // Mock Stripe payment intent creation
      mockStripe.paymentIntents.create.mockResolvedValue({
        id: 'pi_test123',
        client_secret: 'pi_test123_secret_test'
      });

      // Mock Order constructor and save
      const mockOrder = {
        _id: 'order123',
        save: jest.fn().mockResolvedValue(true)
      };
      Order.mockImplementation(() => mockOrder);

      const response = await request(app)
        .post('/orders/create')
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.clientSecret).toBe('pi_test123_secret_test');
      expect(response.body.orderId).toBe('order123');
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 10000, // 100 * 100 cents
        currency: 'usd',
        metadata: {
          orderId: 'temp_order_id',
          userId: 'user123'
        }
      });
    });
  });

  describe('Capture Stripe payment successfully', () => {
    it('should capture payment and update order status', async () => {
      const paymentData = {
        paymentIntentId: 'pi_test123',
        orderId: 'order123'
      };

      const mockOrder = {
        _id: 'order123',
        cartItems: [{
          productId: 'prod1',
          quantity: 2,
          title: 'Test Product'
        }],
        cartId: 'cart123',
        paymentStatus: 'pending',
        orderStatus: 'pending',
        save: jest.fn().mockResolvedValue(true)
      };

      // Mock Order.findById
      Order.findById.mockResolvedValue(mockOrder);

      // Mock Product for stock update
      Product.findById.mockResolvedValue({
        _id: 'prod1',
        title: 'Test Product',
        totalStock: 10,
        save: jest.fn().mockResolvedValue(true)
      });

      // Mock Cart.findByIdAndDelete
      Cart.findByIdAndDelete.mockResolvedValue(true);

      // Mock Stripe payment confirmation
      mockStripe.paymentIntents.confirm.mockResolvedValue({
        id: 'pi_test123',
        status: 'succeeded'
      });

      const response = await request(app)
        .post('/orders/capture')
        .send(paymentData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Payment successful and order confirmed');
      expect(mockOrder.paymentStatus).toBe('paid');
      expect(mockOrder.orderStatus).toBe('confirmed');
      expect(mockStripe.paymentIntents.confirm).toHaveBeenCalledWith('pi_test123', {
        payment_method: 'pm_card_visa'
      });
    });
  });

  describe('Missing required fields', () => {
    it('should handle missing data gracefully', async () => {
      const orderData = {
        // Missing userId and other required fields
        cartItems: [],
        totalAmount: 100
      };

      const response = await request(app)
        .post('/orders/create')
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Total amount mismatch. Please try again.');
    });
  });

  describe('Total amount mismatch', () => {
    it('should reject order creation with incorrect total amount', async () => {
      const orderData = {
        userId: 'user123',
        cartItems: [
          {
            productId: 'prod1',
            quantity: 2,
            title: 'Test Product',
            price: 50
          }
        ],
        totalAmount: 150, // Incorrect total (should be 100)
        cartId: 'cart123'
      };

      // Mock Product.findById
      Product.findById.mockResolvedValue({
        _id: 'prod1',
        title: 'Test Product',
        price: 50,
        salePrice: 0,
        totalStock: 10
      });

      const response = await request(app)
        .post('/orders/create')
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Total amount mismatch. Please try again.');
      expect(mockStripe.paymentIntents.create).not.toHaveBeenCalled();
    });
  });

  describe('Product not found', () => {
    it('should reject order creation when product is not found', async () => {
      const orderData = {
        userId: 'user123',
        cartItems: [
          {
            productId: 'nonexistent',
            quantity: 2,
            title: 'Test Product',
            price: 50
          }
        ],
        totalAmount: 100,
        cartId: 'cart123'
      };

      // Mock Product.findById to return null
      Product.findById.mockResolvedValue(null);

      const response = await request(app)
        .post('/orders/create')
        .send(orderData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product with ID nonexistent not found');
      expect(mockStripe.paymentIntents.create).not.toHaveBeenCalled();
    });
  });

  describe('Stripe payment intent creation fails', () => {
    it('should handle Stripe payment intent creation error', async () => {
      const orderData = {
        userId: 'user123',
        cartItems: [
          {
            productId: 'prod1',
            quantity: 2,
            title: 'Test Product',
            price: 50
          }
        ],
        totalAmount: 100,
        cartId: 'cart123'
      };

      // Mock Product.findById
      Product.findById.mockResolvedValue({
        _id: 'prod1',
        title: 'Test Product',
        price: 50,
        salePrice: 0,
        totalStock: 10
      });

      // Mock Stripe error
      mockStripe.paymentIntents.create.mockRejectedValue(new Error('Stripe API error'));

      const response = await request(app)
        .post('/orders/create')
        .send(orderData);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Error while creating payment intent!');
    });
  });

  describe('Insufficient product stock during payment capture', () => {
    it('should reject payment when product stock is insufficient', async () => {
      const paymentData = {
        paymentIntentId: 'pi_test123',
        orderId: 'order123'
      };

      const mockOrder = {
        _id: 'order123',
        cartItems: [{
          productId: 'prod1',
          quantity: 10,
          title: 'Test Product'
        }],
        cartId: 'cart123',
        paymentStatus: 'pending',
        orderStatus: 'pending'
      };

      // Mock Order.findById
      Order.findById.mockResolvedValue(mockOrder);

      // Mock Product with insufficient stock
      Product.findById.mockResolvedValue({
        _id: 'prod1',
        title: 'Test Product',
        totalStock: 5, // Insufficient for quantity 10
        save: jest.fn()
      });

      // Mock successful Stripe confirmation
      mockStripe.paymentIntents.confirm.mockResolvedValue({
        id: 'pi_test123',
        status: 'succeeded'
      });

      const response = await request(app)
        .post('/orders/capture')
        .send(paymentData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Not enough stock for product: Test Product');
    });
  });

  describe('Order not found during payment capture', () => {
    it('should handle payment capture when order is not found', async () => {
      const paymentData = {
        paymentIntentId: 'pi_test123',
        orderId: 'nonexistent'
      };

      // Mock Order.findById to return null
      Order.findById.mockResolvedValue(null);

      const response = await request(app)
        .post('/orders/capture')
        .send(paymentData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Order can not be found');
      expect(mockStripe.paymentIntents.confirm).not.toHaveBeenCalled();
    });
  });
});