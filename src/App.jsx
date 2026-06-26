import { useEffect, useMemo, useState } from 'react'
import { diagnosisFor } from './data/diagnostics.js'
import { vehicleMakes, vehicleYears } from './data/vehicles.js'

const WHATSAPP_NUMBER = '919949415312'
const whatsappUrl = service =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi DiagHub, I need help with ${service}.`)}`

const services = [
  'KTM / KTAG Installation',
  'Scanner Training',
  'Scanner Buying Suggestions',
  'Immobilizer Coding',
  'Superchips',
  'ECM Files',
  'DPF Files',
  'UPA Red / Black',
]

const defaultTrendingCars = [
  { name: 'Hyundai Creta', segment: 'SUV', fuel: 'Petrol / Diesel', reason: 'High demand compact SUV' },
  { name: 'Tata Punch', segment: 'Micro SUV', fuel: 'Petrol / CNG / EV', reason: 'Strong city ownership' },
  { name: 'Maruti Swift', segment: 'Hatchback', fuel: 'Petrol / CNG', reason: 'Popular service volume' },
  { name: 'Mahindra Scorpio-N', segment: 'SUV', fuel: 'Diesel / Petrol', reason: 'Diesel diagnostics demand' },
  { name: 'Tata Nexon', segment: 'SUV', fuel: 'Petrol / Diesel / EV', reason: 'Common DPF and sensor queries' },
  { name: 'Maruti Brezza', segment: 'SUV', fuel: 'Petrol / CNG', reason: 'Fast-moving family SUV' },
  { name: 'Kia Seltos', segment: 'SUV', fuel: 'Petrol / Diesel', reason: 'Turbo and diesel scan demand' },
  { name: 'Toyota Innova Hycross', segment: 'MPV', fuel: 'Petrol Hybrid', reason: 'Premium fleet interest' },
]

const dpfDb = {
  'Mahindra XUV700': { dpf: 'Yes', def: 'Yes on many BS6 diesel variants', usage: 'Usually around 1-3 L per 1,000 km based on load and driving style.', instructions: 'Use ISO 22241 AdBlue/DEF. Do not let DEF run empty. Complete highway regeneration when DPF warning appears.' },
  'Mahindra Scorpio-N': { dpf: 'Yes', def: 'Yes on many BS6 diesel variants', usage: 'Around 1-3 L per 1,000 km; heavy driving can consume more.', instructions: 'Avoid only short trips. Check soot load, differential pressure and NOx/DEF sensor data.' },
  'Mahindra Thar': { dpf: 'Yes on BS6 diesel', def: 'Variant dependent', usage: 'Confirm by DEF filler cap and owner manual.', instructions: 'Use highway drive cycles for regeneration and verify differential pressure sensor values.' },
  'Toyota Fortuner': { dpf: 'Yes on BS6 diesel', def: 'Some variants/generations use DEF systems', usage: 'Common estimate 1-2 L per 1,000 km where DEF tank is fitted.', instructions: 'Use clean DEF only. Refill before countdown warning. Confirm exact capacity from owner manual.' },
  'Toyota Innova Crysta': { dpf: 'Yes on BS6 diesel', def: 'Variant dependent', usage: 'Often 1-2 L per 1,000 km where SCR/DEF is fitted.', instructions: 'Check DPF soot load, exhaust temperature sensors and SCR fault history before forced regeneration.' },
  'Tata Harrier': { dpf: 'Yes on diesel', def: 'Usually no separate DEF tank on many Indian variants', usage: 'Not applicable if no DEF tank is fitted.', instructions: 'For DPF warning, drive at steady speed, check EGR, pressure sensor pipes and correct engine oil grade.' },
  'Tata Safari': { dpf: 'Yes on diesel', def: 'Usually no separate DEF tank on many Indian variants', usage: 'Not applicable if no DEF tank is fitted.', instructions: 'Check soot load, EGR operation, differential pressure sensor and exhaust leaks.' },
  'Tata Nexon': { dpf: 'Yes on diesel', def: 'Usually no DEF tank on many Indian variants', usage: 'Not applicable if no DEF tank is fitted.', instructions: 'Short-trip diesel use can block DPF. Confirm regeneration history and sensor pipe condition.' },
  'Hyundai Creta': { dpf: 'Yes on BS6 diesel', def: 'Usually no DEF tank on many Indian passenger variants', usage: 'Not applicable if no DEF tank is fitted.', instructions: 'Short city trips can clog DPF. Check MAF/MAP, boost leaks and DPF soot load.' },
  'Hyundai Venue': { dpf: 'Yes on diesel', def: 'Usually no DEF tank on many Indian passenger variants', usage: 'Not applicable if no DEF tank is fitted.', instructions: 'Verify DPF pressure, EGR flow and turbo boost data before parts replacement.' },
  'Kia Seltos': { dpf: 'Yes on diesel', def: 'Usually no DEF tank on many Indian passenger variants', usage: 'Not applicable if no DEF tank is fitted.', instructions: 'Check soot load, EGR, pressure pipes and intake leaks during diagnosis.' },
  'Kia Sonet': { dpf: 'Yes on diesel', def: 'Usually no DEF tank on many Indian passenger variants', usage: 'Not applicable if no DEF tank is fitted.', instructions: 'Use scanner live data for DPF load and confirm successful regeneration.' },
  'MG Hector': { dpf: 'Yes on diesel', def: 'Variant dependent', usage: 'Confirm by VIN, DEF cap and owner manual.', instructions: 'Check SCR/NOx and DPF data together when DEF warnings appear.' },
  'Jeep Compass': { dpf: 'Yes on diesel', def: 'Variant dependent', usage: 'Confirm exact system by model year.', instructions: 'Use correct low-ash oil and verify pressure sensor pipe condition.' },
}

