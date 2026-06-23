const PILOT_FEE_PAISE = 25000
import { adminHeaders, requireOwnedBusiness, requireUser } from '../_lib/auth.js'

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' })
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return response.status(503).json({ error: 'Payments are not configured' })

  const businessId = String(request.body?.businessId || '')
  let user
  try { ({ user } = await requireUser(request)); await requireOwnedBusiness(businessId, user.id) } catch { return response.status(401).json({ error: 'Invalid session or business application' }) }

  const credentials = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')
  const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: PILOT_FEE_PAISE, currency: 'INR', receipt: `pilot_${businessId.slice(0, 18)}`, notes: { business_id: businessId } }),
  })
  if (!orderResponse.ok) return response.status(502).json({ error: 'Unable to create payment order' })
  const order = await orderResponse.json()
  await fetch(`${process.env.SUPABASE_URL}/rest/v1/payments`, { method: 'POST', headers: adminHeaders(), body: JSON.stringify({ business_id: businessId, provider_order_id: order.id, amount_paise: PILOT_FEE_PAISE, status: 'pending' }) })
  return response.status(200).json({ orderId: order.id, amount: PILOT_FEE_PAISE, currency: 'INR', keyId: process.env.RAZORPAY_KEY_ID })
}
