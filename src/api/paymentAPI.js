import api from './index';

export const paymentAPI = {
  // Create payment intent
  createPaymentIntent: (amount, currency = 'usd') => 
    api.post('/payments/create-intent', { amount, currency }),
  
  // Confirm payment
  confirmPayment: (paymentIntentId) => 
    api.post('/payments/confirm', { paymentIntentId }),
  
  // Get payment by ID
  getPayment: (id) => api.get(`/payments/${id}`),
  
  // Get user payments
  getUserPayments: (params = {}) => 
    api.get('/payments/user', { params }),
  
  // Create subscription
  createSubscription: (priceId) => 
    api.post('/payments/subscribe', { priceId }),
  
  // Cancel subscription
  cancelSubscription: (subscriptionId) => 
    api.post('/payments/cancel-subscription', { subscriptionId }),
  
  // Update subscription
  updateSubscription: (subscriptionId, updates) => 
    api.put(`/payments/subscriptions/${subscriptionId}`, updates),
  
  // Get user subscriptions
  getSubscriptions: () => api.get('/payments/subscriptions'),
  
  // Get subscription by ID
  getSubscription: (id) => api.get(`/payments/subscriptions/${id}`),
  
  // Get pricing plans
  getPricingPlans: () => api.get('/payments/plans'),
  
  // Process refund
  processRefund: (paymentId, amount) => 
    api.post('/payments/refund', { paymentId, amount }),
  
  // Get payment methods
  getPaymentMethods: () => api.get('/payments/payment-methods'),
  
  // Add payment method
  addPaymentMethod: (paymentMethodData) => 
    api.post('/payments/payment-methods', paymentMethodData),
  
  // Remove payment method
  removePaymentMethod: (paymentMethodId) => 
    api.delete(`/payments/payment-methods/${paymentMethodId}`),
};

export default paymentAPI;