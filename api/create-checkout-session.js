import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
                name: 'Inbox Story Mode Premium',
                description: 'Unlock unlimited emails, themes, and power features!',
              },
              unit_amount: 399, // $3.99
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}?success=true`,
        cancel_url: `${req.headers.origin}?canceled=true`,
      });

      res.status(200).json({ id: session.id });
    } catch (err) {
      console.error('Stripe checkout session error', err);
      res.status(500).json({ error: 'Failed to create Stripe session' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}