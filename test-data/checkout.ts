// Synthetic payment data for Automation Exercise's practice checkout only.
// These values are not real payment credentials.
export const paymentData = {
  nameOnCard: 'AEQA Tester',
  cardNumber: '4111111111111111',
  cvc: '123',
  expiryMonth: '12',
  expiryYear: String(new Date().getFullYear() + 2),
};

export type PaymentData = typeof paymentData;

export const orderComment = 'Please deliver this QA test order during business hours.';
