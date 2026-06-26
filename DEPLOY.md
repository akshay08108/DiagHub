# Deploy Diaghub to Vercel

## 1. Prepare Supabase

1. Open **Supabase → SQL Editor**.
2. Run the complete `supabase/schema.sql` file once.
3. In **Authentication → Providers → Phone**, enable phone login and configure an SMS provider.
4. In the SQL editor, create private invite-code hashes using the example at the bottom of `schema.sql`. Use ten one-use codes, or one temporary code with `max_uses = 10`.

## 2. Check Vercel variables

Add every variable listed in `.env.example` to **Vercel → Project Settings → Environment Variables**. Apply them to Production and Preview, then redeploy. Never expose `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, `CARAPI_TOKEN`, or `GEMINI_API_KEY` with a `VITE_` prefix.

## 3. Provider configuration

- Google: restrict the browser key to the Vercel hostname and only Maps JavaScript API + Places API.
- Razorpay: use Test keys for the first deployment. Switch to Live keys only after end-to-end test payments and merchant activation.
- CarAPI: confirm the `/api/obd-codes/{code}` endpoint works with the selected plan.
- Gemini: add `GEMINI_API_KEY` server-side only. DiagHub uses it as an AI fallback for unknown or manufacturer-specific DTC codes.
- Supabase: add the Vercel hostname to allowed redirect/site URLs.

## 4. Deploy

Import the `diaghub` directory as the Vercel project root. Vercel uses `vercel.json`, runs `npm run build`, publishes `dist`, and deploys the server functions under `api/`.

## 5. Required smoke tests

1. Search a known and unknown DTC.
2. Change all six languages.
3. Submit a business with phone OTP, Google location and banner.
4. Confirm the pending business is not public.
5. Approve it in Supabase and confirm it becomes public.
6. Complete a ₹250 Razorpay test payment and verify both `payments` and `businesses.payment_status` update.
7. Redeem one invite and confirm it cannot exceed its configured use count.

Start with provider test modes. Do not accept real payments until the refund, invoice/tax, privacy and contact-publication policies are published.
