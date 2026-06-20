import { useEffect, useMemo, useState } from 'react'
import { backendEnabled, collectPilotPayment, fetchVerifiedBusinesses, mapBusiness, sendPhoneOtp, submitBusinessApplication, verifyPhoneOtp } from './lib/supabaseRest.js'
import GooglePlacePicker, { resolvePincode } from './components/GooglePlacePicker.jsx'
import { diagnosisFor, dtcCatalog } from './data/diagnostics.js'
import { vehicleMakes, vehicleYears } from './data/vehicles.js'

const languages = [
  ['en', 'English'], ['hi', 'हिन्दी'], ['te', 'తెలుగు'],
  ['ta', 'தமிழ்'], ['kn', 'ಕನ್ನಡ'], ['ml', 'മലയാളം'],
]

const copy = {
  en: { eyebrow: 'Clear answers. Trusted local help.', title: "That warning light doesn’t have to be a mystery.", intro: 'Enter your fault code or scan a photo. Diaghub explains what it means, how urgent it is, and who nearby can help.', diagnose: 'Diagnose', nearby: 'Nearby', garage: 'My garage', code: 'Enter code', photo: 'Scan photo', explain: 'Explain this code', local: 'Trusted help, close to home.' },
  hi: { eyebrow: 'साफ़ जवाब। भरोसेमंद स्थानीय मदद।', title: 'वाहन की चेतावनी लाइट अब रहस्य नहीं।', intro: 'फॉल्ट कोड डालें या फोटो स्कैन करें। Diaghub उसका अर्थ, गंभीरता और नज़दीकी मदद बताता है।', diagnose: 'जाँच', nearby: 'नज़दीक', garage: 'मेरा गैराज', code: 'कोड डालें', photo: 'फोटो स्कैन', explain: 'कोड समझाएँ', local: 'भरोसेमंद मदद, आपके पास।' },
  te: { eyebrow: 'స్పష్టమైన సమాధానాలు. నమ్మకమైన స్థానిక సహాయం.', title: 'వాహన వార్నింగ్ లైట్ ఇక రహస్యం కాదు.', intro: 'ఫాల్ట్ కోడ్ నమోదు చేయండి లేదా ఫోటో స్కాన్ చేయండి. Diaghub అర్థం, అత్యవసరత, సమీప సహాయాన్ని వివరిస్తుంది.', diagnose: 'డయాగ్నోస్', nearby: 'సమీపంలో', garage: 'నా గ్యారేజ్', code: 'కోడ్ నమోదు', photo: 'ఫోటో స్కాన్', explain: 'కోడ్ వివరించు', local: 'నమ్మకమైన సహాయం, మీకు దగ్గరలో.' },
  ta: { eyebrow: 'தெளிவான பதில்கள். நம்பகமான உள்ளூர் உதவி.', title: 'வாகன எச்சரிக்கை விளக்கு இனி மர்மமல்ல.', intro: 'பிழைக் குறியீட்டை உள்ளிடுங்கள் அல்லது புகைப்படத்தை ஸ்கேன் செய்யுங்கள். அதன் பொருள், அவசரம் மற்றும் அருகிலுள்ள உதவியை Diaghub விளக்கும்.', diagnose: 'கண்டறிதல்', nearby: 'அருகில்', garage: 'என் வாகனங்கள்', code: 'குறியீட்டை உள்ளிடு', photo: 'படத்தை ஸ்கேன் செய்', explain: 'குறியீட்டை விளக்கு', local: 'நம்பகமான உதவி, உங்கள் அருகில்.' },
  kn: { eyebrow: 'ಸ್ಪಷ್ಟ ಉತ್ತರಗಳು. ವಿಶ್ವಾಸಾರ್ಹ ಸ್ಥಳೀಯ ಸಹಾಯ.', title: 'ವಾಹನದ ಎಚ್ಚರಿಕೆ ದೀಪ ಇನ್ನು ರಹಸ್ಯವಲ್ಲ.', intro: 'ದೋಷ ಕೋಡ್ ನಮೂದಿಸಿ ಅಥವಾ ಫೋಟೋ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ. ಅದರ ಅರ್ಥ, ತುರ್ತು ಮತ್ತು ಹತ್ತಿರದ ಸಹಾಯವನ್ನು Diaghub ವಿವರಿಸುತ್ತದೆ.', diagnose: 'ಪರಿಶೀಲನೆ', nearby: 'ಹತ್ತಿರ', garage: 'ನನ್ನ ವಾಹನಗಳು', code: 'ಕೋಡ್ ನಮೂದಿಸಿ', photo: 'ಫೋಟೋ ಸ್ಕ್ಯಾನ್', explain: 'ಕೋಡ್ ವಿವರಿಸಿ', local: 'ವಿಶ್ವಾಸಾರ್ಹ ಸಹಾಯ, ನಿಮ್ಮ ಹತ್ತಿರ.' },
  ml: { eyebrow: 'വ്യക്തമായ ഉത്തരങ്ങൾ. വിശ്വസനീയമായ പ്രാദേശിക സഹായം.', title: 'വാഹന മുന്നറിയിപ്പ് ലൈറ്റ് ഇനി ഒരു രഹസ്യമല്ല.', intro: 'ഫോൾട്ട് കോഡ് നൽകുക അല്ലെങ്കിൽ ചിത്രം സ്കാൻ ചെയ്യുക. അർത്ഥം, അടിയന്തരത, സമീപ സഹായം എന്നിവ Diaghub വിശദീകരിക്കും.', diagnose: 'പരിശോധന', nearby: 'സമീപത്ത്', garage: 'എന്റെ വാഹനങ്ങൾ', code: 'കോഡ് നൽകുക', photo: 'ചിത്രം സ്കാൻ ചെയ്യുക', explain: 'കോഡ് വിശദീകരിക്കുക', local: 'വിശ്വസനീയമായ സഹായം, നിങ്ങളുടെ സമീപത്ത്.' },
}

