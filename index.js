const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors());
app.use(express.json());

// Main checkout session route
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Inbox Story Mode Premium',
            description: 'Unlock unlimited emails, new backgrounds, themes, and super features!',
          },
          unit_amount: 399, // $3.99 in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}?success=true`,
      cancel_url: `${req.headers.origin}?canceled=true`,
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe Checkout Session:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Export for Vercel serverless functions
module.exports = app;

// If running locally, listen on a port
if (require.main === module) {
  const PORT = process.env.PORT || 4242;
  app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
}