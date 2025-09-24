const stripe = require("../../helpers/stripe");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
    } = req.body;

    let serverTotalAmount = 0;

    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`,
        });
      }
      const price = product.salePrice > 0 ? product.salePrice : product.price;
      serverTotalAmount += price * item.quantity;
    }

    if (totalAmount.toFixed(2) !== serverTotalAmount.toFixed(2)) {
      return res.status(400).json({
        success: false,
        message: "Total amount mismatch. Please try again.",
      });
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(serverTotalAmount * 100), // Stripe expects amount in cents
      currency: 'usd',
      metadata: {
        orderId: 'temp_order_id',
        userId: userId
      }
    });

    // Create order in database
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: "pending",
      paymentMethod: "stripe",
      paymentStatus: "pending",
      totalAmount: serverTotalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: paymentIntent.id,
      payerId: null,
    });

    await newlyCreatedOrder.save();

    res.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId: newlyCreatedOrder._id,
      paymentIntentId: paymentIntent.id
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error while creating payment intent!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    // Confirm payment with Stripe
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: 'pm_card_visa', // Mock payment method for demo
    });

    if (paymentIntent.status === 'succeeded') {
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentId = paymentIntentId;
      order.orderUpdateDate = new Date();

      // Update product stock
      for (let item of order.cartItems) {
        let product = await Product.findById(item.productId);

        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product not found: ${item.title}`,
          });
        }

        if (product.totalStock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for product: ${product.title}`,
          });
        }

        product.totalStock -= item.quantity;
        await product.save();
      }

      // Clear cart instead of deleting
      const getCartId = order.cartId;
      const cart = await Cart.findById(getCartId);
      if (cart) {
        cart.items = [];
        await cart.save();
      }

      await order.save();

      res.status(200).json({
        success: true,
        message: "Payment successful and order confirmed",
        data: order,
        orderStatus: order.orderStatus,
        cartCleared: true
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment failed",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
