import { useMemo, useState } from 'react'
import GooglePlacePicker from './components/GooglePlacePicker.jsx'
import { diagnosisFor, dtcCatalog } from './data/diagnostics.js'

const codeExamples = ['P0301', 'P0420', 'P0171', 'P0299', 'P0401', 'P0562', 'P0700', 'U0100', 'C0035', 'B0001']

const ui = {
  en: {
    home: 'Home', diagnose: 'AI Diagnose', nearby: 'Nearby', cars: 'Cars', emissions: 'DPF/DEF', start: 'Start diagnosis',
    eyebrow: 'Uber + Maps + ChatGPT for vehicle diagnostics', heroTitle: 'Understand your car problem before you reach the garage.', heroText: 'Search any DTC code, explain warning lights, learn DPF/DEF issues, and find nearby mechanics or parts sellers from one clean dashboard.',
    aiCard: 'AI diagnosis card', aiCardText: 'Enter any OBD/DTC code like P0301, P0420, P0171, P0299, U0100, C0035, or B0001.', explain: 'Explain', nearbyHelp: 'Nearby help', nearbyText: 'Mechanics, electricians and auto parts stores near your location.', findNearby: 'Find nearby',
    diagnoseTitle: 'Search any vehicle fault code', diagnoseSub: 'Modern DTC search design with explanation, causes, checks and solutions.', codeLabel: 'DTC / OBD code', example: 'Try:', search: 'Search code', severity: 'Priority', causes: 'Expected causes', solutions: 'Possible solutions', checks: 'Quick checks', system: 'Code system', family: 'Code area', disclaimer: 'DTC meanings can vary by vehicle brand, engine, model year and market. Always confirm with a professional scanner or service manual before replacing parts.',
    carsTitle: 'Cars information section', carsSub: 'Brand-wise information for common Indian cars and diagnostic focus areas.', emissionsTitle: 'DPF and DEF guide', emissionsSub: 'Check which vehicles usually have DPF/DEF, expected problems, solutions, and DEF oil usage estimates.', vehicle: 'Vehicle', dpf: 'DPF', def: 'DEF', usage: 'DEF usage', problems: 'Problems', solution: 'Solutions', note: 'Note: DPF/DEF fitment changes by model year, variant and market. Always verify with owner manual or VIN-based service data.'
  },
  hi: {
    home: 'होम', diagnose: 'AI जांच', nearby: 'नज़दीक', cars: 'कारें', emissions: 'DPF/DEF', start: 'जांच शुरू करें',
    eyebrow: 'वाहन डायग्नोस्टिक्स के लिए Uber + Maps + ChatGPT', heroTitle: 'गैरेज जाने से पहले कार की समस्या समझें।', heroText: 'कोई भी DTC कोड खोजें, वार्निंग लाइट समझें, DPF/DEF सीखें और नज़दीकी मैकेनिक या पार्ट्स स्टोर खोजें।',
    aiCard: 'AI डायग्नोसिस कार्ड', aiCardText: 'P0301, P0420, P0171, P0299, U0100, C0035 या B0001 जैसे OBD/DTC कोड डालें।', explain: 'समझाएं', nearbyHelp: 'नज़दीकी मदद', nearbyText: 'आपके पास मैकेनिक, इलेक्ट्रिशियन और ऑटो पार्ट्स स्टोर।', findNearby: 'नज़दीक खोजें',
    diagnoseTitle: 'कोई भी वाहन फॉल्ट कोड खोजें', diagnoseSub: 'कारण, जांच और समाधान के साथ आधुनिक DTC सर्च।', codeLabel: 'DTC / OBD कोड', example: 'आजमाएं:', search: 'कोड खोजें', severity: 'प्राथमिकता', causes: 'संभावित कारण', solutions: 'संभावित समाधान', checks: 'त्वरित जांच', system: 'कोड सिस्टम', family: 'कोड क्षेत्र', disclaimer: 'DTC का अर्थ ब्रांड, इंजन, मॉडल वर्ष और बाजार के अनुसार बदल सकता है। पार्ट बदलने से पहले स्कैनर या सर्विस मैनुअल से पुष्टि करें।',
    carsTitle: 'कार जानकारी सेक्शन', carsSub: 'भारत की आम कारों के लिए ब्रांड-वाइज डायग्नोस्टिक जानकारी।', emissionsTitle: 'DPF और DEF गाइड', emissionsSub: 'किन वाहनों में DPF/DEF होता है, समस्याएं, समाधान और DEF उपयोग अनुमान।', vehicle: 'वाहन', dpf: 'DPF', def: 'DEF', usage: 'DEF उपयोग', problems: 'समस्याएं', solution: 'समाधान', note: 'नोट: DPF/DEF फिटमेंट मॉडल वर्ष, वेरिएंट और बाजार के अनुसार बदलता है। मालिक मैनुअल या VIN सर्विस डेटा से पुष्टि करें।'
  },
  te: {
    home: 'హోమ్', diagnose: 'AI డయాగ్నోస్', nearby: 'దగ్గరలో', cars: 'కార్లు', emissions: 'DPF/DEF', start: 'డయాగ్నోసిస్ ప్రారంభించండి',
    eyebrow: 'వాహన డయాగ్నోస్టిక్స్ కోసం Uber + Maps + ChatGPT', heroTitle: 'గ్యారేజ్‌కు వెళ్లే ముందు మీ కారు సమస్యను అర్థం చేసుకోండి.', heroText: 'ఏ DTC కోడ్‌నైనా వెతకండి, వార్నింగ్ లైట్లు అర్థం చేసుకోండి, DPF/DEF నేర్చుకోండి, దగ్గరలోని మెకానిక్‌లను కనుగొనండి.',
    aiCard: 'AI డయాగ్నోసిస్ కార్డ్', aiCardText: 'P0301, P0420, P0171, P0299, U0100, C0035 లేదా B0001 వంటి OBD/DTC కోడ్‌ను నమోదు చేయండి.', explain: 'వివరించండి', nearbyHelp: 'దగ్గరలో సహాయం', nearbyText: 'మీ దగ్గర మెకానిక్‌లు, ఎలక్ట్రిషియన్‌లు మరియు ఆటో పార్ట్స్ స్టోర్లు.', findNearby: 'దగ్గరలో వెతకండి',
    diagnoseTitle: 'ఏ వాహన ఫాల్ట్ కోడ్‌నైనా వెతకండి', diagnoseSub: 'కారణాలు, చెక్స్ మరియు పరిష్కారాలతో ఆధునిక DTC సెర్చ్.', codeLabel: 'DTC / OBD కోడ్', example: 'ప్రయత్నించండి:', search: 'కోడ్ వెతకండి', severity: 'ప్రాధాన్యత', causes: 'సంభావ్య కారణాలు', solutions: 'పరిష్కారాలు', checks: 'త్వరిత చెక్స్', system: 'కోడ్ సిస్టమ్', family: 'కోడ్ ప్రాంతం', disclaimer: 'DTC అర్థాలు బ్రాండ్, ఇంజిన్, మోడల్ ఇయర్ మరియు మార్కెట్ ఆధారంగా మారవచ్చు. భాగాలు మార్చే ముందు ప్రొఫెషనల్ స్కానర్‌తో నిర్ధారించండి.',
    carsTitle: 'కార్ల సమాచారం', carsSub: 'సాధారణ భారతీయ కార్లకు బ్రాండ్ వారీ డయాగ్నోస్టిక్ ఫోకస్.', emissionsTitle: 'DPF మరియు DEF గైడ్', emissionsSub: 'ఏ వాహనాల్లో DPF/DEF ఉంటాయి, సమస్యలు, పరిష్కారాలు మరియు DEF వినియోగం.', vehicle: 'వాహనం', dpf: 'DPF', def: 'DEF', usage: 'DEF వినియోగం', problems: 'సమస్యలు', solution: 'పరిష్కారాలు', note: 'గమనిక: DPF/DEF ఫిట్మెంట్ మోడల్ ఇయర్, వేరియంట్ మరియు మార్కెట్ ఆధారంగా మారుతుంది.'
  }
}