const genericDpf = { dpf: 'Depends on model year and fuel type', def: 'Depends on market/variant', usage: 'Use VIN/owner manual to confirm exact DEF tank and usage.', instructions: 'Select diesel fuel data, check for DEF cap, scan DPF soot load, differential pressure, SCR and NOx values.' }
const fuelLabels = {
  en: ['Diesel', 'Petrol', 'CNG', 'Hybrid', 'EV'],
  hi: ['डीजल', 'पेट्रोल', 'CNG', 'हाइब्रिड', 'EV'],
  te: ['డీజిల్', 'పెట్రోల్', 'CNG', 'హైబ్రిడ్', 'EV'],
}

const shopsSeed = [
  { shop: 'Mallesh Auto Works', owner: 'Mallesh', type: 'Mechanic', dist: '4.2 km', mobile: '9876543210', mobileService: true },
  { shop: 'Sri Sai Auto Electricals', owner: 'Sai Kumar', type: 'Electrician', dist: '6.8 km', mobile: '9876501234', mobileService: true },
  { shop: 'Akshay Auto Parts', owner: 'Akshay', type: 'Auto parts store', dist: '7.8 km', mobile: '9988776655', mobileService: false },
]

function localizeDpfResult(result, language) {
  if (language === 'hi') return {
    dpf: result.dpf.startsWith('Yes') ? 'हाँ' : 'मॉडल वर्ष और ईंधन प्रकार पर निर्भर',
    def: result.def.includes('no') ? 'कई भारतीय वेरिएंट में अलग DEF टैंक नहीं होता' : 'BS6 डीजल वेरिएंट में SCR/DEF सिस्टम हो सकता है',
    usage: result.usage.includes('Not applicable') ? 'अगर DEF टैंक नहीं है तो लागू नहीं।' : 'आम तौर पर 1-3 लीटर प्रति 1,000 किमी, ड्राइविंग स्टाइल और लोड पर निर्भर।',
    instructions: 'सही लो-ऐश इंजन ऑयल और ISO 22241 DEF इस्तेमाल करें। DPF चेतावनी पर हाईवे रीजेनरेशन पूरा करें और स्कैनर से soot load, differential pressure, SCR/NOx डेटा जांचें.',
  }
  if (language === 'te') return {
    dpf: result.dpf.startsWith('Yes') ? 'అవును' : 'మోడల్ సంవత్సరం మరియు ఫ్యూయల్ రకంపై ఆధారపడి ఉంటుంది',
    def: result.def.includes('no') ? 'చాలా భారతీయ వేరియంట్లలో ప్రత్యేక DEF ట్యాంక్ ఉండదు' : 'BS6 డీజిల్ వేరియంట్లలో SCR/DEF సిస్టమ్ ఉండవచ్చు',
    usage: result.usage.includes('Not applicable') ? 'DEF ట్యాంక్ లేకపోతే వర్తించదు.' : 'సాధారణంగా 1,000 కిమీకి 1-3 లీటర్లు, డ్రైవింగ్ స్టైల్ మరియు లోడ్‌పై ఆధారపడి ఉంటుంది.',
    instructions: 'సరైన లో-యాష్ ఇంజిన్ ఆయిల్ మరియు ISO 22241 DEF వాడండి. DPF వార్నింగ్ వస్తే హైవే రీజెనరేషన్ పూర్తి చేసి scanner లో soot load, differential pressure, SCR/NOx డేటా చెక్ చేయండి.',
  }
  return result
}

