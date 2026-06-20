import { requireUser } from '../lib/auth.js'

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' })
  const code = String(request.body?.code || '').trim().toUpperCase()
  if (!code || code.length > 64) return response.status(400).json({ error: 'Invalid invite code' })
  try { await requireUser(request) } catch { return response.status(401).json({ error: 'Phone verification required' }) }
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return response.status(503).json({ error: 'Invites are not configured' })
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const result = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/check_invite`, { method: 'POST', headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_code: code }) })
  if (!result.ok || !(await result.json())) return response.status(400).json({ valid: false })
  return response.status(200).json({ valid: true, fee: 0 })
}