const carSections = [
  { brand: 'Maruti Suzuki', models: 'Swift, Baleno, Brezza, Dzire, Ertiga, Fronx', focus: 'Petrol, CNG, mild-hybrid diagnosis, mileage complaints, sensor faults, OBD-II codes.' },
  { brand: 'Hyundai', models: 'i20, Venue, Creta, Verna, Alcazar', focus: 'Petrol, turbo-petrol and diesel diagnostics, ABS, transmission, DPF checks on diesel models.' },
  { brand: 'Tata Motors', models: 'Punch, Nexon, Altroz, Harrier, Safari, Tiago EV', focus: 'Petrol, diesel, CNG and EV health, battery warnings, diesel DPF/EGR diagnosis.' },
  { brand: 'Mahindra', models: 'Thar, Scorpio-N, XUV700, Bolero, XUV300', focus: 'Diesel-focused diagnostics, DEF/AdBlue, DPF regeneration, 4x4 and turbo issues.' },
  { brand: 'Toyota', models: 'Fortuner, Innova Crysta, Hyryder, Glanza', focus: 'Long-run maintenance, hybrid checks, diesel DPF/DEF warnings where fitted.' },
  { brand: 'Kia / Honda / MG / Skoda', models: 'Seltos, Sonet, City, Hector, Slavia, Kushaq', focus: 'General diagnostics, diesel emission systems, turbo, DCT/CVT and sensor issues.' },
]

