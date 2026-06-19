export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' })
  const code = String(request.body?.code || '').trim().toUpperCase()
  if (!code || code.length > 64) return response.status(400).json({ error: 'Invalid invite code' })
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return response.status(503).json({ error: 'Invites are not configured' })
  const userToken = String(request.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!userToken) return response.status(401).json({ error: 'Phone verification required' })
  const publicKey = process.env.VITE_SUPABASE_ANON_KEY
  if (!publicKey) return response.status(503).json({ error: 'Authentication is not configured' })
  const userResponse = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, { headers: { apikey: publicKey, Authorization: `Bearer ${userToken}` } })
  if (!userResponse.ok) return response.status(401).json({ error: 'Invalid session' })

  const result = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/redeem_invite`, {
    method: 'POST',
    headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_code: code }),
  })
  if (!result.ok) return response.status(400).json({ error: 'Invite is invalid or already used' })
  const redeemed = await result.json()
  return response.status(redeemed ? 200 : 400).json({ redeemed: Boolean(redeemed), fee: redeemed ? 0 : 250 })
}
