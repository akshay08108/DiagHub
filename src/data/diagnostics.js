export const dtcCatalog = {
  P0010: ['Camshaft position actuator circuit — Bank 1', 'The engine computer detected an electrical problem in the intake camshaft timing circuit.', ['Wiring or connector issue', 'Faulty camshaft actuator', 'Low or dirty engine oil']],
  P0011: ['Camshaft timing over-advanced — Bank 1', 'The intake camshaft timing is more advanced than commanded.', ['Dirty or low engine oil', 'Sticking timing control valve', 'Timing chain problem']],
  P0016: ['Crankshaft/camshaft timing mismatch', 'The crankshaft and camshaft position signals are not correctly aligned.', ['Stretched timing chain', 'Faulty position sensor', 'Incorrect valve timing']],
  P0030: ['Oxygen sensor heater circuit — Bank 1 Sensor 1', 'The heater circuit for the first oxygen sensor has an electrical fault.', ['Blown fuse', 'Damaged wiring', 'Faulty oxygen sensor']],
  P0100: ['Mass airflow sensor circuit fault', 'The computer cannot reliably read the amount of air entering the engine.', ['Dirty airflow sensor', 'Air intake leak', 'Damaged wiring']],
  P0101: ['Mass airflow sensor range/performance', 'The airflow reading is outside the expected range for current engine conditions.', ['Dirty airflow sensor', 'Intake leak', 'Restricted air filter']],
  P0113: ['Intake air temperature sensor input high', 'The intake air temperature signal indicates an implausibly cold reading.', ['Disconnected sensor', 'Open wiring circuit', 'Faulty temperature sensor']],
  P0128: ['Coolant temperature below regulating temperature', 'The engine is taking too long to reach normal operating temperature.', ['Thermostat stuck open', 'Low coolant', 'Coolant temperature sensor fault']],
  P0130: ['Oxygen sensor circuit fault — Bank 1 Sensor 1', 'The first oxygen sensor signal is missing or outside its expected range.', ['Faulty oxygen sensor', 'Exhaust leak', 'Damaged wiring']],
  P0135: ['Oxygen sensor heater fault — Bank 1 Sensor 1', 'The oxygen sensor heater is not warming up as expected.', ['Blown fuse', 'Faulty oxygen sensor', 'Wiring problem']],
  P0171: ['Engine running too lean — Bank 1', 'The engine is receiving too much air or not enough fuel.', ['Vacuum leak', 'Dirty airflow sensor', 'Low fuel pressure']],
  P0172: ['Engine running too rich — Bank 1', 'The engine is receiving too much fuel or not enough air.', ['Leaking injector', 'Dirty air filter', 'Faulty airflow or oxygen sensor']],
  P0201: ['Cylinder 1 injector circuit fault', 'The computer detected an electrical problem with the cylinder 1 fuel injector.', ['Injector connector problem', 'Damaged wiring', 'Faulty injector']],
  P0234: ['Turbocharger overboost condition', 'Turbo boost pressure exceeded the safe commanded level.', ['Sticking wastegate', 'Boost control solenoid fault', 'Blocked control hose']],
  P0299: ['Turbocharger underboost condition', 'The engine is producing less turbo boost than requested.', ['Boost leak', 'Sticking wastegate', 'Worn turbocharger']],
  P0300: ['Random or multiple cylinder misfire', 'The engine is misfiring across more than one cylinder.', ['Weak ignition system', 'Vacuum or air leak', 'Fuel pressure problem']],
  P0301: ['Cylinder 1 misfire detected', 'Cylinder 1 is not burning fuel correctly. You may notice shaking, weak acceleration, or higher fuel use.', ['Worn spark plug', 'Faulty ignition coil', 'Fuel injector issue']],
  P0302: ['Cylinder 2 misfire detected', 'Cylinder 2 is not burning fuel correctly.', ['Worn spark plug', 'Faulty ignition coil', 'Fuel injector issue']],
  P0303: ['Cylinder 3 misfire detected', 'Cylinder 3 is not burning fuel correctly.', ['Worn spark plug', 'Faulty ignition coil', 'Fuel injector issue']],
  P0304: ['Cylinder 4 misfire detected', 'Cylinder 4 is not burning fuel correctly.', ['Worn spark plug', 'Faulty ignition coil', 'Fuel injector issue']],
  P0325: ['Knock sensor circuit fault — Bank 1', 'The engine computer cannot reliably read the knock sensor.', ['Faulty knock sensor', 'Damaged wiring', 'Poor electrical connection']],
  P0335: ['Crankshaft position sensor circuit fault', 'The crankshaft position signal is missing or unreliable.', ['Faulty crankshaft sensor', 'Damaged reluctor wheel', 'Wiring problem']],
  P0340: ['Camshaft position sensor circuit fault', 'The camshaft position signal is missing or unreliable.', ['Faulty camshaft sensor', 'Wiring problem', 'Timing issue']],
  P0401: ['Exhaust gas recirculation flow insufficient', 'The EGR system is flowing less exhaust gas than commanded.', ['Blocked EGR passage', 'Stuck EGR valve', 'Faulty pressure sensor']],
  P0420: ['Catalyst efficiency below threshold — Bank 1', 'The catalytic converter is not cleaning exhaust as effectively as expected.', ['Worn catalytic converter', 'Faulty oxygen sensor', 'Exhaust leak']],
  P0440: ['Evaporative emission system fault', 'The fuel-vapour control system detected a general leak or malfunction.', ['Loose fuel cap', 'Cracked vapour hose', 'Purge valve fault']],
  P0442: ['Small evaporative emission leak', 'A small leak was detected in the fuel-vapour control system.', ['Loose or damaged fuel cap', 'Small hose leak', 'Vent valve fault']],
  P0455: ['Large evaporative emission leak', 'A large leak was detected in the fuel-vapour control system.', ['Missing fuel cap', 'Disconnected vapour hose', 'Stuck vent valve']],
  P0500: ['Vehicle speed sensor fault', 'The computer is not receiving a reliable vehicle-speed signal.', ['Faulty speed sensor', 'Damaged wiring', 'ABS sensor issue']],
  P0505: ['Idle control system fault', 'The engine computer cannot maintain the requested idle speed.', ['Dirty throttle body', 'Vacuum leak', 'Idle control valve fault']],
  P0562: ['System voltage too low', 'The vehicle detected low electrical voltage. Starting trouble or dim lights may appear.', ['Weak battery', 'Alternator problem', 'Loose or corroded cable']],
  P0606: ['Engine control module processor fault', 'The engine control module detected an internal processor problem.', ['Low system voltage', 'ECM power or ground fault', 'Faulty engine control module']],
  P0700: ['Transmission control system fault', 'The transmission controller has stored one or more detailed fault codes.', ['Transmission control fault', 'Wiring problem', 'Further transmission scan required']],
  P0715: ['Input/turbine speed sensor fault', 'The transmission input-speed signal is missing or unreliable.', ['Faulty speed sensor', 'Damaged wiring', 'Internal transmission issue']],
  P0730: ['Incorrect transmission gear ratio', 'The measured transmission gear ratio does not match the commanded gear.', ['Low or dirty transmission fluid', 'Shift solenoid fault', 'Internal clutch wear']],
  U0100: ['Lost communication with engine control module', 'Other control modules cannot communicate with the engine computer.', ['Weak battery voltage', 'CAN bus wiring fault', 'ECM power or ground problem']],
  U0121: ['Lost communication with ABS control module', 'The vehicle network cannot communicate with the ABS controller.', ['Weak battery voltage', 'CAN bus wiring fault', 'ABS module power problem']],
  B0001: ['Driver frontal airbag circuit fault', 'A fault was detected in the driver airbag deployment circuit.', ['Connector or wiring fault', 'Clock spring problem', 'Airbag module fault']],
  C0035: ['Left front wheel speed sensor fault', 'The ABS controller cannot reliably read the left-front wheel speed.', ['Dirty or damaged sensor', 'Broken sensor wiring', 'Damaged tone ring']],
}

