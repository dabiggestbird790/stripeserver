import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ← use env variable

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Story Mode Premium',
                description: 'Unlocks new backgrounds, themes, and auto-advance speed settings!',
              },
              unit_amount: 199, // $1.99 in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      });

      res.status(200).json({ id: session.id });
    } catch (err) {
      console.error('Stripe checkout session error:', err);
      res.status(500).json({ error: 'Failed to create Stripe session.' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}