const seedBusinesses = [
  { id: 'm1', type: 'mechanic', name: 'Mallesh Auto Works', ownerName: 'Mallesh (demo)', phone: '00000 00000', publishContact: true, services: 'Engine · Diesel · General service', vehicles: ['car', 'truck', 'tractor'], distance: 4.2, rating: 4.8, reviews: 26, initials: 'MK', verified: true },
  { id: 's1', type: 'store', name: 'Akshay Auto Parts', ownerName: 'Akshay (demo)', phone: '00000 00000', publishContact: true, services: 'Tata · Maruti · Mahindra · Bosch', vehicles: ['car', 'truck', 'tractor'], distance: 7.8, rating: 4.6, reviews: 41, initials: 'AP', verified: true },
  { id: 'e1', type: 'electrician', name: 'Sri Sai Auto Electricals', ownerName: 'Sai (demo)', phone: '00000 00000', publishContact: true, services: 'Battery · Alternator · Wiring · Lights', vehicles: ['car', 'truck'], distance: 12.1, rating: 4.7, reviews: 18, initials: 'SS', verified: true },
]

const blankForm = { type: 'mechanic', name: '', ownerName: '', phone: '', pincode: '505325', services: '', address: '', bannerName: '', bannerFile: null, bannerPreview: '', placeId: '', latitude: null, longitude: null, vehicles: ['car'], inviteCode: '', publishContact: false, consent: false }

function Brand() {
  return <a className="brand" href="#" aria-label="Diaghub home"><span className="brand-mark"><svg viewBox="0 0 24 24"><path d="M7 7h10l3 4v6a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2H9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6l3-4Z"/><path d="m8 11 1.3-2h5.4l1.3 2M7 14h2m6 0h2"/></svg></span><span>Diag<span>hub</span></span></a>
}

