const Stripe = require('stripe');

// For demo purposes, you can use test keys or create a mock implementation
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key');

// Mock Stripe functionality for demo purposes
const mockStripe = {
  paymentIntents: {
    create: async (params) => {
      // Simulate successful payment intent creation
      return {
        id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: params.amount,
        currency: params.currency,
        status: 'requires_payment_method',
        client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        metadata: params.metadata || {}
      };
    },
    confirm: async (paymentIntentId, params) => {
      // Simulate successful payment confirmation
      return {
        id: paymentIntentId,
        status: 'succeeded',
        charges: {
          data: [{
            id: `ch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount: 0, // Will be set by the calling function
            currency: 'usd',
            status: 'succeeded'
          }]
        }
      };
    }
  }
};

// Use mock for demo, real Stripe if you have valid keys
const stripeInstance = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_') 
  ? stripe 
  : mockStripe;

module.exports = stripeInstance;