const localized = {
  hi: {
    P0301: ['सिलेंडर 1 में मिसफायर', 'सिलेंडर 1 में ईंधन सही तरह नहीं जल रहा है। वाहन कांप सकता है या शक्ति कम हो सकती है।', ['घिसा हुआ स्पार्क प्लग', 'खराब इग्निशन कॉइल', 'फ्यूल इंजेक्टर की समस्या']],
    P0420: ['कैटेलिस्ट की क्षमता सीमा से कम', 'कैटेलिटिक कन्वर्टर एग्जॉस्ट को अपेक्षित रूप से साफ नहीं कर रहा है।', ['घिसा कैटेलिटिक कन्वर्टर', 'खराब ऑक्सीजन सेंसर', 'एग्जॉस्ट रिसाव']],
    P0171: ['इंजन में ईंधन कम — बैंक 1', 'इंजन में हवा अधिक या ईंधन कम पहुंच रहा है।', ['वैक्यूम रिसाव', 'गंदा एयरफ्लो सेंसर', 'कम ईंधन दबाव']],
    P0562: ['सिस्टम वोल्टेज बहुत कम', 'वाहन ने कम विद्युत वोल्टेज पाया है।', ['कमजोर बैटरी', 'अल्टरनेटर समस्या', 'ढीली या जंग लगी केबल']],
  },
  te: {
    P0301: ['సిలిండర్ 1 మిస్‌ఫైర్ గుర్తించబడింది', 'సిలిండర్ 1లో ఇంధనం సరిగా మండటం లేదు.', ['పాడైన స్పార్క్ ప్లగ్', 'లోపమైన ఇగ్నిషన్ కాయిల్', 'ఫ్యూయల్ ఇంజెక్టర్ సమస్య']],
    P0420: ['క్యాటలిస్ట్ సామర్థ్యం పరిమితికంటే తక్కువ', 'క్యాటలిటిక్ కన్వర్టర్ ఎగ్జాస్ట్‌ను ఆశించినంతగా శుభ్రం చేయడం లేదు.', ['పాడైన క్యాటలిటిక్ కన్వర్టర్', 'లోపమైన ఆక్సిజన్ సెన్సర్', 'ఎగ్జాస్ట్ లీక్']],
    P0171: ['ఇంజిన్ లీన్‌గా నడుస్తోంది — బ్యాంక్ 1', 'ఇంజిన్‌కు గాలి ఎక్కువగా లేదా ఇంధనం తక్కువగా అందుతోంది.', ['వాక్యూమ్ లీక్', 'మురికైన ఎయిర్‌ఫ్లో సెన్సర్', 'తక్కువ ఇంధన పీడనం']],
    P0562: ['సిస్టమ్ వోల్టేజ్ చాలా తక్కువ', 'వాహనం తక్కువ విద్యుత్ వోల్టేజ్‌ను గుర్తించింది.', ['బలహీనమైన బ్యాటరీ', 'ఆల్టర్నేటర్ సమస్య', 'వదులైన లేదా తుప్పుపట్టిన కేబుల్']],
  },
  ta: {
    P0301: ['சிலிண்டர் 1 மிஸ்ஃபயர் கண்டறியப்பட்டது', 'சிலிண்டர் 1-ல் எரிபொருள் சரியாக எரியவில்லை.', ['தேய்ந்த ஸ்பார்க் பிளக்', 'பழுதான இக்னிஷன் காயில்', 'ஃபியூல் இன்ஜெக்டர் பிரச்சினை']],
    P0420: ['கேட்டலிஸ்ட் திறன் வரம்புக்குக் கீழே', 'கேட்டலிடிக் கன்வெர்டர் எதிர்பார்த்த அளவு வெளியேற்றத்தை சுத்தம் செய்யவில்லை.', ['தேய்ந்த கேட்டலிடிக் கன்வெர்டர்', 'பழுதான ஆக்சிஜன் சென்சார்', 'எக்ஸாஸ்ட் கசிவு']],
    P0171: ['எஞ்சின் லீன் நிலையில் இயங்குகிறது — வங்கி 1', 'எஞ்சினுக்கு அதிக காற்று அல்லது குறைந்த எரிபொருள் கிடைக்கிறது.', ['வெற்றிடக் கசிவு', 'அழுக்கான காற்றோட்ட சென்சார்', 'குறைந்த எரிபொருள் அழுத்தம்']],
    P0562: ['சிஸ்டம் மின்னழுத்தம் மிகக் குறைவு', 'வாகனம் குறைந்த மின்னழுத்தத்தைக் கண்டறிந்துள்ளது.', ['பலவீனமான பேட்டரி', 'ஆல்டர்னேட்டர் பிரச்சினை', 'தளர்ந்த அல்லது துருப்பிடித்த கேபிள்']],
  },
  kn: {
    P0301: ['ಸಿಲಿಂಡರ್ 1 ಮಿಸ್‌ಫೈರ್ ಪತ್ತೆಯಾಗಿದೆ', 'ಸಿಲಿಂಡರ್ 1ರಲ್ಲಿ ಇಂಧನ ಸರಿಯಾಗಿ ಉರಿಯುತ್ತಿಲ್ಲ.', ['ಸವೆದ ಸ್ಪಾರ್ಕ್ ಪ್ಲಗ್', 'ದೋಷಯುಕ್ತ ಇಗ್ನಿಷನ್ ಕಾಯಿಲ್', 'ಫ್ಯೂಯಲ್ ಇಂಜೆಕ್ಟರ್ ಸಮಸ್ಯೆ']],
    P0420: ['ಕ್ಯಾಟಲಿಸ್ಟ್ ದಕ್ಷತೆ ಮಿತಿಗಿಂತ ಕಡಿಮೆ', 'ಕ್ಯಾಟಲಿಟಿಕ್ ಕನ್ವರ್ಟರ್ ನಿರೀಕ್ಷಿತ ಮಟ್ಟದಲ್ಲಿ ಎಕ್ಸಾಸ್ಟ್ ಸ್ವಚ್ಛಗೊಳಿಸುತ್ತಿಲ್ಲ.', ['ಸವೆದ ಕ್ಯಾಟಲಿಟಿಕ್ ಕನ್ವರ್ಟರ್', 'ದೋಷಯುಕ್ತ ಆಮ್ಲಜನಕ ಸಂವೇದಕ', 'ಎಕ್ಸಾಸ್ಟ್ ಸೋರಿಕೆ']],
    P0171: ['ಎಂಜಿನ್ ಲೀನ್ ಆಗಿ ಚಲಿಸುತ್ತಿದೆ — ಬ್ಯಾಂಕ್ 1', 'ಎಂಜಿನ್‌ಗೆ ಹೆಚ್ಚು ಗಾಳಿ ಅಥವಾ ಕಡಿಮೆ ಇಂಧನ ಸಿಗುತ್ತಿದೆ.', ['ವ್ಯಾಕ್ಯೂಮ್ ಸೋರಿಕೆ', 'ಕೊಳಕಾದ ಏರ್‌ಫ್ಲೋ ಸಂವೇದಕ', 'ಕಡಿಮೆ ಇಂಧನ ಒತ್ತಡ']],
    P0562: ['ಸಿಸ್ಟಮ್ ವೋಲ್ಟೇಜ್ ತುಂಬಾ ಕಡಿಮೆ', 'ವಾಹನ ಕಡಿಮೆ ವಿದ್ಯುತ್ ವೋಲ್ಟೇಜ್ ಪತ್ತೆಹಚ್ಚಿದೆ.', ['ದುರ್ಬಲ ಬ್ಯಾಟರಿ', 'ಆಲ್ಟರ್ನೇಟರ್ ಸಮಸ್ಯೆ', 'ಸಡಿಲ ಅಥವಾ ತುಕ್ಕು ಹಿಡಿದ ಕೇಬಲ್']],
  },
  ml: {
    P0301: ['സിലിണ്ടർ 1 മിസ്‌ഫയർ കണ്ടെത്തി', 'സിലിണ്ടർ 1ൽ ഇന്ധനം ശരിയായി കത്തുന്നില്ല.', ['തേഞ്ഞ സ്പാർക്ക് പ്ലഗ്', 'തകരാറായ ഇഗ്നിഷൻ കോയിൽ', 'ഫ്യൂവൽ ഇൻജക്ടർ പ്രശ്നം']],
    P0420: ['കാറ്റലിസ്റ്റ് കാര്യക്ഷമത പരിധിക്കു താഴെ', 'കാറ്റലിറ്റിക് കൺവെർട്ടർ പ്രതീക്ഷിച്ചത്ര എക്സോസ്റ്റ് വൃത്തിയാക്കുന്നില്ല.', ['തേഞ്ഞ കാറ്റലിറ്റിക് കൺവെർട്ടർ', 'തകരാറായ ഓക്സിജൻ സെൻസർ', 'എക്സോസ്റ്റ് ചോർച്ച']],
    P0171: ['എഞ്ചിൻ ലീൻ ആയി പ്രവർത്തിക്കുന്നു — ബാങ്ക് 1', 'എഞ്ചിനിലേക്ക് കൂടുതൽ വായുവോ കുറഞ്ഞ ഇന്ധനമോ ലഭിക്കുന്നു.', ['വാക്വം ചോർച്ച', 'അഴുക്കായ എയർഫ്ലോ സെൻസർ', 'കുറഞ്ഞ ഇന്ധന മർദ്ദം']],
    P0562: ['സിസ്റ്റം വോൾട്ടേജ് വളരെ കുറവ്', 'വാഹനം കുറഞ്ഞ വൈദ്യുത വോൾട്ടേജ് കണ്ടെത്തി.', ['ദുർബലമായ ബാറ്ററി', 'ആൾട്ടർനേറ്റർ പ്രശ്നം', 'അയഞ്ഞതോ തുരുമ്പിച്ചതോ ആയ കേബിൾ']],
  },
}