function App() {
  const [section, setSection] = useState('diagnose')
  const [language, setLanguage] = useState('en')
  const [mode, setMode] = useState('code')
  const [code, setCode] = useState('P0301')
  const [resultCode, setResultCode] = useState('P0301')
  const [remoteDiagnosis, setRemoteDiagnosis] = useState(null)
  const [codeError, setCodeError] = useState(false)
  const [pincode, setPincode] = useState('505325')
  const [areaPincode, setAreaPincode] = useState('505325')
  const [areaLabel, setAreaLabel] = useState('Jagtial region')
  const [updatingArea, setUpdatingArea] = useState(false)
  const [vehicleType, setVehicleType] = useState('car')
  const [vehicleMake, setVehicleMake] = useState(vehicleMakes.car[0])
  const [vehicleYear, setVehicleYear] = useState(vehicleYears[0])
  const [radius, setRadius] = useState(25)
  const [filter, setFilter] = useState('all')
  const [vehicleFilter, setVehicleFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(blankForm)
  const [toast, setToast] = useState('')
  const [saved, setSaved] = useState(false)
  const [diagnosticPhoto, setDiagnosticPhoto] = useState({ name: '', preview: '' })
  const [pilotBusinesses, setPilotBusinesses] = useState(() => {
    try { return JSON.parse(localStorage.getItem('diaghubReactBusinesses') || '[]') } catch { return [] }
  })
  const [remoteBusinesses, setRemoteBusinesses] = useState([])
  const t = copy[language] || copy.en
  const diagnosis = diagnosisFor(resultCode, language, remoteDiagnosis)

  useEffect(() => { localStorage.setItem('diaghubReactBusinesses', JSON.stringify(pilotBusinesses)) }, [pilotBusinesses])
  useEffect(() => { if (backendEnabled) fetchVerifiedBusinesses().then(rows => setRemoteBusinesses(rows.map(mapBusiness))).catch(() => setToast('Could not load live businesses')) }, [])
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2400); return () => clearTimeout(timer) }, [toast])

  const businesses = useMemo(() => [...(backendEnabled ? remoteBusinesses : seedBusinesses), ...pilotBusinesses.filter(item => item.verified)].filter(item => {
    const typeMatch = filter === 'all' || item.type === filter
    const vehicleMatch = vehicleFilter === 'all' || item.vehicles.includes(vehicleFilter)
    return typeMatch && vehicleMatch && item.distance <= radius
  }), [pilotBusinesses, remoteBusinesses, filter, vehicleFilter, radius])

  async function diagnose(event) {
    event.preventDefault()
    const clean = code.toUpperCase().trim()
    if (!/^[PBCU][0-9A-F]{4}$/.test(clean)) { setCodeError(true); return }
    setCodeError(false)
    setRemoteDiagnosis(null)
    if (!dtcCatalog[clean]) try {
      const response = await fetch(`/api/dtc/${clean}`)
      if (response.ok) {
        const remote = await response.json()
        if (remote?.code && remote?.description) setRemoteDiagnosis({ title: remote.description, summary: remote.explanation || 'Verified OBD-II code returned by the configured data provider.', causes: remote.causes?.length ? remote.causes : ['Vehicle-specific diagnosis required'] })
      }
    } catch { /* Local preview uses bundled fallbacks. */ }
    setResultCode(clean)
    requestAnimationFrame(() => document.getElementById('resultSection')?.scrollIntoView({ behavior: 'smooth' }))
  }

  async function updateArea() {
    if (!/^\d{6}$/.test(pincode)) { setToast('Enter a valid 6-digit pincode'); return }
    setUpdatingArea(true)
    try {
      const location = await resolvePincode(pincode)
      setAreaPincode(pincode)
      setAreaLabel(location.label)
      setToast(`Area updated to ${pincode}`)
    } catch (error) { setToast(error.message) }
    finally { setUpdatingArea(false) }
  }

  function toggleVehicle(vehicle) {
    setForm(current => ({ ...current, vehicles: current.vehicles.includes(vehicle) ? current.vehicles.filter(v => v !== vehicle) : [...current.vehicles, vehicle] }))
  }

  async function submitBusiness(joiningFee = 250, session = null) {
    if ((form.type === 'mechanic' || form.type === 'electrician') && form.vehicles.length === 0) { setToast('Choose at least one vehicle type'); return }
    const initials = form.name.split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase()
    if (backendEnabled && session) {
      try {
        const application = await submitBusinessApplication(form, session, joiningFee)
        if (joiningFee > 0) await collectPilotPayment(application, form, session)
        setForm(blankForm); setModalOpen(false); setSection('nearby'); setToast(`${form.name} was submitted for verification`)
      } catch (error) { setToast(error.message) }
      return
    }
    const listing = { ...form, bannerFile: null, id: crypto.randomUUID(), initials, distance: form.pincode === areaPincode ? 1.2 : 8.5, rating: null, reviews: 0, verified: false, status: 'pending_review', paymentStatus: joiningFee === 0 ? 'invite-waived' : 'demo-paid', joiningFee }
    setPilotBusinesses(current => [...current, listing])
    setAreaPincode(form.pincode); setPincode(form.pincode); setForm(blankForm); setModalOpen(false); setSection('nearby')
    setToast(`${listing.name} was submitted for banner and identity review`)
  }

  return <div className="page-shell">
    <header className="nav">
      <Brand />
      <nav className="nav-links" aria-label="Main navigation">
        {[['diagnose', t.diagnose], ['nearby', t.nearby], ['garage', t.garage]].map(([key, label]) => <button key={key} className={`nav-link ${section === key ? 'active' : ''}`} onClick={() => setSection(key)}>{label}</button>)}
      </nav>
      <div className="nav-actions">
