let cachedJwt = ''
let cachedUntil = 0

function tokenExpiry(jwt) {
  try {
    const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString('utf8'))
    return Number(payload.exp || 0) * 1000
  } catch { return 0 }
}

export async function getCarApiJwt() {
  const now = Date.now()
  if (cachedJwt && cachedUntil > now + 60_000) return cachedJwt

  const configuredJwt = process.env.CARAPI_JWT
  if (configuredJwt && tokenExpiry(configuredJwt) > now + 60_000) {
    cachedJwt = configuredJwt
    cachedUntil = tokenExpiry(configuredJwt)
    return cachedJwt
  }

  const apiToken = process.env.CARAPI_API_TOKEN
  const apiSecret = process.env.CARAPI_API_SECRET
  if (!apiToken || !apiSecret) return ''

  const baseUrl = process.env.CARAPI_BASE_URL || 'https://carapi.app/api'
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { Accept: 'text/plain', 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_token: apiToken, api_secret: apiSecret }),
  })
  if (!response.ok) throw new Error('CARAPI_AUTH_FAILED')

  let jwt = (await response.text()).trim()
  if (jwt.startsWith('"') && jwt.endsWith('"')) jwt = JSON.parse(jwt)
  if (!jwt || jwt.split('.').length !== 3) throw new Error('CARAPI_AUTH_FAILED')

  cachedJwt = jwt
  cachedUntil = tokenExpiry(jwt) || now + 6 * 60 * 60 * 1000
  return cachedJwt
}