const languageFallbacks = {
  en: { unknown: 'Description not available in the local library', summary: 'This code may be manufacturer-specific. Confirm it with the vehicle service manual or a professional scanner.', urgency: 'Confirm with a professional scanner' },
  hi: { unknown: 'स्थानीय लाइब्रेरी में विवरण उपलब्ध नहीं है', summary: 'यह निर्माता-विशिष्ट कोड हो सकता है। वाहन सर्विस मैनुअल या पेशेवर स्कैनर से पुष्टि करें।', urgency: 'पेशेवर स्कैनर से पुष्टि करें' },
  te: { unknown: 'స్థానిక లైబ్రరీలో వివరణ అందుబాటులో లేదు', summary: 'ఇది తయారీదారు-ప్రత్యేక కోడ్ కావచ్చు. వాహన సర్వీస్ మాన్యువల్ లేదా ప్రొఫెషనల్ స్కానర్‌తో నిర్ధారించండి.', urgency: 'ప్రొఫెషనల్ స్కానర్‌తో నిర్ధారించండి' },
  ta: { unknown: 'உள்ளூர் நூலகத்தில் விளக்கம் இல்லை', summary: 'இது உற்பத்தியாளர் சார்ந்த குறியீடாக இருக்கலாம். வாகன சேவை கையேடு அல்லது தொழில்முறை ஸ்கேனர் மூலம் உறுதிப்படுத்துங்கள்.', urgency: 'தொழில்முறை ஸ்கேனர் மூலம் உறுதிப்படுத்துங்கள்' },
  kn: { unknown: 'ಸ್ಥಳೀಯ ಲೈಬ್ರರಿಯಲ್ಲಿ ವಿವರಣೆ ಲಭ್ಯವಿಲ್ಲ', summary: 'ಇದು ತಯಾರಕ-ನಿರ್ದಿಷ್ಟ ಕೋಡ್ ಆಗಿರಬಹುದು. ವಾಹನ ಸೇವಾ ಕೈಪಿಡಿ ಅಥವಾ ವೃತ್ತಿಪರ ಸ್ಕ್ಯಾನರ್ ಮೂಲಕ ದೃಢಪಡಿಸಿ.', urgency: 'ವೃತ್ತಿಪರ ಸ್ಕ್ಯಾನರ್ ಮೂಲಕ ದೃಢಪಡಿಸಿ' },
  ml: { unknown: 'പ്രാദേശിക ലൈബ്രറിയിൽ വിവരണം ലഭ്യമല്ല', summary: 'ഇത് നിർമ്മാതാവിനനുസരിച്ചുള്ള കോഡ് ആയിരിക്കാം. വാഹന സർവീസ് മാനുവലോ പ്രൊഫഷണൽ സ്കാനറോ ഉപയോഗിച്ച് സ്ഥിരീകരിക്കുക.', urgency: 'പ്രൊഫഷണൽ സ്കാനർ ഉപയോഗിച്ച് സ്ഥിരീകരിക്കുക' },
}

