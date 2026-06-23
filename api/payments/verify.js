import crypto from 'node:crypto'
import { adminHeaders, requireOwnedBusiness, requireUser } from '../_lib/auth.js'

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' })
  if (!process.env.RAZORPAY_KEY_SECRET) return response.status(503).json({ error: 'Payments are not configured' })
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature, businessId } = request.body || {}
  if (![orderId, paymentId, signature].every(value => typeof value === 'string' && value.length > 5)) return response.status(400).json({ error: 'Missing payment verification data' })
  try { const { user } = await requireUser(request); await requireOwnedBusiness(String(businessId || ''), user.id) } catch { return response.status(401).json({ error: 'Invalid session or business application' }) }

  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex')
  const valid = expected.length === signature.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  if (!valid) return response.status(400).json({ error: 'Invalid payment signature' })
  await Promise.all([
    fetch(`${process.env.SUPABASE_URL}/rest/v1/businesses?id=eq.${encodeURIComponent(businessId)}`, { method: 'PATCH', headers: adminHeaders(), body: JSON.stringify({ payment_status: 'paid' }) }),
    fetch(`${process.env.SUPABASE_URL}/rest/v1/payments?provider_order_id=eq.${encodeURIComponent(orderId)}`, { method: 'PATCH', headers: adminHeaders(), body: JSON.stringify({ provider_payment_id: paymentId, status: 'paid' }) }),
  ])
  return response.status(200).json({ verified: true, paymentId })
}
