const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models'

function extractJson(text) {
  const cleaned = String(text || '').replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  try {
    return JSON.parse(cleaned.slice(start, end + 1))
  } catch {
    return null
  }
}

function normalizeGeminiPayload(code, data) {
  if (!data?.title && !data?.description) return null
  const causes = Array.isArray(data.causes) ? data.causes.filter(Boolean).slice(0, 6) : []
  const fixes = Array.isArray(data.fixes) ? data.fixes.filter(Boolean).slice(0, 6) : []
  const summaryParts = [data.description, data.symptoms && `Symptoms: ${data.symptoms}`, fixes.length && `Checks: ${fixes.join(', ')}`].filter(Boolean)
  return {
    code,
    description: data.title || data.description,
    explanation: summaryParts.join(' '),
    causes: causes.length ? causes : fixes,
    fixes,
    severity: data.severity || null,
    source: 'gemini',
  }
}

export async function lookupDtcWithGemini(code, language = 'en') {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  const prompt = [
    `You are DiagHub's automotive diagnostic assistant.`,
    `Find a practical OBD2/DTC explanation for code ${code}.`,
    `Respond in language code "${language}".`,
    `Return only strict JSON with keys: code, title, description, symptoms, causes, fixes, severity.`,
    `Use cautious automotive wording. If the code can be manufacturer-specific, say that clearly.`,
    `Do not invent exact vehicle-specific repair procedures without saying scanner/live data confirmation is required.`,
  ].join('\n')

  const result = await fetch(`${GEMINI_ENDPOINT}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!result.ok) return null
  const payload = await result.json()
  const text = payload?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('\n')
  return normalizeGeminiPayload(code, extractJson(text))
}
