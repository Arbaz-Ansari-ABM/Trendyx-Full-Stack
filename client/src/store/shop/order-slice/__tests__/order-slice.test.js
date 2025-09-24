import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import axios from 'axios'
import orderReducer, { 
  createNewOrder, 
  capturePayment,
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails 
} from '../index'

// Mock axios
vi.mock('axios')
const mockedAxios = axios

describe('Order Slice', () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: {
        shopOrder: orderReducer
      }
    })
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = store.getState().shopOrder
      expect(state).toEqual({
        approvalURL: null,
        isLoading: false,
        orderId: null,
        orderList: [],
        orderDetails: null,
        clientSecret: null,
        paymentIntentId: null
      })
    })
  })

  describe('Order Slice State Updates', () => {
    describe('createNewOrder', () => {
      it('should handle createNewOrder.pending', () => {
        const action = { type: createNewOrder.pending.type }
        const state = orderReducer({
          approvalURL: null,
          isLoading: false,
          orderId: null,
          clientSecret: null,
          paymentIntentId: null,
          orderList: [],
          orderDetails: null
        }, action)

        expect(state.isLoading).toBe(true)
      })

      it('should handle createNewOrder.fulfilled with successful order creation', () => {
        const mockResponse = {
          success: true,
          orderId: 'order123',
          clientSecret: 'pi_test123_secret_test',
          paymentIntentId: 'pi_test123'
        }
        
        const action = { 
          type: createNewOrder.fulfilled.type,
          payload: mockResponse
        }
        
        const state = orderReducer({
          approvalURL: null,
          isLoading: true,
          orderId: null,
          clientSecret: null,
          paymentIntentId: null,
          orderList: [],
          orderDetails: null
        }, action)

        expect(state.isLoading).toBe(false)
        expect(state.orderId).toBe('order123')
        expect(state.clientSecret).toBe('pi_test123_secret_test')
        expect(state.paymentIntentId).toBe('pi_test123')
      })

      it('should handle createNewOrder.rejected', () => {
        const action = { 
          type: createNewOrder.rejected.type,
          error: { message: 'Order creation failed' }
        }
        
        const state = orderReducer({
          approvalURL: null,
          isLoading: true,
          orderId: null,
          clientSecret: null,
          paymentIntentId: null,
          orderList: [],
          orderDetails: null
        }, action)

        expect(state.isLoading).toBe(false)
        expect(state.orderId).toBe(null)
        expect(state.clientSecret).toBe(null)
        expect(state.paymentIntentId).toBe(null)
      })
    })

    describe('capturePayment', () => {
      it('should handle capturePayment.pending', () => {
        const action = { type: capturePayment.pending.type }
        const state = orderReducer({
          approvalURL: null,
          isLoading: false,
          orderId: 'order123',
          clientSecret: 'secret123',
          paymentIntentId: 'pi_123',
          orderList: [],
          orderDetails: null
        }, action)

        expect(state.isLoading).toBe(true)
      })

      it('should handle capturePayment.fulfilled with successful payment', () => {
        const mockResponse = {
          success: true,
          message: 'Payment captured successfully',
          data: {
            _id: 'order123',
            orderStatus: 'confirmed',
            paymentStatus: 'paid'
          }
        }
        
        const action = { 
          type: capturePayment.fulfilled.type,
          payload: mockResponse
        }
        
        const state = orderReducer({
          approvalURL: null,
          isLoading: true,
          orderId: 'order123',
          clientSecret: 'secret123',
          paymentIntentId: 'pi_123',
          orderList: [],
          orderDetails: null
        }, action)

        expect(state.isLoading).toBe(false)
        expect(state.orderId).toBe(null)
        expect(state.clientSecret).toBe(null)
        expect(state.paymentIntentId).toBe(null)
      })

      it('should handle capturePayment.rejected', () => {
        const action = { 
          type: capturePayment.rejected.type,
          error: { message: 'Payment capture failed' }
        }
        
        const state = orderReducer({
          approvalURL: null,
          isLoading: true,
          orderId: 'order123',
          clientSecret: 'secret123',
          paymentIntentId: 'pi_123',
          orderList: [],
          orderDetails: null
        }, action)

        expect(state.isLoading).toBe(false)
        expect(state.orderId).toBe(null)
        expect(state.clientSecret).toBe(null)
        expect(state.paymentIntentId).toBe(null)
      })
    })

    describe('getAllOrdersByUserId', () => {
      it('should handle getAllOrdersByUserId.pending', () => {
        const action = { type: getAllOrdersByUserId.pending.type }
        const state = orderReducer({
          approvalURL: null,
          isLoading: false,
          orderId: null,
          clientSecret: null,
          paymentIntentId: null,
          orderList: [{ _id: 'order1' }],
          orderDetails: null
        }, action)

        expect(state.isLoading).toBe(true)
      })

      it('should handle getAllOrdersByUserId.fulfilled with order list', () => {
        const mockOrders = [
          { _id: 'order1', totalAmount: 100, orderStatus: 'confirmed' },
          { _id: 'order2', totalAmount: 200, orderStatus: 'pending' }
        ]
        
        const action = { 
          type: getAllOrdersByUserId.fulfilled.type,
          payload: { success: true, data: mockOrders }
        }
        
        const state = orderReducer({
          approvalURL: null,
          isLoading: true,
          orderId: null,
          clientSecret: null,
          paymentIntentId: null,
          orderList: [],
          orderDetails: null
        }, action)

        expect(state.isLoading).toBe(false)
        expect(state.orderList).toEqual(mockOrders)
      })

      it('should handle getAllOrdersByUserId.rejected', () => {
        const action = { 
          type: getAllOrdersByUserId.rejected.type,
          error: { message: 'Failed to fetch orders' }
        }
        
        const state = orderReducer({
          approvalURL: null,
          isLoading: true,
          orderId: null,
          clientSecret: null,
          paymentIntentId: null,
          orderList: [{ _id: 'order1' }],
          orderDetails: null
        }, action)

        expect(state.isLoading).toBe(false)
        expect(state.orderList).toEqual([])
      })
    })

    describe('getOrderDetails', () => {
      it('should handle getOrderDetails.pending', () => {
        const action = { type: getOrderDetails.pending.type }
        const state = orderReducer({
          approvalURL: null,
          isLoading: false,
          orderId: null,
          clientSecret: null,
          paymentIntentId: null,
          orderList: [],
          orderDetails: { _id: 'order1' }
        }, action)

        expect(state.isLoading).toBe(true)
      })

      it('should handle getOrderDetails.fulfilled with order details', () => {
        const mockOrderDetails = {
          _id: 'order123',
          totalAmount: 150,
          orderStatus: 'confirmed',
          cartItems: [{ productId: 'prod1', quantity: 2 }]
        }
        
        const action = { 
          type: getOrderDetails.fulfilled.type,
          payload: { success: true, data: mockOrderDetails }
        }
        
        const state = orderReducer({
          approvalURL: null,
          isLoading: true,
          orderId: null,
          clientSecret: null,
          paymentIntentId: null,
          orderList: [],
          orderDetails: null
        }, action)

        expect(state.isLoading).toBe(false)
        expect(state.orderDetails).toEqual(mockOrderDetails)
      })

      it('should handle getOrderDetails.rejected', () => {
        const action = { 
          type: getOrderDetails.rejected.type,
          error: { message: 'Failed to fetch order details' }
        }
        
        const state = orderReducer({
          approvalURL: null,
          isLoading: true,
          orderId: null,
          clientSecret: null,
          paymentIntentId: null,
          orderList: [],
          orderDetails: { _id: 'order1' }
        }, action)

        expect(state.isLoading).toBe(false)
        expect(state.orderDetails).toBe(null)
      })
    })

    describe('resetOrderDetails', () => {
      it('should reset order details to null', () => {
        const action = resetOrderDetails()
        const state = orderReducer({
          approvalURL: null,
          isLoading: false,
          orderId: null,
          clientSecret: null,
          paymentIntentId: null,
          orderList: [],
          orderDetails: { _id: 'order1', totalAmount: 100 }
        }, action)

        expect(state.orderDetails).toBe(null)
      })
    })
  })

  describe('Async Actions', () => {
    describe('createNewOrder', () => {
      it('should create order with correct payload', async () => {
        const mockResponse = {
          data: { 
            success: true, 
            orderId: 'order123',
            clientSecret: 'pi_test123_secret_test',
            paymentIntentId: 'pi_test123'
          }
        }
        mockedAxios.post.mockResolvedValue(mockResponse)

        const orderData = {
          userId: 'user123',
          cartItems: [{ productId: 'prod1', quantity: 2 }],
          totalAmount: 200
        }

        const result = await store.dispatch(createNewOrder(orderData))

        expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://localhost:5000/api/shop/order/create',
          orderData
        )
        expect(result.payload).toEqual(mockResponse.data)
      })

      it('should handle createNewOrder network error', async () => {
        const errorMessage = 'Network Error'
        mockedAxios.post.mockRejectedValue(new Error(errorMessage))

        const orderData = {
          userId: 'user123',
          cartItems: [],
          totalAmount: 0
        }

        const result = await store.dispatch(createNewOrder(orderData))

        expect(result.type).toBe(createNewOrder.rejected.type)
      })
    })

    describe('capturePayment', () => {
      it('should capture payment with correct payload', async () => {
        const mockResponse = {
          data: { 
            success: true, 
            message: 'Payment captured successfully',
            data: { _id: 'order123', orderStatus: 'confirmed' }
          }
        }
        mockedAxios.post.mockResolvedValue(mockResponse)

        const captureData = {
          paymentIntentId: 'pi_test123',
          orderId: 'order123'
        }

        const result = await store.dispatch(capturePayment(captureData))

        expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://localhost:5000/api/shop/order/capture',
          captureData
        )
        expect(result.payload).toEqual(mockResponse.data)
      })
    })

    describe('getAllOrdersByUserId', () => {
      it('should fetch orders with correct user ID', async () => {
        const mockResponse = {
          data: { 
            success: true, 
            data: [
              { _id: 'order1', totalAmount: 100 },
              { _id: 'order2', totalAmount: 200 }
            ]
          }
        }
        mockedAxios.get.mockResolvedValue(mockResponse)

        const userId = 'user123'
        const result = await store.dispatch(getAllOrdersByUserId(userId))

        expect(mockedAxios.get).toHaveBeenCalledWith(
          `http://localhost:5000/api/shop/order/list/${userId}`
        )
        expect(result.payload).toEqual(mockResponse.data)
      })
    })

    describe('getOrderDetails', () => {
      it('should fetch order details with correct order ID', async () => {
        const mockResponse = {
          data: { 
            success: true, 
            data: {
              _id: 'order123',
              totalAmount: 150,
              orderStatus: 'confirmed'
            }
          }
        }
        mockedAxios.get.mockResolvedValue(mockResponse)

        const orderId = 'order123'
        const result = await store.dispatch(getOrderDetails(orderId))

        expect(mockedAxios.get).toHaveBeenCalledWith(
          `http://localhost:5000/api/shop/order/details/${orderId}`
        )
        expect(result.payload).toEqual(mockResponse.data)
      })
    })
  })
})