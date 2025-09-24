import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import StripeCheckout from '../stripe-checkout'
import orderReducer from '@/store/shop/order-slice'
import authReducer from '@/store/auth-slice'

// Mock dependencies
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({
    elements: vi.fn(() => ({
      create: vi.fn(() => ({
        mount: vi.fn(),
        unmount: vi.fn(),
        on: vi.fn()
      }))
    }))
  }))
}))

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      shopOrder: orderReducer
    },
    preloadedState: {
      auth: {
        isAuthenticated: true,
        user: { id: 'user123' },
        isLoading: false
      },
      shopOrder: {
        approvalURL: null,
        isLoading: false,
        orderId: 'order123',
        orderList: [],
        orderDetails: null,
        clientSecret: 'pi_test123_secret_test',
        paymentIntentId: 'pi_test123'
      },
      ...initialState
    }
  })
}

describe('StripeCheckout Component', () => {
  let store

  beforeEach(() => {
    store = createMockStore()
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render checkout form with demo card details', () => {
      render(
        <Provider store={store}>
          <StripeCheckout />
        </Provider>
      )

      expect(screen.getByText('Complete Your Payment')).toBeInTheDocument()
      expect(screen.getByText('Demo Mode - Use Test Card Details:')).toBeInTheDocument()
      expect(screen.getByText('Card Number: 4242 4242 4242 4242')).toBeInTheDocument()
      expect(screen.getByText('Expiry: 12/34')).toBeInTheDocument()
      expect(screen.getByText('CVC: 123')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Complete Payment' })).toBeInTheDocument()
    })

    it('should show loading state when processing payment', () => {
      const storeWithLoading = createMockStore({
        shopOrder: {
          approvalURL: null,
          isLoading: true,
          orderId: 'order123',
          orderList: [],
          orderDetails: null,
          clientSecret: 'pi_test123_secret_test',
          paymentIntentId: 'pi_test123'
        }
      })

      render(
        <Provider store={storeWithLoading}>
          <StripeCheckout />
        </Provider>
      )

      const submitButton = screen.getByRole('button', { name: 'Processing...' })
      expect(submitButton).toBeDisabled()
    })

    it('should disable button when no client secret available', () => {
      const storeWithoutSecret = createMockStore({
        shopOrder: {
          approvalURL: null,
          isLoading: false,
          orderId: 'order123',
          orderList: [],
          orderDetails: null,
          clientSecret: null,
          paymentIntentId: null
        }
      })

      render(
        <Provider store={storeWithoutSecret}>
          <StripeCheckout />
        </Provider>
      )

      const submitButton = screen.getByRole('button', { name: 'Complete Payment' })
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Form Validation', () => {
    it('should show validation error for empty card number', async () => {
      render(
        <Provider store={store}>
          <StripeCheckout />
        </Provider>
      )

      const cardInput = screen.getByLabelText('Card Number')
      const submitButton = screen.getByRole('button', { name: 'Complete Payment' })

      fireEvent.change(cardInput, { target: { value: '' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid card number')).toBeInTheDocument()
      })
    })

    it('should show validation error for invalid card number', async () => {
      render(
        <Provider store={store}>
          <StripeCheckout />
        </Provider>
      )

      const cardInput = screen.getByLabelText('Card Number')
      const submitButton = screen.getByRole('button', { name: 'Complete Payment' })

      fireEvent.change(cardInput, { target: { value: '1234' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid card number')).toBeInTheDocument()
      })
    })

    it('should show validation error for empty expiry date', async () => {
      render(
        <Provider store={store}>
          <StripeCheckout />
        </Provider>
      )

      const expiryInput = screen.getByLabelText('Expiry Date')
      const submitButton = screen.getByRole('button', { name: 'Complete Payment' })

      fireEvent.change(expiryInput, { target: { value: '' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Please enter expiry date')).toBeInTheDocument()
      })
    })

    it('should show validation error for invalid expiry date format', async () => {
      render(
        <Provider store={store}>
          <StripeCheckout />
        </Provider>
      )

      const expiryInput = screen.getByLabelText('Expiry Date')
      const submitButton = screen.getByRole('button', { name: 'Complete Payment' })

      fireEvent.change(expiryInput, { target: { value: '13/24' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Please enter valid expiry date (MM/YY)')).toBeInTheDocument()
      })
    })

    it('should show validation error for empty CVC', async () => {
      render(
        <Provider store={store}>
          <StripeCheckout />
        </Provider>
      )

      const cvcInput = screen.getByLabelText('CVC')
      const submitButton = screen.getByRole('button', { name: 'Complete Payment' })

      fireEvent.change(cvcInput, { target: { value: '' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Please enter CVC')).toBeInTheDocument()
      })
    })

    it('should show validation error for invalid CVC length', async () => {
      render(
        <Provider store={store}>
          <StripeCheckout />
        </Provider>
      )

      const cvcInput = screen.getByLabelText('CVC')
      const submitButton = screen.getByRole('button', { name: 'Complete Payment' })

      fireEvent.change(cvcInput, { target: { value: '12' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('CVC must be 3 digits')).toBeInTheDocument()
      })
    })
  })

  describe('Form Input Formatting', () => {
    it('should format card number with spaces', () => {
      render(
        <Provider store={store}>
          <StripeCheckout />
        </Provider>
      )

      const cardInput = screen.getByLabelText('Card Number')
      
      fireEvent.change(cardInput, { target: { value: '4242424242424242' } })
      
      expect(cardInput.value).toBe('4242 4242 4242 4242')
    })

    it('should format expiry date with slash', () => {
      render(
        <Provider store={store}>
          <StripeCheckout />
        </Provider>
      )

      const expiryInput = screen.getByLabelText('Expiry Date')
      
      fireEvent.change(expiryInput, { target: { value: '1234' } })
      
      expect(expiryInput.value).toBe('12/34')
    })

    it('should limit card number to 19 characters', () => {
      render(
        <Provider store={store}>
          <StripeCheckout />
        </Provider>
      )

      const cardInput = screen.getByLabelText('Card Number')
      
      fireEvent.change(cardInput, { target: { value: '42424242424242424242' } })
      
      expect(cardInput.value.length).toBeLessThanOrEqual(19)
    })

    it('should limit CVC to 3 digits', () => {
      render(
        <Provider store={store}>
          <StripeCheckout />
        </Provider>
      )

      const cvcInput = screen.getByLabelText('CVC')
      
      fireEvent.change(cvcInput, { target: { value: '12345' } })
      
      expect(cvcInput.value).toBe('123')
    })

    it('should limit expiry to 5 characters', () => {
      render(
        <Provider store={store}>
          <StripeCheckout />
        </Provider>
      )

      const expiryInput = screen.getByLabelText('Expiry Date')
      
      fireEvent.change(expiryInput, { target: { value: '123456' } })
      
      expect(expiryInput.value.length).toBeLessThanOrEqual(5)
    })
  })

  describe('Payment Processing', () => {
    it('should dispatch capturePayment with valid form data', async () => {
      const mockDispatch = vi.fn()
      store.dispatch = mockDispatch

      render(
        <Provider store={store}>
          <StripeCheckout />
        </Provider>
      )

      const cardInput = screen.getByLabelText('Card Number')
      const expiryInput = screen.getByLabelText('Expiry Date')
      const cvcInput = screen.getByLabelText('CVC')
      const submitButton = screen.getByRole('button', { name: 'Complete Payment' })

      fireEvent.change(cardInput, { target: { value: '4242424242424242' } })
      fireEvent.change(expiryInput, { target: { value: '1234' } })
      fireEvent.change(cvcInput, { target: { value: '123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: expect.stringContaining('capturePayment')
          })
        )
      })
    })

    it('should show success message after successful payment', async () => {
      render(
        <Provider store={store}>
          <StripeCheckout />
        </Provider>
      )

      const cardInput = screen.getByLabelText('Card Number')
      const expiryInput = screen.getByLabelText('Expiry Date')
      const cvcInput = screen.getByLabelText('CVC')
      const submitButton = screen.getByRole('button', { name: 'Complete Payment' })

      fireEvent.change(cardInput, { target: { value: '4242424242424242' } })
      fireEvent.change(expiryInput, { target: { value: '1234' } })
      fireEvent.change(cvcInput, { target: { value: '123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Payment processed successfully!')).toBeInTheDocument()
      })
    })
  })
})