const emissionGuide = [
  { car: 'Mahindra XUV700 diesel', dpf: 'Yes', def: 'Yes on many BS6 diesel variants', usage: 'Around 1–3 L per 1,000 km depending on load and driving style.', problems: 'DPF clogging in city use, DEF low warning, NOx/DEF sensor faults.', solution: 'Use proper AdBlue/DEF, complete highway regeneration drives, scan before replacing sensors.' },
  { car: 'Mahindra Scorpio-N / Thar diesel', dpf: 'Yes', def: 'Yes on many BS6 diesel variants', usage: 'Around 1–3 L per 1,000 km; heavy driving can use more.', problems: 'Soot build-up, limp mode, regeneration interruption.', solution: 'Avoid only short trips, refill DEF on time, check DPF pressure readings.' },
  { car: 'Tata Harrier / Safari diesel', dpf: 'Yes', def: 'Usually no separate DEF tank on many Indian variants; check model year.', usage: 'Not applicable if no DEF tank is fitted.', problems: 'DPF full warning, EGR soot, pressure sensor faults.', solution: 'Complete regeneration cycle, inspect EGR and DPF sensor pipes, use correct oil grade.' },
  { car: 'Hyundai Creta / Kia Seltos diesel', dpf: 'Yes on BS6 diesel', def: 'Usually no DEF tank in many Indian passenger variants.', usage: 'Not applicable if no DEF tank is fitted.', problems: 'DPF warning after slow city driving, turbo/airflow codes.', solution: 'Steady-speed drive for regen, check MAF/boost leaks, avoid interrupting regen.' },
  { car: 'Toyota Fortuner / Innova diesel', dpf: 'Yes on BS6 diesel', def: 'Some generations/variants use DEF/urea systems.', usage: 'Commonly around 1–2 L per 1,000 km where DEF is fitted.', problems: 'DPF regeneration warning, DEF countdown, exhaust sensor faults.', solution: 'Use ISO 22241 DEF, refill before empty, perform scanner-based DPF health check.' },
  { car: 'Petrol / CNG cars', dpf: 'No', def: 'No', usage: 'Not applicable.', problems: 'Oxygen sensor faults, catalytic converter efficiency codes, misfires.', solution: 'Do not confuse catalytic converter with DPF; fix misfires quickly to protect catalyst.' },
]

const nearbyDemo = [
  { name: 'Mallesh Auto Works', type: 'Mechanic', distance: '4.2 km', services: 'Engine, diesel, general service' },
  { name: 'Sri Sai Auto Electricals', type: 'Electrician', distance: '6.8 km', services: 'Battery, wiring, alternator, lights' },
  { name: 'Akshay Auto Parts', type: 'Parts store', distance: '7.8 km', services: 'Maruti, Tata, Mahindra, Bosch parts' },
]

function normalizeCode(value) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5)
}

function codeSystem(code) {
  const first = code[0]
  const systems = { P: 'Powertrain / engine & transmission', B: 'Body / airbags & comfort', C: 'Chassis / ABS, steering & suspension', U: 'Network / module communication' }
  return systems[first] || 'Unknown OBD system'
}