<label className="language-select" aria-label="Language"><span>◎</span><select value={language} onChange={e => setLanguage(e.target.value)}>{languages.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><button className="ghost-button top-join-button" onClick={() => setModalOpen(true)}>Join pilot · ₹250</button></div>
    </header>

    <main>
      {section === 'diagnose' && <section className="screen active">
        <div className="hero"><div className="eyebrow"><span></span><span>{t.eyebrow}</span></div><h1>{t.title}</h1><p>{t.intro}</p><div className="vehicle-scope"><span>Built for</span><b>Cars</b><b>Trucks</b><b>Tractors</b></div></div>
        <div className="diagnostic-grid">
          <section className="search-card panel">
            <div className="mode-tabs" role="tablist"><button className={`mode-tab ${mode === 'code' ? 'active' : ''}`} onClick={() => setMode('code')}>▤ <span>{t.code}</span></button><button className={`mode-tab ${mode === 'photo' ? 'active' : ''}`} onClick={() => setMode('photo')}>▣ <span>{t.photo}</span></button></div>
            {mode === 'code' ? 
<form onSubmit={diagnose}><div className="field-label">
<label htmlFor="dtcCode">Fault code</label><span>Usually looks like P0301</span></div><div className="code-input-wrap"><span className="engine-icon">⌁</span><input id="dtcCode" aria-label="Fault code" maxLength="5" value={code} onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}/><button className="primary-button" type="submit">{t.explain} <span>›</span></button></div>{codeError && <p className="field-error show">Try P0301, P0420, P0171 or P0562.</p>}<div className="vehicle-divider"><span>Add your vehicle for a better answer</span></div><div className="vehicle-fields">
<label><span>Vehicle type</span><select value={vehicleType} onChange={event => { const next = event.target.value; setVehicleType(next); setVehicleMake(vehicleMakes[next][0]) }}><option value="car">Car</option><option value="truck">Truck</option><option value="tractor">Tractor</option></select></label>
<label><span>Make</span><select value={vehicleMake} onChange={event => setVehicleMake(event.target.value)}>{vehicleMakes[vehicleType].map(make => <option key={make}>{make}</option>)}</select></label>
<label><span>Year</span><select value={vehicleYear} onChange={event => setVehicleYear(event.target.value)}>{vehicleYears.map(year => <option key={year}>{year}</option>)}</select></label></div></form> : <div className="photo-mode">
<div className="upload-zone"><span className="upload-icon">▣</span><strong>Add a clear scanner or dashboard photo</strong><PhotoPicker id="diagnostic-photo" selectedName={diagnosticPhoto.name} previewUrl={diagnosticPhoto.preview} onFile={file => { setDiagnosticPhoto({ name: file.name, preview: URL.createObjectURL(file) }); setToast('Photo selected successfully') }}/><span>JPG, PNG or a new camera photo</span></div><p className="privacy-note">▣ Your photo is used only to read the code.</p></div>}
          </section>
          <aside className="location-card panel"><div className="location-heading"><span className="pin">⌖</span><div><span>Your area</span><strong>{areaLabel}</strong></div></div><div className="pincode-row"><input aria-label="Pincode" inputMode="numeric" maxLength="6" value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}/><button disabled={updatingArea} onClick={updateArea}>{updatingArea ? 'Finding…' : 'Update'}</button></div><div className="map-art"><span className="map-dot main"></span><span className="map-dot one"></span><span className="map-dot two"></span><div className="radius-label">25 km radius</div></div><div className="local-stats"><div><strong>{businesses.filter(item => item.type !== 'store').length}</strong><span>service experts</span></div><div><strong>{businesses.filter(item => item.type === 'store').length}</strong><span>parts stores</span></div></div><button className="text-button" onClick={() => setSection('nearby')}>View nearby help ›</button></aside>
        </div>
        <section className="result-section" id="resultSection"><div className="section-kicker">Your diagnosis</div><article className="result-card panel"><div className="result-main"><div className="result-topline"><div><span className="code-pill">{resultCode}</span><span className="status-pill caution"><i></i>Needs attention</span></div><button className={`save-button ${saved ? 'saved' : ''}`} onClick={() => { setSaved(!saved); setToast(saved ? 'Removed from garage' : 'Saved to your garage') }}>{saved ? '✓ Saved' : '▱ Save'}</button></div><h2>{diagnosis.title}</h2><p>{diagnosis.summary}</p><div className="severity"><div className="severity-head"><span>Urgency</span><strong>{diagnosis.urgency}</strong></div><div className="severity-track"><span></span><span></span><span></span><span></span><i style={{left: '51%'}}></i></div><p>Drive gently. If the warning light flashes or the vehicle loses power, stop and seek professional help.</p></div></div><div className="result-causes"><h3>Likely causes</h3><ol>{diagnosis.causes.map((cause, index) => <li key={cause}><span>{index + 1}</span><div><strong>{cause}</strong><small>{index === 0 ? 'Most common · check first' : 'Test before replacing'}</small></div></li>)}</ol><div className="confidence-note">ⓘ A fault code points to an affected system—not always one exact part. Test before replacing.</div><button className="secondary-button" onClick={() => setSection('nearby')}>Find local help ›</button></div></article></section>
      </section>}

      {section === 'nearby' && <section className="screen active">
        <div className="inner-hero"><div><span className="section-kicker">Local help</span><h1>{t.local}</h1><p>Mechanics, electricians and parts sellers serving the {areaPincode} area.</p></div><div className="area-control">Within <select aria-label="Search radius" value={radius} onChange={e => setRadius(Number(e.target.value))}><option value="10">10 km</option><option value="25">25 km</option><option value="50">50 km</option></select> of <strong>{areaPincode}</strong></div></div>
        <div className="filter-stack"><div className="filter-row" aria-label="Business filters">{[['all','All nearby'],['mechanic','Mechanics'],['electrician','Electricians'],['store','Parts stores']].map(([key,label]) => <button key={key} className={`chip ${filter === key ? 'active' : ''}`} onClick={() => setFilter(key)}>{label}</button>)}</div><div className="filter-row vehicle-filter" aria-label="Vehicle filters">{[['all','All vehicles'],['car','Car'],['truck','Truck'],['tractor','Tractor']].map(([key,label]) => <button key={key} className={`chip ${vehicleFilter === key ? 'active' : ''}`} onClick={() => setVehicleFilter(key)}>{label}</button>)}</div></div>
        <div className="directory-summary"><div><strong>{businesses.length} local {businesses.length === 1 ? 'business' : 'businesses'}</strong><span>Matched by business type, vehicle and service radius.</span></div></div>
        <div className="business-grid">{businesses.map(item => <BusinessCard key={item.id} item={item} onRemove={() => { setPilotBusinesses(list => list.filter(b => b.id !== item.id)); setToast('Pilot listing removed') }} onContact={() => setToast('Request flow comes with the secure backend')} />)}</div>
        {businesses.length === 0 && <div className="empty-directory"><strong>No exact match in this radius yet.</strong><p>Try a wider radius. Businesses can join from the button at the top of the page.</p></div>}
      </section>}

      {section === 'garage' && <section className="screen active"><div className="inner-hero"><div><span className="section-kicker">My garage</span><h1>Your vehicles and diagnosis history.</h1><p>Cars, trucks and tractors—one maintenance history.</p></div></div><div className="garage-layout"><article className="vehicle-card"><div className="car-art">CAR</div><div><span>Primary vehicle</span><h3>2024 Tata Nexon</h3><p>Car · Petrol · Manual</p></div></article><article className="history-card"><div className="history-head"><h3>Recent diagnosis</h3><span>{saved ? '1 saved' : 'Nothing saved'}</span></div>{saved && <div className="history-item"><span className="history-code">{resultCode}</span><div><strong>{diagnosis.title}</strong><small>Today · Needs attention</small></div></div>}</article></div></section>}
    </main>

    <footer><Brand /><p>Understand the code. Find the right help.</p><span>React pilot · India</span></footer>
    {modalOpen && <BusinessModal form={form} setForm={setForm} toggleVehicle={toggleVehicle} onClose={() => setModalOpen(false)} onSubmit={submitBusiness} />}
    <div className={`toast ${toast ? 'show' : ''}`}><span>✓</span><p>{toast}</p></div>
  </div>
}