function localizeCarMeta(value = '', language) {
  if (language === 'hi') return value
    .replaceAll('Micro SUV', 'माइक्रो SUV')
    .replaceAll('Hatchback', 'हैचबैक')
    .replaceAll('MPV', 'MPV')
    .replaceAll('Petrol', 'पेट्रोल')
    .replaceAll('Diesel', 'डीजल')
    .replaceAll('Hybrid', 'हाइब्रिड')
  if (language === 'te') return value
    .replaceAll('Micro SUV', 'మైక్రో SUV')
    .replaceAll('Hatchback', 'హ్యాచ్‌బ్యాక్')
    .replaceAll('MPV', 'MPV')
    .replaceAll('Petrol', 'పెట్రోల్')
    .replaceAll('Diesel', 'డీజిల్')
    .replaceAll('Hybrid', 'హైబ్రిడ్')
  return value
}

const LANGS = {
  en: {
    name: 'English', home: 'Home', admin: 'Admin', nearby: 'Nearby', cars: 'Cars', dpf: 'DPF/DEF', services: 'Services', history: 'History',
    login: 'Sign in', signup: 'Sign up', logout: 'Log out', heroTitle: 'Professional vehicle diagnostics, local help and service support in one place.',
    heroText: 'Search DTC codes, understand faults in your language, find nearby mechanics, manage shops, and contact DiagHub for ECU, scanner and DPF work.',
    heroTag: 'Live diagnostics workspace for owners and workshops', startDiagnosis: 'Start diagnosis', codeSearch: 'DTC code lookup', enterCode: 'Enter DTC / OBD code',
    search: 'Search', searching: 'Searching...', uploadImage: 'Upload DTC image', askAi: 'Ask AI', findMechanic: 'Find mechanic nearby', symptoms: 'Symptoms',
    fixes: 'Next step', causes: 'Causes', profile: 'Admin Profile', displayName: 'Display name', emailPhone: 'Email or phone number', password: 'Password',
    photo: 'Profile picture', location: 'Location access', locationHelp: 'Location is used to show shops within 20 km.', addShop: 'Add Shop', shopName: 'Shop name',
    ownerName: 'Owner name', workType: 'Work type', mechanic: 'Mechanic', electrician: 'Electrician', parts: 'Auto parts store', shopLocation: 'Shop location',
    address: 'Address from location', pincode: 'Pin code', mobile: 'Mobile number', showNearby: 'Display my shop in nearby search',
    mobileService: 'Mobile service available', fee: 'Registration fee', invite: 'Invite code', payment: 'Submit for review', noFee: 'No fee with valid invite code',
    registered: 'Registered shops', dpfTitle: 'DPF / DEF Information', selectVehicle: 'Select vehicle', result: 'Result', defUse: 'AdBlue / DEF usage',
    instructions: 'Instructions', carInfo: 'Car Information', trending: 'Trending cars', allBrands: 'All car brands', searchCar: 'Search brand, model or fuel',
    models: 'Models', myGarage: 'My Garage', pilot: 'Saved vehicles, service notes and diagnosis records will appear here.', fallback: 'If no registered shop is found, use Maps results until DiagHub verifies local partners.',
    contactMe: 'Contact me', liveSource: 'Live source', fallbackSource: 'Demo trend list', liveApiNote: 'Connect a sales/search API with VITE_TRENDING_CARS_API for real-time trending cars.',
    serviceIntro: 'Contact DiagHub directly for these professional services.', invalidCode: 'Enter a valid 5-character OBD code, for example P0301, C0035, B0001, or U0100.',
    localDtc: 'Live provider not connected yet. Showing DiagHub diagnostic guidance.', remoteDtc: 'Live provider result loaded.', shopVisit: 'Shop visit',
    signedIn: 'Signed in', adminHelp: 'This panel is ready to connect to Supabase Auth or Firebase OTP for production sign-in.', garageEmpty: 'Saved vehicles, past DTC searches, uploaded images, shop visits, bills and reminders will appear here.',
    make: 'Make', year: 'Year', fuel: 'Fuel', note: 'Note',
  },
  hi: {
    name: 'हिंदी', home: 'होम', admin: 'एडमिन', nearby: 'नज़दीक', cars: 'कारें', dpf: 'DPF/DEF', services: 'सेवाएं', history: 'इतिहास',
    login: 'साइन इन', signup: 'साइन अप', logout: 'लॉग आउट', heroTitle: 'वाहन डायग्नोस्टिक्स, नज़दीकी सहायता और सर्विस सपोर्ट एक जगह।',
    heroText: 'DTC कोड खोजें, अपनी भाषा में खराबी समझें, नज़दीकी मैकेनिक खोजें, दुकानें मैनेज करें और ECU, स्कैनर व DPF काम के लिए DiagHub से संपर्क करें।',
    heroTag: 'मालिकों और वर्कशॉप के लिए लाइव डायग्नोस्टिक वर्कस्पेस', startDiagnosis: 'डायग्नोसिस शुरू करें', codeSearch: 'DTC कोड खोज', enterCode: 'DTC / OBD कोड डालें',
    search: 'खोजें', searching: 'खोज रहे हैं...', uploadImage: 'DTC फोटो अपलोड', askAi: 'AI से पूछें', findMechanic: 'नज़दीकी मैकेनिक खोजें', symptoms: 'लक्षण',
    fixes: 'अगला कदम', causes: 'कारण', profile: 'एडमिन प्रोफाइल', displayName: 'नाम', emailPhone: 'ईमेल या फोन नंबर', password: 'पासवर्ड',
    photo: 'प्रोफाइल फोटो', location: 'लोकेशन एक्सेस', locationHelp: '20 किमी के अंदर दुकानें दिखाने के लिए लोकेशन इस्तेमाल होती है।', addShop: 'दुकान जोड़ें', shopName: 'दुकान का नाम',
    ownerName: 'मालिक का नाम', workType: 'काम का प्रकार', mechanic: 'मैकेनिक', electrician: 'इलेक्ट्रिशियन', parts: 'ऑटो पार्ट्स स्टोर', shopLocation: 'दुकान लोकेशन',
    address: 'लोकेशन से पता', pincode: 'पिन कोड', mobile: 'मोबाइल नंबर', showNearby: 'मेरी दुकान नज़दीकी खोज में दिखाएं',
    mobileService: 'मोबाइल सर्विस उपलब्ध', fee: 'रजिस्ट्रेशन फीस', invite: 'इनवाइट कोड', payment: 'रिव्यू के लिए भेजें', noFee: 'वैध इनवाइट कोड पर कोई फीस नहीं',
    registered: 'रजिस्टर्ड दुकानें', dpfTitle: 'DPF / DEF जानकारी', selectVehicle: 'वाहन चुनें', result: 'परिणाम', defUse: 'AdBlue / DEF उपयोग',
    instructions: 'निर्देश', carInfo: 'कार जानकारी', trending: 'ट्रेंडिंग कारें', allBrands: 'सभी कार ब्रांड', searchCar: 'ब्रांड, मॉडल या ईंधन खोजें',
    models: 'मॉडल', myGarage: 'मेरा गैरेज', pilot: 'सेव वाहन, सर्विस नोट्स और डायग्नोसिस रिकॉर्ड यहां दिखेंगे।', fallback: 'रजिस्टर्ड दुकान न मिले तो DiagHub पार्टनर वेरिफाई होने तक Maps रिजल्ट इस्तेमाल करें।',
    contactMe: 'मुझसे संपर्क करें', liveSource: 'लाइव सोर्स', fallbackSource: 'डेमो ट्रेंड सूची', liveApiNote: 'रीयल-टाइम ट्रेंडिंग कारों के लिए VITE_TRENDING_CARS_API से सेल्स/सर्च API जोड़ें।',
    serviceIntro: 'इन प्रोफेशनल सेवाओं के लिए DiagHub से सीधे संपर्क करें।', invalidCode: 'सही 5 अक्षर का OBD कोड डालें, जैसे P0301, C0035, B0001 या U0100।',
    localDtc: 'लाइव प्रोवाइडर अभी कनेक्ट नहीं है। DiagHub गाइडेंस दिखा रहे हैं।', remoteDtc: 'लाइव प्रोवाइडर परिणाम लोड हुआ।', shopVisit: 'दुकान विजिट',
    signedIn: 'साइन इन हो गया', adminHelp: 'प्रोडक्शन साइन-इन के लिए यह पैनल Supabase Auth या Firebase OTP से जुड़ सकता है।', garageEmpty: 'सेव वाहन, पुराने DTC, अपलोड, दुकान विजिट, बिल और रिमाइंडर यहां दिखेंगे।',
    make: 'ब्रांड', year: 'वर्ष', fuel: 'ईंधन', note: 'नोट',
  },
  te: {
    name: 'తెలుగు', home: 'హోమ్', admin: 'అడ్మిన్', nearby: 'దగ్గరలో', cars: 'కార్లు', dpf: 'DPF/DEF', services: 'సర్వీసులు', history: 'హిస్టరీ',
    login: 'సైన్ ఇన్', signup: 'సైన్ అప్', logout: 'లాగౌట్', heroTitle: 'వాహన డయాగ్నోస్టిక్స్, స్థానిక సహాయం, సర్వీస్ సపోర్ట్ అన్నీ ఒకే చోట.',
    heroText: 'DTC కోడ్లు వెతకండి, మీ భాషలో ఫాల్ట్ అర్థం చేసుకోండి, దగ్గరలో మెకానిక్‌లను కనుగొనండి, షాపులను నిర్వహించండి, ECU, స్కానర్, DPF పనుల కోసం DiagHub ని సంప్రదించండి.',
    heroTag: 'యజమానులు మరియు వర్క్‌షాప్‌ల కోసం లైవ్ డయాగ్నోస్టిక్ వర్క్‌స్పేస్', startDiagnosis: 'డయాగ్నోసిస్ ప్రారంభించండి', codeSearch: 'DTC కోడ్ లుకప్', enterCode: 'DTC / OBD కోడ్ నమోదు చేయండి',
    search: 'వెతకండి', searching: 'వెతుకుతోంది...', uploadImage: 'DTC ఫోటో అప్‌లోడ్', askAi: 'AI ని అడగండి', findMechanic: 'దగ్గరలో మెకానిక్ కనుగొనండి', symptoms: 'లక్షణాలు',
    fixes: 'తదుపరి చర్య', causes: 'కారణాలు', profile: 'అడ్మిన్ ప్రొఫైల్', displayName: 'పేరు', emailPhone: 'ఈమెయిల్ లేదా ఫోన్', password: 'పాస్‌వర్డ్',
    photo: 'ప్రొఫైల్ ఫోటో', location: 'లోకేషన్ యాక్సెస్', locationHelp: '20 కిమీ లోపు షాపులను చూపడానికి లోకేషన్ ఉపయోగిస్తాం.', addShop: 'షాప్ జోడించండి', shopName: 'షాప్ పేరు',
    ownerName: 'ఓనర్ పేరు', workType: 'పని రకం', mechanic: 'మెకానిక్', electrician: 'ఎలక్ట్రిషియన్', parts: 'ఆటో పార్ట్స్ స్టోర్', shopLocation: 'షాప్ లోకేషన్',
    address: 'లోకేషన్ ద్వారా అడ్రస్', pincode: 'పిన్ కోడ్', mobile: 'మొబైల్ నంబర్', showNearby: 'నా షాప్ దగ్గరలో సెర్చ్‌లో చూపండి',
    mobileService: 'మొబైల్ సర్వీస్ ఉంది', fee: 'రిజిస్ట్రేషన్ ఫీజు', invite: 'ఇన్వైట్ కోడ్', payment: 'రివ్యూ కోసం పంపండి', noFee: 'సరైన ఇన్వైట్ కోడ్ ఉంటే ఫీజు లేదు',
    registered: 'రిజిస్టర్ షాపులు', dpfTitle: 'DPF / DEF సమాచారం', selectVehicle: 'వాహనం ఎంచుకోండి', result: 'ఫలితం', defUse: 'AdBlue / DEF వినియోగం',
    instructions: 'సూచనలు', carInfo: 'కారు సమాచారం', trending: 'ట్రెండింగ్ కార్లు', allBrands: 'అన్ని కార్ బ్రాండ్స్', searchCar: 'బ్రాండ్, మోడల్ లేదా ఫ్యూయల్ వెతకండి',
    models: 'మోడల్స్', myGarage: 'మై గ్యారేజ్', pilot: 'సేవ్ వాహనాలు, సర్వీస్ నోట్స్, డయాగ్నోసిస్ రికార్డ్స్ ఇక్కడ కనిపిస్తాయి.', fallback: 'రిజిస్టర్ షాప్ లేకపోతే DiagHub పార్టనర్లు వెరిఫై అయ్యే వరకు Maps రిజల్ట్స్ వాడండి.',
    contactMe: 'నన్ను సంప్రదించండి', liveSource: 'లైవ్ సోర్స్', fallbackSource: 'డెమో ట్రెండ్ లిస్ట్', liveApiNote: 'రీయల్ టైమ్ ట్రెండింగ్ కార్ల కోసం VITE_TRENDING_CARS_API తో సేల్స్/సెర్చ్ API కనెక్ట్ చేయండి.',
    serviceIntro: 'ఈ ప్రొఫెషనల్ సర్వీసుల కోసం DiagHub ని నేరుగా సంప్రదించండి.', invalidCode: 'P0301, C0035, B0001 లేదా U0100 లాంటి సరైన 5 అక్షరాల OBD కోడ్ నమోదు చేయండి.',
    localDtc: 'లైవ్ ప్రొవైడర్ ఇంకా కనెక్ట్ కాలేదు. DiagHub గైడెన్స్ చూపిస్తున్నాం.', remoteDtc: 'లైవ్ ప్రొవైడర్ రిజల్ట్ లోడ్ అయింది.', shopVisit: 'షాప్ విజిట్',
    signedIn: 'సైన్ ఇన్ అయింది', adminHelp: 'ప్రొడక్షన్ సైన్-ఇన్ కోసం ఈ ప్యానెల్ Supabase Auth లేదా Firebase OTP కి కనెక్ట్ చేయవచ్చు.', garageEmpty: 'సేవ్ వాహనాలు, పాత DTCలు, అప్‌లోడ్లు, షాప్ విజిట్లు, బిల్లులు, రిమైండర్లు ఇక్కడ కనిపిస్తాయి.',
    make: 'బ్రాండ్', year: 'సంవత్సరం', fuel: 'ఫ్యూయల్', note: 'నోట్',
  },
}

