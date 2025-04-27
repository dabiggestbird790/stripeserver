const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Inbox Story Mode Premium',
            description: 'Unlock unlimited emails, themes, and power features.',
          },
          unit_amount: 399, // 3.99 USD
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: 'https://mail.google.com',
      cancel_url: 'https://mail.google.com',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe Checkout Session', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 4242;
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}