const generatedMisfire = {
  en: cylinder => ({
    title: `Cylinder ${cylinder} misfire detected`,
    summary: `Cylinder ${cylinder} is not burning fuel correctly. The engine may shake, lose power, or use more fuel.`,
    causes: ['Worn spark plug', 'Faulty ignition coil', 'Fuel injector or compression issue'],
  }),
  hi: cylinder => ({
    title: `सिलेंडर ${cylinder} में मिसफायर`,
    summary: `सिलेंडर ${cylinder} में ईंधन सही तरह नहीं जल रहा है। इंजन कांप सकता है, पावर कम हो सकती है या ईंधन ज्यादा लग सकता है।`,
    causes: ['घिसा हुआ स्पार्क प्लग', 'खराब इग्निशन कॉइल', 'फ्यूल इंजेक्टर या कम्प्रेशन समस्या'],
  }),
  te: cylinder => ({
    title: `సిలిండర్ ${cylinder} మిస్‌ఫైర్ గుర్తించబడింది`,
    summary: `సిలిండర్ ${cylinder}లో ఇంధనం సరిగా మండటం లేదు. ఇంజిన్ కంపించవచ్చు, పవర్ తగ్గవచ్చు లేదా ఫ్యూయల్ ఎక్కువగా ఖర్చవచ్చు.`,
    causes: ['పాడైన స్పార్క్ ప్లగ్', 'లోపమైన ఇగ్నిషన్ కాయిల్', 'ఫ్యూయల్ ఇంజెక్టర్ లేదా కంప్రెషన్ సమస్య'],
  }),
  ta: cylinder => ({
    title: `சிலிண்டர் ${cylinder} மிஸ்ஃபயர் கண்டறியப்பட்டது`,
    summary: `சிலிண்டர் ${cylinder}-ல் எரிபொருள் சரியாக எரியவில்லை. எஞ்சின் அதிரலாம், சக்தி குறையலாம் அல்லது எரிபொருள் அதிகம் செலவாகலாம்.`,
    causes: ['தேய்ந்த ஸ்பார்க் பிளக்', 'பழுதான இக்னிஷன் காயில்', 'ஃபியூல் இன்ஜெக்டர் அல்லது கம்ப்ரஷன் பிரச்சினை'],
  }),
  kn: cylinder => ({
    title: `ಸಿಲಿಂಡರ್ ${cylinder} ಮಿಸ್‌ಫೈರ್ ಪತ್ತೆಯಾಗಿದೆ`,
    summary: `ಸಿಲಿಂಡರ್ ${cylinder}ರಲ್ಲಿ ಇಂಧನ ಸರಿಯಾಗಿ ಉರಿಯುತ್ತಿಲ್ಲ. ಎಂಜಿನ್ ಕಂಪಿಸಬಹುದು, ಪವರ್ ಕಡಿಮೆಯಾಗಬಹುದು ಅಥವಾ ಇಂಧನ ಹೆಚ್ಚು ಖರ್ಚಾಗಬಹುದು.`,
    causes: ['ಸವೆದ ಸ್ಪಾರ್ಕ್ ಪ್ಲಗ್', 'ದೋಷಯುಕ್ತ ಇಗ್ನಿಷನ್ ಕಾಯಿಲ್', 'ಫ್ಯೂಯಲ್ ಇಂಜೆಕ್ಟರ್ ಅಥವಾ ಕಂಪ್ರೆಷನ್ ಸಮಸ್ಯೆ'],
  }),
  ml: cylinder => ({
    title: `സിലിണ്ടർ ${cylinder} മിസ്‌ഫയർ കണ്ടെത്തി`,
    summary: `സിലിണ്ടർ ${cylinder}ൽ ഇന്ധനം ശരിയായി കത്തുന്നില്ല. എഞ്ചിൻ കുലുങ്ങുകയോ പവർ കുറയുകയോ ഇന്ധനം കൂടുതൽ ചെലവാകുകയോ ചെയ്യാം.`,
    causes: ['തേഞ്ഞ സ്പാർക്ക് പ്ലഗ്', 'തകരാറായ ഇഗ്നിഷൻ കോയിൽ', 'ഫ്യൂവൽ ഇൻജക്ടർ അല്ലെങ്കിൽ കമ്പ്രഷൻ പ്രശ്നം'],
  }),
}

export function diagnosisFor(code, language = 'en', remote = null) {
  const fallback = languageFallbacks[language] || languageFallbacks.en
  const localizedEntry = localized[language]?.[code]
  const entry = localizedEntry || dtcCatalog[code]
  if (entry) return { title: entry[0], summary: entry[1], causes: entry[2], urgency: fallback.urgency }
  const misfireCylinder = /^P03(0[1-9]|1[0-2])$/.test(code) ? Number(code.slice(3)) : 0
  if (misfireCylinder) return { ...(generatedMisfire[language] || generatedMisfire.en)(misfireCylinder), urgency: fallback.urgency }
  if (remote) return { ...remote, urgency: fallback.urgency }
  return { title: `${code} — ${fallback.unknown}`, summary: fallback.summary, causes: [fallback.urgency], urgency: fallback.urgency }
}