function BusinessCard({ item, onRemove, onContact }) {
  const labels = { mechanic: 'Mechanic', electrician: 'Auto electrician', store: 'Parts store' }
  return <article className={`business-card ${item.verified ? '' : 'user-listed'}`}><div className={`business-visual ${item.type}`}><span>{item.initials}</span><i className={item.verified ? '' : 'pilot-badge'}>{item.verified ? 'Verified' : 'Pilot review'}</i></div><div className="business-body"><div className="rating">{item.rating ? `★ ${item.rating}` : 'New listing'} <span>· {item.rating ? `${item.reviews} reviews` : 'Owner submitted'}</span></div><div className="business-type-label">{labels[item.type]}</div><h3>{item.name}</h3><p>{item.services}</p>{item.publishContact && <div className="owner-contact"><span>Owner</span><strong>{item.ownerName}</strong><a href={`tel:${String(item.phone).replace(/\s/g, '')}`}>{item.phone}</a></div>}<div className="vehicle-tags">{item.vehicles.map(vehicle => <span key={vehicle}>{vehicle}</span>)}</div><div className="business-meta"><span>⌖ {item.distance.toFixed(1)} km</span><span className="open">Serving nearby</span></div><div className="listing-actions"><button className="contact-button" onClick={onContact}>{item.type === 'store' ? 'Ask for a part' : 'Request help'}</button>{!item.verified && <button className="remove-listing" aria-label={`Remove ${item.name}`} onClick={onRemove}>Remove</button>}</div></div></article>
}

