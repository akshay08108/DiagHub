import { dtcCatalog } from '../../src/data/diagnostics.js'
import { getCarApiJwt } from '../lib/carapi.js'

const CODE_PATTERN = /^[PBCU][0-9A-F]{4}$/

export default async function handler(request, response) {
  if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' })
  const code = String(request.query.code || '').toUpperCase()
  if (!CODE_PATTERN.test(code)) return response.status(400).json({ error: 'Invalid DTC format' })

  const bundled = dtcCatalog[code]
  if (bundled) return response.status(200).setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800').json({
    code,
    description: bundled[0],
    explanation: bundled[1],
    causes: bundled[2],
    source: 'diaghub',
  })

  const misfireCylinder = /^P03(0[1-9]|1[0-2])$/.test(code) ? Number(code.slice(3)) : 0
  if (misfireCylinder) return response.status(200).setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800').json({
    code,
    description: `Cylinder ${misfireCylinder} misfire detected`,
    explanation: `Cylinder ${misfireCylinder} is not burning fuel correctly. The engine may shake, lose power, or use more fuel.`,
    causes: ['Worn spark plug', 'Faulty ignition coil', 'Fuel injector or compression issue'],
    source: 'diaghub',
  })

  const baseUrl = process.env.CARAPI_BASE_URL || 'https://carapi.app/api'
  const headers = { Accept: 'application/json' }

  try {
    const jwt = await getCarApiJwt()
    if (jwt) headers.Authorization = `Bearer ${jwt}`
    const upstream = await fetch(`${baseUrl}/obd-codes/${encodeURIComponent(code)}`, { headers })
    if (!upstream.ok) return response.status(upstream.status === 404 ? 404 : 502).json({ error: 'DTC provider unavailable' })
    const payload = await upstream.json()
    const rawData = payload.data || payload.obd_code || payload
    const data = Array.isArray(rawData) ? rawData.find(item => String(item.code || '').toUpperCase() === code) || rawData[0] : rawData
    if (!data || !(data.description || data.definition || data.name)) return response.status(404).json({ error: 'DTC description not found' })
    return response.status(200).setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800').json({
      code,
      description: data.description || data.definition || data.name || null,
      explanation: data.explanation || data.details || null,
      causes: Array.isArray(data.causes) ? data.causes : [],
      source: 'carapi',
    })
  } catch {
    return response.status(502).json({ error: 'DTC provider unavailable' })
  }
}
