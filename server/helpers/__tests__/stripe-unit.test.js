const stripe = require('../stripe');

describe('Stripe Helper Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create Payment Intent Successfully', () => {
    it('should create payment intent with valid amount', async () => {
      const amount = 100;
      
      const result = await stripe.createPaymentIntent(amount);
      
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('client_secret');
      expect(result.id).toMatch(/^pi_mock_/);
      expect(result.client_secret).toMatch(/^pi_mock_.*_secret_mock/);
      expect(typeof result.id).toBe('string');
      expect(typeof result.client_secret).toBe('string');
    });

    it('should create unique payment intent IDs', async () => {
      const amount1 = 100;
      const amount2 = 200;
      
      const result1 = await stripe.createPaymentIntent(amount1);
      const result2 = await stripe.createPaymentIntent(amount2);
      
      expect(result1.id).not.toBe(result2.id);
      expect(result1.client_secret).not.toBe(result2.client_secret);
    });
  });

  describe('Confirm Payment Successfully', () => {
    it('should confirm payment with valid payment intent ID', async () => {
      const paymentIntentId = 'pi_mock_12345';
      
      const result = await stripe.confirmPayment(paymentIntentId);
      
      expect(result).toHaveProperty('id', paymentIntentId);
      expect(result).toHaveProperty('status', 'succeeded');
      expect(typeof result.id).toBe('string');
      expect(typeof result.status).toBe('string');
    });

    it('should confirm different payment intents', async () => {
      const paymentIntentId1 = 'pi_mock_11111';
      const paymentIntentId2 = 'pi_mock_22222';
      
      const result1 = await stripe.confirmPayment(paymentIntentId1);
      const result2 = await stripe.confirmPayment(paymentIntentId2);
      
      expect(result1.id).toBe(paymentIntentId1);
      expect(result2.id).toBe(paymentIntentId2);
      expect(result1.status).toBe('succeeded');
      expect(result2.status).toBe('succeeded');
    });
  });

  describe('Invalid Amount Input', () => {
    it('should handle zero amount gracefully', async () => {
      const amount = 0;
      
      const result = await stripe.createPaymentIntent(amount);
      
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('client_secret');
    });

    it('should handle negative amount gracefully', async () => {
      const amount = -100;
      
      const result = await stripe.createPaymentIntent(amount);
      
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('client_secret');
    });
  });

  describe('Invalid Payment Intent ID', () => {
    it('should confirm payment with null payment intent ID', async () => {
      const paymentIntentId = null;
      
      const result = await stripe.confirmPayment(paymentIntentId);
      
      expect(result).toHaveProperty('id', paymentIntentId);
      expect(result).toHaveProperty('status', 'succeeded');
    });

    it('should confirm payment with empty string payment intent ID', async () => {
      const paymentIntentId = '';
      
      const result = await stripe.confirmPayment(paymentIntentId);
      
      expect(result).toHaveProperty('id', paymentIntentId);
      expect(result).toHaveProperty('status', 'succeeded');
    });
  });

  describe('Mock Response Format', () => {
    it('should return consistent response format for createPaymentIntent', async () => {
      const amount = 150;
      
      const result = await stripe.createPaymentIntent(amount);
      
      expect(Object.keys(result)).toEqual(['id', 'client_secret']);
      expect(result.id.startsWith('pi_mock_')).toBe(true);
      expect(result.client_secret.includes('_secret_mock')).toBe(true);
    });

    it('should return consistent response format for confirmPayment', async () => {
      const paymentIntentId = 'pi_test_123';
      
      const result = await stripe.confirmPayment(paymentIntentId);
      
      expect(Object.keys(result)).toEqual(['id', 'status']);
      expect(result.id).toBe(paymentIntentId);
      expect(result.status).toBe('succeeded');
    });
  });

  describe('Async Behavior', () => {
    it('should handle createPaymentIntent as async operation', async () => {
      const amount = 100;
      
      const promise = stripe.createPaymentIntent(amount);
      
      expect(promise).toBeInstanceOf(Promise);
      const result = await promise;
      expect(result).toHaveProperty('id');
    });

    it('should handle confirmPayment as async operation', async () => {
      const paymentIntentId = 'pi_test_async';
      
      const promise = stripe.confirmPayment(paymentIntentId);
      
      expect(promise).toBeInstanceOf(Promise);
      const result = await promise;
      expect(result).toHaveProperty('status', 'succeeded');
    });
  });

  describe('Function Parameter Types', () => {
    it('should handle string amount for createPaymentIntent', async () => {
      const amount = '100';
      
      const result = await stripe.createPaymentIntent(amount);
      
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('client_secret');
    });

    it('should handle number payment intent ID for confirmPayment', async () => {
      const paymentIntentId = 12345;
      
      const result = await stripe.confirmPayment(paymentIntentId);
      
      expect(result).toHaveProperty('id', paymentIntentId);
      expect(result).toHaveProperty('status', 'succeeded');
    });
  });
});