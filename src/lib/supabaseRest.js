const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const backendEnabled = Boolean(url && key)
const headers = token => ({ apikey: key, Authorization: `Bearer ${token || key}`, 'Content-Type': 'application/json' })

async function parse(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.msg || data.message || data.error_description || data.error || 'Service request failed')
  return data
}

export async function sendPhoneOtp(phone) {
  if (!backendEnabled) throw new Error('Supabase is not configured')
  return parse(await fetch(`${url}/auth/v1/otp`, { method: 'POST', headers: headers(), body: JSON.stringify({ phone: `+91${phone}`, create_user: true }) }))
}

export async function verifyPhoneOtp(phone, token) {
  const data = await parse(await fetch(`${url}/auth/v1/verify`, { method: 'POST', headers: headers(), body: JSON.stringify({ phone: `+91${phone}`, token, type: 'sms' }) }))
  return { accessToken: data.access_token, user: data.user }
}

export async function fetchVerifiedBusinesses() {
  if (!backendEnabled) return []
  const query = new URLSearchParams({ select: '*', status: 'eq.verified', order: 'verified_at.desc' })
  return parse(await fetch(`${url}/rest/v1/businesses?${query}`, { headers: headers() }))
}

export async function submitBusinessApplication(form, session, joiningFee) {
  const token = session.accessToken
  const userId = session.user.id
  if (joiningFee === 0 && form.pincode !== '505325') {
    const invite = await fetch('/api/invites/redeem', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ code: form.inviteCode }) })
    if (!invite.ok) throw new Error('Friend invite is invalid or already used')
  }
  await parse(await fetch(`${url}/rest/v1/profiles`, { method: 'POST', headers: { ...headers(token), Prefer: 'resolution=merge-duplicates' }, body: JSON.stringify({ id: userId, phone: `+91${form.phone}`, role: 'business' }) }))

  const safeName = form.bannerFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const bannerPath = `${userId}/${crypto.randomUUID()}-${safeName}`
  const upload = await fetch(`${url}/storage/v1/object/business-banners/${bannerPath}`, { method: 'POST', headers: { apikey: key, Authorization: `Bearer ${token}`, 'Content-Type': form.bannerFile.type || 'application/octet-stream', 'x-upsert': 'false' }, body: form.bannerFile })
  if (!upload.ok) throw new Error('Banner upload failed')

  const payload = { owner_id: userId, name: form.name, owner_name: form.ownerName, type: form.type, vehicle_types: form.vehicles, services: form.services, contact_phone: `+91${form.phone}`, publish_contact: form.publishContact, address: form.address, pincode: form.pincode, google_place_id: form.placeId, latitude: form.latitude, longitude: form.longitude, banner_path: bannerPath, status: 'pending_review', payment_status: joiningFee === 0 ? 'invite_waived' : 'pending', joining_fee: joiningFee }
  const created = await parse(await fetch(`${url}/rest/v1/businesses`, { method: 'POST', headers: { ...headers(token), Prefer: 'return=representation' }, body: JSON.stringify(payload) }))
  return created[0]
}

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve()
  return new Promise((resolve, reject) => { const script = document.createElement('script'); script.src = 'https://checkout.razorpay.com/v1/checkout.js'; script.onload = resolve; script.onerror = () => reject(new Error('Payment checkout could not load')); document.head.appendChild(script) })
}

export async function collectPilotPayment(business, form, session) {
  await loadRazorpay()
  const orderResponse = await fetch('/api/payments/create-order', { method: 'POST', headers: { Authorization: `Bearer ${session.accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ businessId: business.id }) })
  const order = await parse(orderResponse)
  return new Promise((resolve, reject) => {
    const checkout = new window.Razorpay({ key: order.keyId, amount: order.amount, currency: order.currency, name: 'Diaghub', description: 'One-time pilot joining fee', order_id: order.orderId, prefill: { name: form.ownerName, contact: `+91${form.phone}` }, theme: { color: '#102c25' }, handler: async result => { try { const verification = await fetch('/api/payments/verify', { method: 'POST', headers: { Authorization: `Bearer ${session.accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...result, businessId: business.id }) }); resolve(await parse(verification)) } catch (error) { reject(error) } }, modal: { ondismiss: () => reject(new Error('Payment was cancelled')) } })
    checkout.open()
  })
}

export function mapBusiness(row) {
  return { id: row.id, type: row.type, name: row.name, ownerName: row.owner_name, phone: row.contact_phone, publishContact: row.publish_contact, services: row.services, vehicles: row.vehicle_types || [], distance: 0, rating: null, reviews: 0, initials: row.name.split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase(), verified: true, placeId: row.google_place_id }
}
