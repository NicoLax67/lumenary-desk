# Lumenary Desk Checkout

The current checkout is a visible demo/test mode. It validates buyer details,
keeps the selected plan and price in the order summary, supports success and
cancel states, and never collects card data or pretends to charge a customer.

## Live payment integration point

Use a server-side payment route before enabling live payments. For Stripe, add
the official Stripe SDK on the server only, create Checkout Sessions from the
selected plan ID, and redirect the customer to Stripe-hosted Checkout.

Required hosted secrets:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_CHECKOUT_MODE=live`

The public UI should stay in demo mode unless those secrets exist in the hosted
environment and the server route returns a real provider checkout URL.
