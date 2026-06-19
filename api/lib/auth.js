export async function requireUser(request) {
  const token = String(request.headers.authorization || '').replace(/^Bearer\s+/i, '')
  const publicKey = process.env.VITE_SUPABASE_ANON_KEY
  if (!token || !publicKey || !process.env.SUPABASE_URL) throw new Error('UNAUTHORIZED')
  const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, { headers: { apikey: publicKey, Authorization: `Bearer ${token}` } })
  if (!response.ok) throw new Error('UNAUTHORIZED')
  return { user: await response.json(), token }
}

export function adminHeaders(extra = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...extra }
}

export async function requireOwnedBusiness(businessId, userId) {
  if (!/^[0-9a-f-]{36}$/i.test(businessId)) throw new Error('INVALID_BUSINESS')
  const query = new URLSearchParams({ select: 'id,owner_id,payment_status', id: `eq.${businessId}`, owner_id: `eq.${userId}`, limit: '1' })
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/businesses?${query}`, { headers: adminHeaders() })
  if (!response.ok) throw new Error('DATABASE_ERROR')
  const rows = await response.json()
  if (!rows[0]) throw new Error('INVALID_BUSINESS')
  return rows[0]
}