function codeFamily(code) {
  if (!/^[PBCU][0-9A-F]{4}$/.test(code)) return 'Enter a standard 5-character code like P0301 or U0100'
  const group = code.slice(0, 3)
  if (group.startsWith('P00') || group.startsWith('P01')) return 'Fuel, air metering and emissions'
  if (group.startsWith('P02')) return 'Injector, turbo or fuel system'
  if (group.startsWith('P03')) return 'Ignition system or misfire'
  if (group.startsWith('P04')) return 'Auxiliary emission control / EGR / catalyst'
  if (group.startsWith('P05')) return 'Vehicle speed, idle control and electrical inputs'
  if (group.startsWith('P06')) return 'ECU / control module / computer output'
  if (group.startsWith('P07')) return 'Transmission control'
  if (code[0] === 'U') return 'CAN network / module communication'
  if (code[0] === 'C') return 'Chassis, ABS, steering or suspension'
  if (code[0] === 'B') return 'Body electronics, airbag or cabin systems'
  return 'Manufacturer-specific area'
}

function enhancedDiagnosis(code, language) {
  const clean = normalizeCode(code)
  const base = diagnosisFor(clean, language)
  const known = Boolean(dtcCatalog[clean])
  const valid = /^[PBCU][0-9A-F]{4}$/.test(clean)
  const quickChecks = known
    ? ['Confirm the code after clearing it once', 'Check wiring/connectors before replacing parts', 'Compare live scanner data with symptoms']
    : valid
      ? ['Check if the code is generic or manufacturer-specific', 'Search the same code with your car brand and engine', 'Scan live data and freeze-frame data', 'Do not replace expensive parts only from one code']
      : ['Enter a valid code format like P0301, P0420, U0100, C0035 or B0001']
  return {
    code: clean || 'DTC',
    ...base,
    level: known ? 'Known code' : valid ? 'Generic guidance' : 'Invalid format',
    system: codeSystem(clean),
    family: codeFamily(clean),
    quickChecks,
  }
}