const CODE_PATTERN = /^[PBCU][0-9A-F]{4}$/

function normalizeRemoteDtc(payload) {
  if (!payload?.description && !payload?.explanation && !payload?.causes?.length) return null
  return {
    title: payload.description || payload.definition || payload.name,
    summary: payload.explanation || 'Provider returned a match for this DTC code.',
    causes: Array.isArray(payload.causes) && payload.causes.length ? payload.causes : ['Confirm with scanner live data and vehicle service information'],
  }
}

function App() {
  const [lang, setLang] = useState('en')
  const t = LANGS[lang]
  const [tab, setTab] = useState('home')
  const [code, setCode] = useState('P0301')
  const [authMode, setAuthMode] = useState('login')
  const [user, setUser] = useState(null)
  const [shops, setShops] = useState(shopsSeed)
  const [carQuery, setCarQuery] = useState('')
  const [vehicle, setVehicle] = useState('Mahindra XUV700')
  const [remoteDtc, setRemoteDtc] = useState(null)
  const [dtcStatus, setDtcStatus] = useState('idle')
  const [trendingCars, setTrendingCars] = useState(defaultTrendingCars)
  const [trendSource, setTrendSource] = useState('fallback')
  const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5)
  const validCode = CODE_PATTERN.test(cleanCode)
  const nav = ['home', 'admin', 'nearby', 'cars', 'dpf', 'services', 'history']

  useEffect(() => {
    const endpoint = import.meta.env.VITE_TRENDING_CARS_API
    if (!endpoint) return
    fetch(endpoint)
      .then(result => result.ok ? result.json() : Promise.reject(new Error('trend_failed')))
      .then(payload => {
        const cars = Array.isArray(payload) ? payload : payload.cars
        if (Array.isArray(cars) && cars.length) {
          setTrendingCars(cars.map(car => typeof car === 'string' ? { name: car } : car).slice(0, 12))
          setTrendSource('live')
        }
      })
      .catch(() => setTrendSource('fallback'))
  }, [])

  const dtc = cleanCode && validCode ? diagnosisFor(cleanCode, lang, normalizeRemoteDtc(remoteDtc)) : null
  const allModels = useMemo(() => [...new Set([...Object.keys(dpfDb), 'Maruti Swift', 'Maruti Brezza', 'Hyundai i20', 'Honda City', 'Skoda Slavia', 'Volkswagen Virtus', 'BYD Atto 3'])], [])
  const filteredModels = allModels.filter(model => model.toLowerCase().includes(carQuery.toLowerCase()))
  const dpfResult = dpfDb[vehicle] || genericDpf
  const visibleDpf = localizeDpfResult(dpfResult, lang)

  function authenticate(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setUser({
      name: fd.get('name') || 'DiagHub Admin',
      contact: fd.get('contact') || 'admin@diaghub.in',
      location: 'Location permission not requested',
    })
    setTab('admin')
  }

  function addShop(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setShops([{ shop: fd.get('shop'), owner: fd.get('owner'), type: fd.get('type'), mobile: fd.get('mobile'), dist: 'New - within 20 km', mobileService: fd.get('mobileService') === 'on' }, ...shops])
    e.currentTarget.reset()
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setUser(u => ({ ...u, location: 'Location access allowed' })),
        () => setUser(u => ({ ...u, location: 'Location permission denied' })),
      )
    }
  }

  async function searchDtc(e) {
    e.preventDefault()
    setRemoteDtc(null)
    if (!validCode) { setDtcStatus(cleanCode ? 'invalid' : 'idle'); return }
    setDtcStatus('loading')
    try {
      const result = await fetch(`/api/dtc/${encodeURIComponent(cleanCode)}?lang=${encodeURIComponent(lang)}`)
      if (!result.ok) throw new Error('lookup_failed')
      const payload = await result.json()
      setRemoteDtc(payload)
      setDtcStatus(['carapi', 'gemini'].includes(payload.source) ? 'remote' : 'local')
    } catch {
      setDtcStatus('local')
    }
  }

  return <div className="app">
    <header className="topbar">
      <button className="brand" onClick={() => setTab('home')}><span>DH</span><b>DiagHub</b></button>
      <nav>{nav.map(n => <button key={n} onClick={() => setTab(n)} className={tab === n ? 'active' : ''}>{t[n]}</button>)}</nav>
      <select aria-label="Language" value={lang} onChange={e => setLang(e.target.value)}>{Object.entries(LANGS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}</select>
    </header>
    <main>
      {tab === 'home' && <section className="hero">
        <div className="heroCopy">
          <p className="kicker">{t.heroTag}</p>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
          <div className="heroActions"><button onClick={() => setTab('nearby')}>{t.findMechanic}</button><button onClick={() => setTab('admin')} className="secondary">{t.addShop}</button></div>
        </div>
        <DtcCard t={t} code={code} setCode={setCode} dtc={dtc} status={dtcStatus} onSearch={searchDtc} />
      </section>}

      {tab === 'admin' && <section className="grid2">
        <div className="card authCard">
          <div className="segmented"><button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>{t.login}</button><button className={authMode === 'signup' ? 'active' : ''} onClick={() => setAuthMode('signup')}>{t.signup}</button></div>
          <h2>{user ? t.profile : authMode === 'login' ? t.login : t.signup}</h2>
          {!user ? <form onSubmit={authenticate} className="form">
            {authMode === 'signup' && <input name="name" placeholder={t.displayName} />}
            <input name="contact" placeholder={t.emailPhone} />
            <input name="password" type="password" placeholder={t.password} />
            <button>{authMode === 'login' ? t.login : t.signup}</button>
            <p className="note">{t.adminHelp}</p>
          </form> : <div className="profile">
            <div className="avatar">{user.name[0]}</div><h3>{user.name}</h3><p>{user.contact}</p><p>{t.signedIn} - {user.location}</p>
            <button onClick={getLocation}>{t.location}</button><button className="secondary" onClick={() => setUser(null)}>{t.logout}</button><p className="note">{t.locationHelp}</p>
          </div>}
        </div>
        <div className="card"><h2>{t.addShop}</h2><form onSubmit={addShop} className="form">
          <input name="shop" placeholder={t.shopName} required /><input name="owner" placeholder={t.ownerName} required />
          <select name="type"><option>{t.mechanic}</option><option>{t.electrician}</option><option>{t.parts}</option></select>
          <input name="location" placeholder={t.shopLocation} /><input name="address" placeholder={t.address} /><input name="pin" placeholder={t.pincode} /><input name="mobile" placeholder={t.mobile} required />
          <label><input type="checkbox" name="show" defaultChecked /> {t.showNearby}</label><label><input type="checkbox" name="mobileService" /> {t.mobileService}</label>
          <input name="invite" placeholder={t.invite} /><div className="fee">₹250 - {t.noFee}</div><button>{t.payment}</button>
        </form></div>
      </section>}

      {tab === 'nearby' && <section><SectionTitle title={t.nearby} text={`${t.findMechanic}. ${t.fallback}`} /><div className="shopGrid">{shops.map(s => <div className="card shop" key={s.shop}><h3>{s.shop}</h3><p>{s.type} - {s.dist}</p><p>{s.owner} - {s.mobile}</p><span>{s.mobileService ? t.mobileService : t.shopVisit}</span></div>)}</div></section>}

      {tab === 'cars' && <section><SectionTitle title={t.carInfo} text={t.liveApiNote} /><input className="wideSearch" value={carQuery} onChange={e => setCarQuery(e.target.value)} placeholder={t.searchCar} />
        <h3>{t.trending} <span className="sourceTag">{trendSource === 'live' ? t.liveSource : t.fallbackSource}</span></h3>
        <div className="carGrid">{trendingCars.map(c => <div className="carTile" key={c.name}><strong>{c.name}</strong><span>{localizeCarMeta(c.segment || t.models, lang)}</span><p>{localizeCarMeta(c.fuel || c.reason || t.carInfo, lang)}</p></div>)}</div>
        <h3>{t.allBrands}</h3><div className="cards">{vehicleMakes.car.map(b => <div className="mini" key={b}>{b}</div>)}</div>
        <h3>{t.models}</h3><div className="cards">{filteredModels.map(m => <div className="mini" key={m}>{m}</div>)}</div>
      </section>}

      {tab === 'dpf' && <section><SectionTitle title={t.dpfTitle} text={`${t.selectVehicle}: ${t.make}, ${t.year}, ${t.fuel}`} /><div className="card form vehiclePanel">
        <label>{t.selectVehicle}<select value={vehicle} onChange={e => setVehicle(e.target.value)}>{Object.keys(dpfDb).map(v => <option key={v}>{v}</option>)}</select></label>
        <label>{t.year}<select defaultValue={vehicleYears[0]}>{vehicleYears.slice(0, 18).map(y => <option key={y}>{y}</option>)}</select></label>
        <label>{t.fuel}<select defaultValue={(fuelLabels[lang] || fuelLabels.en)[0]}>{(fuelLabels[lang] || fuelLabels.en).map(fuel => <option key={fuel}>{fuel}</option>)}</select></label>
        <div className="result"><h3>{t.result}: {vehicle}</h3><p><b>DPF:</b> {visibleDpf.dpf}</p><p><b>DEF:</b> {visibleDpf.def}</p><p><b>{t.defUse}:</b> {visibleDpf.usage}</p><p><b>{t.instructions}:</b> {visibleDpf.instructions}</p><p className="note">{t.note}: {localizeDpfResult(genericDpf, lang).instructions}</p></div>
      </div></section>}

      {tab === 'services' && <section><SectionTitle title={t.services} text={t.serviceIntro} /><div className="cards servicesGrid">{services.map(service => <div className="mini service" key={service}><strong>{service}</strong><a className="buttonLink" href={whatsappUrl(service)} target="_blank" rel="noreferrer">{t.contactMe}</a></div>)}</div></section>}

      {tab === 'history' && <section><SectionTitle title={t.myGarage} text={t.pilot} /><div className="card"><h3>{t.history}</h3><p>{t.garageEmpty}</p></div></section>}
    </main>
    <nav className="bottom">{nav.slice(0, 5).map(n => <button key={n} onClick={() => setTab(n)} className={tab === n ? 'active' : ''}>{t[n]}</button>)}</nav>
  </div>
}

function DtcCard({ t, code, setCode, dtc, status, onSearch }) {
  return <div className="card dtc"><h2>{t.codeSearch}</h2><form className="searchBox" onSubmit={onSearch}><input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder={t.enterCode} /><button disabled={status === 'loading'}>{status === 'loading' ? t.searching : t.search}</button></form><div className="upload">{t.uploadImage}</div>{status === 'invalid' && <p className="note">{t.invalidCode}</p>}{status === 'local' && <p className="note">{t.localDtc}</p>}{status === 'remote' && <p className="note">{t.remoteDtc}</p>}{dtc && <div className="result"><h3>{dtc.title}</h3><p><b>{t.symptoms}:</b> {dtc.summary}</p><p><b>{t.causes}:</b> {dtc.causes.join(', ')}</p><p><b>{t.fixes}:</b> {dtc.urgency}</p><button>{t.askAi}</button></div>}</div>
}

function SectionTitle({ title, text }) {
  return <div className="sectionTitle"><h1>{title}</h1><p>{text}</p></div>
}

export default App
