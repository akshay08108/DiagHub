# Diaghub React website pilot

A responsive React/Vite prototype for testing Diaghub with vehicle owners, mechanics, auto electricians, and parts sellers.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:4173`.

## Included

- DTC search with five representative codes
- English, Hindi, Telugu, Marathi, Tamil, and Kannada language selector
- Car, truck, and tractor diagnosis context
- Photo-upload demonstration flow
- Pincode and radius-based local discovery concept
- Mechanic, auto-electrician, and parts-seller cards
- Business and vehicle-type directory filters
- Mechanic/electrician onboarding for cars, trucks, tractors, or any combination
- Transparent ₹250 one-time pilot fee with a separate payment-review step
- Telugu, Hindi, English, Tamil, Kannada, and Malayalam core interface translations
- Vercel API scaffolding for CarAPI DTC lookup, payment orders/signature checks, and invite redemption
- Supabase schema with phone-owner profiles, approval-only business visibility, payments, and hashed invite codes
- Required Google Place ID and shop-banner evidence for business applications
- Owner-submitted pilot listings with phone, brands/services, address, consent, and review status
- Radius/type filtering, persistent local listings, and owner removal controls
- Garage and saved diagnosis state
- Pilot partner onboarding form

The app now contains live integration paths for Supabase phone OTP/storage/database, Google Places, Razorpay signed checkout, CarAPI DTC lookup and Vercel server functions. Without environment variables it falls back to a safe local preview. Follow `DEPLOY.md` and complete provider test-mode checks before accepting real users or payments.

## Real-pilot setup

1. Create a Supabase project and run `supabase/schema.sql` in its SQL editor.
2. Create ten private, one-use invite codes and store only their hashes using the example at the end of the schema.
3. Configure phone authentication in Supabase with an SMS provider.
4. Create restricted Google Maps JavaScript and Places API credentials.
5. Create a merchant payment-gateway account and add its server credentials to Vercel.
6. Create a CarAPI account/token and confirm Indian manufacturer-specific DTC coverage.
7. Copy `.env.example` into Vercel project environment variables; never expose server-only secrets with a `VITE_` prefix.
8. Deploy the repository to Vercel and test in provider sandbox/test modes before accepting real payments.

The current frontend remains in safe demo-payment mode until these credentials and backend services are configured.