function App() {
  const [active, setActive] = useState('home')
  const [language, setLanguage] = useState('en')
  const [code, setCode] = useState('P0301')
  const [place, setPlace] = useState({ placeId: '', address: '' })
  const t = ui[language] || ui.en
  const result = useMemo(() => enhancedDiagnosis(code, language), [code, language])
  const nav = [['home', t.home], ['diagnose', t.diagnose], ['nearby', t.nearby], ['cars', t.cars], ['emissions', t.emissions]]

  function searchNow() {
    setCode(normalizeCode(code))
    setActive('diagnose')
  }

  return (
    <div className="page-shell">
      <header className="nav">
        <a className="brand" href="#home" onClick={() => setActive('home')}><span className="brand-mark">D</span><span>Diag<span>hub</span></span></a>
        <div className="nav-links">{nav.map(([id, label]) => <button key={id} className={`nav-link ${active === id ? 'active' : ''}`} onClick={() => setActive(id)}>{label}</button>)}</div>
        <div className="nav-actions">
          <select className="language-select" value={language} onChange={e => setLanguage(e.target.value)} aria-label="Language">
            <option value="en">English</option><option value="hi">हिन्दी</option><option value="te">తెలుగు</option>
          </select>
          <button className="ghost-button" onClick={() => setActive('diagnose')}>{t.start}</button>
        </div>
      </header>

      <main>
        <section id="home" className={`screen ${active === 'home' ? 'active' : ''}`}>
          <div className="hero">
            <div className="eyebrow"><span></span>{t.eyebrow}</div>
            <h1>{t.heroTitle}</h1><p>{t.heroText}</p>
          </div>
          <div className="diagnostic-grid">
            <div className="panel search-card code-search-pro">
              <h2>{t.aiCard}</h2><p>{t.aiCardText}</p>
              <div className="code-input-wrap pro-search"><div className="engine-icon">⚙️</div><input value={code} onChange={e => setCode(normalizeCode(e.target.value))} placeholder="P0301" /><button className="primary-button" onClick={searchNow}>{t.explain}</button></div>
              <div className="example-row"><span>{t.example}</span>{codeExamples.slice(0, 5).map(item => <button key={item} onClick={() => { setCode(item); setActive('diagnose') }}>{item}</button>)}</div>
            </div>
            <div className="panel location-card"><h2>{t.nearbyHelp}</h2><p>{t.nearbyText}</p><button className="primary-button" onClick={() => setActive('nearby')}>{t.findNearby}</button></div>
          </div>
        </section>

        <section id="diagnose" className={`screen ${active === 'diagnose' ? 'active' : ''}`}>
          <div className="inner-hero"><h1>{t.diagnoseTitle}</h1><p>{t.diagnoseSub}</p></div>
          <div className="panel dtc-search-panel">
            <div className="field-label"><label>{t.codeLabel}</label><span>{t.example} P0301 / U0100 / C0035</span></div>
            <div className="code-input-wrap pro-search large"><div className="engine-icon">🔍</div><input value={code} onChange={e => setCode(normalizeCode(e.target.value))} placeholder="Enter code" /><button className="primary-button" onClick={searchNow}>{t.search}</button></div>
            <div className="example-row">{codeExamples.map(item => <button key={item} onClick={() => setCode(item)} className={result.code === item ? 'active' : ''}>{item}</button>)}</div>
          </div>
          <div className="result-section">
            <div className="result-card panel upgraded-result-card">
              <div className="result-main">
                <div className="result-topline"><span className="code-pill">{result.code}</span><span className="status-pill"><i></i>{result.level}</span></div>
                <h2>{result.title}</h2><p>{result.summary}</p>
                <div className="meta-grid"><div><small>{t.system}</small><strong>{result.system}</strong></div><div><small>{t.family}</small><strong>{result.family}</strong></div><div><small>{t.severity}</small><strong>{result.urgency}</strong></div></div>
              </div>
              <div className="result-causes">
                <h3>{t.causes}</h3><ul>{result.causes.map(item => <li key={item}>{item}</li>)}</ul>
                <h3>{t.checks}</h3><ul>{result.quickChecks.map(item => <li key={item}>{item}</li>)}</ul>
                <h3>{t.solutions}</h3><ul><li>Start with low-cost inspection: battery, fuses, wiring, connectors and fluid levels.</li><li>Use freeze-frame and live data to confirm the real failed part.</li><li>After repair, clear the code and drive-test to confirm it does not return.</li></ul>
              </div>
            </div>
          </div>
          <p className="privacy-note">{t.disclaimer}</p>
        </section>

        <section id="nearby" className={`screen ${active === 'nearby' ? 'active' : ''}`}>
          <div className="inner-hero"><h1>{t.nearbyHelp}</h1><p>{t.nearbyText}</p></div>
          <div className="panel search-card"><GooglePlacePicker value={place.placeId} address={place.address} onSelect={setPlace} /></div>
          <div className="business-grid">{nearbyDemo.map(item => <article className="panel business-card" key={item.name}><h3>{item.name}</h3><strong>{item.type} · {item.distance}</strong><p>{item.services}</p><button className="ghost-button">View details</button></article>)}</div>
        </section>

        <section id="cars" className={`screen ${active === 'cars' ? 'active' : ''}`}>
          <div className="inner-hero"><h1>{t.carsTitle}</h1><p>{t.carsSub}</p></div>
          <div className="business-grid">{carSections.map(car => <article className="panel business-card" key={car.brand}><h3>{car.brand}</h3><p><b>Popular models:</b> {car.models}</p><p>{car.focus}</p></article>)}</div>
        </section>

        <section id="emissions" className={`screen ${active === 'emissions' ? 'active' : ''}`}>
          <div className="inner-hero"><h1>{t.emissionsTitle}</h1><p>{t.emissionsSub}</p></div>
          <div className="emission-table panel"><table><thead><tr><th>{t.vehicle}</th><th>{t.dpf}</th><th>{t.def}</th><th>{t.usage}</th><th>{t.problems}</th><th>{t.solution}</th></tr></thead><tbody>{emissionGuide.map(row => <tr key={row.car}><td>{row.car}</td><td>{row.dpf}</td><td>{row.def}</td><td>{row.usage}</td><td>{row.problems}</td><td>{row.solution}</td></tr>)}</tbody></table></div>
          <p className="privacy-note">{t.note}</p>
        </section>
      </main>

      <nav className="mobile-bottom-nav">{nav.map(([id, label]) => <button key={id} className={active === id ? 'active' : ''} onClick={() => setActive(id)}>{label}</button>)}</nav>
    </div>
  )
}

export default App
