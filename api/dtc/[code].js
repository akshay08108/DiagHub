import { getCarApiJwt } from '../_lib/carapi.js'
import { lookupDtcWithGemini } from '../_lib/geminiDtc.js'
import { diagnosisFor, dtcCatalog } from '../../src/data/diagnostics.js'

const CODE_PATTERN = /^[PBCU][0-9A-F]{4}$/
const LANG_PATTERN = /^[a-z]{2}$/

function localPayload(code, language) {
  const local = diagnosisFor(code, language)
  return { code, description: local.title, explanation: local.summary, causes: local.causes, source: 'local' }
}

async function fallbackPayload(code, language) {
  const gemini = await lookupDtcWithGemini(code, language).catch(() => null)
  return gemini || localPayload(code, language)
}

export default async function handler(request, response) {
  if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' })
  const code = String(request.query.code || '').toUpperCase()
  if (!CODE_PATTERN.test(code)) return response.status(400).json({ error: 'Invalid DTC format' })
  const language = LANG_PATTERN.test(String(request.query.lang || '')) ? String(request.query.lang) : 'en'

  const baseUrl = process.env.CARAPI_BASE_URL || 'https://carapi.app/api'
  const headers = { Accept: 'application/json' }
  const hasLocalMatch = Boolean(dtcCatalog[code])

  try {
    const jwt = process.env.CARAPI_TOKEN || await getCarApiJwt()
    if (!jwt) return response.status(200).json(hasLocalMatch ? localPayload(code, language) : await fallbackPayload(code, language))
    headers.Authorization = `Bearer ${jwt}`

    const upstream = await fetch(`${baseUrl}/obd-codes/${encodeURIComponent(code)}`, { headers })
    if (!upstream.ok) return response.status(200).json(hasLocalMatch ? localPayload(code, language) : await fallbackPayload(code, language))
    const payload = await upstream.json()
    const data = payload.data || payload
    const carApiPayload = {
      code,
      description: data.description || data.definition || data.name || null,
      explanation: data.explanation || data.details || null,
      causes: Array.isArray(data.causes) && data.causes.length ? data.causes : localPayload(code, language).causes,
      source: 'carapi',
    }
    if (!carApiPayload.description && !carApiPayload.explanation) return response.status(200).json(hasLocalMatch ? localPayload(code, language) : await fallbackPayload(code, language))
    response.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800')
    return response.status(200).json(carApiPayload)
  } catch {
    return response.status(200).json(hasLocalMatch ? localPayload(code, language) : await fallbackPayload(code, language))
  }
}