function BusinessModal({ form, setForm, toggleVehicle, onClose, onSubmit }) {
  const [step, setStep] = useState('details')
  const [otp, setOtp] = useState('')
  const [session, setSession] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [feeWaived, setFeeWaived] = useState(false)
  const [otpCooldown, setOtpCooldown] = useState(0)
  const needsVehicles = form.type === 'mechanic' || form.type === 'electrician'
  const pincodeFree = form.pincode === '505325'
  const effectiveFeeWaived = pincodeFree || feeWaived
  useEffect(() => { if (!otpCooldown) return; const timer = setInterval(() => setOtpCooldown(value => Math.max(0, value - 1)), 1000); return () => clearInterval(timer) }, [otpCooldown])
  async function handleDetails(event) { event.preventDefault(); if (needsVehicles && form.vehicles.length === 0) return; if (!form.bannerFile) { setError('Take or choose a shop banner photo'); return } if (!backendEnabled) { setStep('payment'); return } setBusy(true); setError(''); try { await sendPhoneOtp(form.phone); setOtpCooldown(60); setStep('otp') } catch (err) { setError(err.message) } finally { setBusy(false) } }
  async function resendOtp() { if (otpCooldown) return; setBusy(true); setError(''); try { await sendPhoneOtp(form.phone); setOtpCooldown(60) } catch (err) { setError(err.message) } finally { setBusy(false) } }
  async function handleOtp(event) { event.preventDefault(); setBusy(true); setError(''); try { const verified = await verifyPhoneOtp(form.phone, otp); setSession(verified); if (form.inviteCode.trim()) { const invite = await fetch('/api/invites/check', { method: 'POST', headers: { Authorization: `Bearer ${verified.accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ code: form.inviteCode }) }); setFeeWaived(invite.ok) } setStep('payment') } catch (err) { setError(err.message) } finally { setBusy(false) } }
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><button className="modal-close" aria-label="Close" onClick={onClose}>×</button><span className="modal-icon">DH</span>{step === 'details' ? <><h2 id="modalTitle">Join the Diaghub pilot</h2><p>Tell customers what you work on. Listings are reviewed before public launch.</p><div className={`fee-disclosure ${effectiveFeeWaived ? 'waived' : ''}`}><div><span>Pilot joining fee</span><strong>{effectiveFeeWaived ? 'Waived' : '₹250'}</strong></div><small>{pincodeFree ? 'Free pilot entry for pincode 505325' : feeWaived ? 'Friend invite accepted · no payment required' : 'One-time payment · no subscription · verification reviewed separately'}</small></div>
<form onSubmit={handleDetails}>
<label>Business type<select aria-label="Business type" value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option value="mechanic">Mechanic / workshop</option><option value="electrician">Auto electrician</option><option value="store">Auto parts store</option></select></label>{needsVehicles && <fieldset className="vehicle-choice"><legend>Vehicles you work on</legend>{['car','truck','tractor'].map(vehicle => <label key={vehicle} className={form.vehicles.includes(vehicle) ? 'selected' : ''}><input type="checkbox" checked={form.vehicles.includes(vehicle)} onChange={() => toggleVehicle(vehicle)}/><span>{vehicle === 'car' ? '🚗' : vehicle === 'truck' ? '🚚' : '🚜'} {vehicle}</span></label>)}</fieldset>}<label>Business name<input aria-label="Business name" required value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. Mallesh Auto Works"/></label>
<label>Owner name<input aria-label="Owner name" required value={form.ownerName} onChange={e => setForm({...form, ownerName:e.target.value})} placeholder="Name customers will see"/></label><div className="form-pair">
<label>Contact number<input aria-label="Contact number" required inputMode="tel" maxLength="10" pattern="[6-9][0-9]{9}" value={form.phone} onChange={e => setForm({...form, phone:e.target.value.replace(/\D/g,'')})} placeholder="10-digit mobile number"/></label>
<label>Pincode<input aria-label="Business pincode" required inputMode="numeric" maxLength="6" pattern="[0-9]{6}" value={form.pincode} onChange={e => setForm({...form, pincode:e.target.value.replace(/\D/g,'')})}/></label></div>
<label>Services or brands<input aria-label="Services or brands" required value={form.services} onChange={e => setForm({...form, services:e.target.value})} placeholder={form.type === 'electrician' ? 'Battery, alternator, wiring' : 'Engine, service, Tata, Mahindra'}/></label>
<label>Shop address<input aria-label="Shop address" required value={form.address} onChange={e => setForm({...form, address:e.target.value})} placeholder="Village, landmark or road"/></label>
<GooglePlacePicker value={form.placeId} address={form.address} onSelect={place => setForm(current => ({...current, ...place}))}/>
<div className="banner-photo-field"><span>Shop banner photo</span><PhotoPicker id="shop-banner" selectedName={form.bannerName} previewUrl={form.bannerPreview} onFile={file => setForm(current => ({...current, bannerName: file.name, bannerFile: file, bannerPreview: URL.createObjectURL(file)}))}/><small className="field-help">Required for name-and-banner verification.</small></div>
<label>Friend invite code <span className="optional">Optional</span><input aria-label="Friend invite code" value={form.inviteCode} onChange={e => setForm({...form, inviteCode:e.target.value.toUpperCase()})} placeholder="Enter invite code"/></label>
<label className="consent-row"><input type="checkbox" checked={form.publishContact} onChange={e => setForm({...form, publishContact:e.target.checked})} required/><span>Show my owner name and contact number publicly on this listing.</span></label>
<label className="consent-row"><input type="checkbox" checked={form.consent} onChange={e => setForm({...form, consent:e.target.checked})} required/><span>I own or manage this business and agree to pilot verification.</span></label>{error && <p className="form-error">{error}</p>}<button type="submit" disabled={busy} className="primary-button full">{busy ? 'Please wait…' : backendEnabled ? 'Verify phone & continue' : effectiveFeeWaived ? 'Review free pilot entry' : 'Review & pay ₹250'}</button></form></> : step === 'otp' ? <OtpStep phone={form.phone} otp={otp} setOtp={setOtp} busy={busy} error={error} cooldown={otpCooldown} onResend={resendOtp} onSubmit={handleOtp} onBack={() => setStep('details')} /> : <PaymentReview form={form} fee={effectiveFeeWaived ? 0 : 250} onBack={() => setStep('details')} onComplete={fee => onSubmit(fee, session)} />}</div></div>
}

function OtpStep({ phone, otp, setOtp, busy, error, cooldown, onResend, onSubmit, onBack }) {
  return <div className="otp-step"><div className="secure-mark">✓</div><h2 id="modalTitle">Verify your phone</h2><p>We sent a one-time code to +91 {phone}. SMS can take up to a minute.</p><form onSubmit={onSubmit}><label>6-digit OTP<input aria-label="6-digit OTP" inputMode="numeric" autoComplete="one-time-code" maxLength="6" pattern="[0-9]{6}" required value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}/></label>{error && <p className="form-error">{error}</p>}<button className="primary-button full" disabled={busy} type="submit">{busy ? 'Verifying…' : 'Verify & continue'}</button><button className="back-payment" disabled={busy || cooldown > 0} type="button" onClick={onResend}>{cooldown ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}</button><button className="back-payment" type="button" onClick={onBack}>← Edit phone number</button></form></div>
}

function PaymentReview({ form, fee, onBack, onComplete }) {
  return <div className="payment-review"><div className="secure-mark">{fee === 0 ? '✓' : '₹'}</div><h2 id="modalTitle">{fee === 0 ? 'Friend invite applied' : 'Complete pilot joining'}</h2><p>{fee === 0 ? 'Your pilot joining fee has been waived.' : 'Review the fee before continuing to secure payment.'}</p><div className="order-card"><div><span>Business</span><strong>{form.name}</strong></div><div><span>Owner</span><strong>{form.ownerName}</strong></div><div><span>Listing type</span><strong>{form.type === 'store' ? 'Auto parts store' : form.type === 'electrician' ? 'Auto electrician' : 'Mechanic / workshop'}</strong></div><div><span>Pilot joining fee</span><strong>{fee === 0 ? 'Waived' : '₹250'}</strong></div><div className="order-total"><span>Total due once</span><strong>{fee === 0 ? '₹0' : '₹250'}</strong></div></div><ul className="payment-points"><li>{fee === 0 ? 'Private friend invitation accepted' : 'One-time fee—no recurring subscription'}</li><li>Listing enters review after joining</li><li>Joining does not guarantee verification</li></ul>
{fee > 0 && !backendEnabled && <div className="demo-payment-note"><strong>Local preview</strong><span>No money will be charged without configured deployment services.</span></div>}
<button className="primary-button full" type="button" onClick={() => onComplete(fee)}>{fee === 0 ? 'Submit free pilot listing' : backendEnabled ? 'Pay ₹250 securely' : 'Preview ₹250 payment'}</button><button className="back-payment" type="button" onClick={onBack}>← Edit business details</button></div>
}

function PhotoPicker({ id, selectedName, previewUrl, onFile }) {
  function choose(event) {
    const file = event.target.files?.[0]
    if (file) onFile(file)
    event.target.value = ''
  }
  return <div className="photo-picker"><div className="photo-actions"><label htmlFor={`${id}-camera`}><input id={`${id}-camera`} className="photo-input" aria-label="Take photo" type="file" accept="image/*" capture="environment" onChange={choose}/><span>📷 Take photo</span></label><label htmlFor={`${id}-gallery`}><input id={`${id}-gallery`} className="photo-input" aria-label="Choose from gallery" type="file" accept="image/jpeg,image/png,image/webp" onChange={choose}/><span>▣ Choose gallery</span></label></div>{previewUrl && <img className="photo-preview" src={previewUrl} alt="Selected upload preview"/>}{selectedName && <small className="photo-selected">✓ {selectedName}</small>}</div>
}

export default App
