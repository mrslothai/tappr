/**
 * Parse boarding pass from OCR text - handles Indian airline formats
 */

// Known noise words to filter from name detection
const NOISE_WORDS = [
  'UNLOCK', 'UNLIMITED', 'DISCOUNT', 'OFF', 'ADD-ONS', 'MEMBER',
  'EXCLUSIVE', 'DANGEROUS', 'GOODS', 'EXPLOSIVES', 'FLAMMABLE',
  'TOXIC', 'CORROSIVE', 'RADIOACTIVE', 'INFECTIOUS', 'BOOKING',
  'BOARDING', 'PASS', 'AVIATOR', 'EXPRESS', 'AIRLINE', 'COPY',
  'SECURITY', 'MANDATORY', 'PLEASE', 'MINISTRY', 'CIVIL', 'AVIATION',
  'AIRSEWA', 'STANDARD', 'PRIME', 'SEATS', 'GOURMET', 'HOT', 'MEALS',
  'XPRESS', 'AHEAD', 'PRIORITY', 'SERVICES', 'XCESS', 'XTRA',
];

const KNOWN_AIRPORTS = {
  'BOM': 'Mumbai', 'DEL': 'New Delhi', 'BLR': 'Bengaluru', 'HYD': 'Hyderabad',
  'MAA': 'Chennai', 'CCU': 'Kolkata', 'GOI': 'Goa', 'COK': 'Kochi',
  'AMD': 'Ahmedabad', 'PNQ': 'Pune', 'JAI': 'Jaipur', 'GAU': 'Guwahati',
  'IXC': 'Chandigarh', 'TRV': 'Thiruvananthapuram', 'PAT': 'Patna',
  'LKO': 'Lucknow', 'IXB': 'Bagdogra', 'VNS': 'Varanasi', 'IXR': 'Ranchi',
  'SXR': 'Srinagar', 'DED': 'Dehradun', 'IXA': 'Agartala', 'RPR': 'Raipur',
  'BBI': 'Bhubaneswar', 'IDR': 'Indore', 'NAG': 'Nagpur', 'VTZ': 'Visakhapatnam',
  'IXM': 'Madurai', 'CJB': 'Coimbatore', 'IXE': 'Mangaluru', 'STV': 'Surat',
  'JDH': 'Jodhpur', 'UDR': 'Udaipur', 'DUB': 'Dubai', 'SHJ': 'Sharjah',
  'DOH': 'Doha', 'SIN': 'Singapore', 'BKK': 'Bangkok', 'KUL': 'Kuala Lumpur',
  'LHR': 'London', 'JFK': 'New York', 'SFO': 'San Francisco',
};

export function parseBoardingPass(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const cleanText = text.replace(/\s+/g, ' ').trim();

  // --- PASSENGER NAME ---
  let name = '';
  // Strategy 1: Look for name right after "Boarding Pass" line
  for (let i = 0; i < lines.length; i++) {
    if (/boarding\s*pass/i.test(lines[i])) {
      // Next line(s) should be passenger name
      for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
        const candidate = lines[j].trim();
        // Name: 2+ words, starts with capital, not a noise word, not too short
        if (candidate.length > 4 && /^[A-Z]/.test(candidate) && 
            !NOISE_WORDS.some(nw => candidate.toUpperCase().includes(nw)) &&
            !/(PNR|Flight|Depart|Arrive|Gate|Seat|Zone|Boarding|Time)/i.test(candidate) &&
            /^[A-Za-z\s.]+$/.test(candidate)) {
          name = candidate;
          break;
        }
      }
      break;
    }
  }
  // Strategy 2: Look for "Mr/Mrs/Ms" prefix
  if (!name) {
    const mrMatch = text.match(/(?:Mr|Mrs|Ms|MR|MRS|MS)[.\s]+([A-Za-z]+(?:\s+[A-Za-z]+){1,3})/);
    if (mrMatch) name = mrMatch[1].trim();
  }
  // Strategy 3: Near bottom "Airline Copy" section
  if (!name) {
    for (let i = 0; i < lines.length; i++) {
      if (/Airline\s*Copy/i.test(lines[i])) {
        // Name is usually right before or after
        for (let j = Math.max(0, i - 2); j <= Math.min(i + 2, lines.length - 1); j++) {
          const candidate = lines[j].trim();
          if (candidate.length > 4 && /^[A-Z][a-z]+ [A-Z][a-z]+/.test(candidate)) {
            name = candidate;
            break;
          }
        }
        break;
      }
    }
  }

  // --- PNR ---
  let pnr = '';
  const pnrMatch = cleanText.match(/PNR[:\s]+([A-Z0-9]{5,8})/i);
  if (pnrMatch) pnr = pnrMatch[1];

  // --- FLIGHT NUMBER ---
  let flight = '';
  const flightPatterns = [
    /Flight\s*(?:No)?[:\s]+([A-Z0-9]{2}\s*\d{1,4})/i,
    /\b(IX|AI|6E|SG|UK|G8|I5|QP)\s*(\d{1,4})\b/,
  ];
  for (const p of flightPatterns) {
    const m = cleanText.match(p);
    if (m) {
      if (m[2]) flight = m[1] + m[2];
      else flight = m[1].replace(/\s/g, '');
      break;
    }
  }

  // --- AIRLINE ---
  let airline = '';
  if (/Air India Express/i.test(cleanText)) airline = 'Air India Express';
  else if (/Air India/i.test(cleanText)) airline = 'Air India';
  else if (/IndiGo/i.test(cleanText)) airline = 'IndiGo';
  else if (/SpiceJet/i.test(cleanText)) airline = 'SpiceJet';
  else if (/Vistara/i.test(cleanText)) airline = 'Vistara';
  else if (/Akasa/i.test(cleanText)) airline = 'Akasa Air';
  else if (/Go First/i.test(cleanText)) airline = 'Go First';
  // Infer from flight code
  if (!airline && flight) {
    const code = flight.substring(0, 2).toUpperCase();
    const airlineMap = { IX: 'Air India Express', AI: 'Air India', '6E': 'IndiGo', SG: 'SpiceJet', UK: 'Vistara', QP: 'Akasa Air' };
    airline = airlineMap[code] || '';
  }

  // --- AIRPORTS / ROUTE ---
  let from = '', to = '', fromCity = '', toCity = '';
  
  // Look for airport codes in parentheses: Mumbai T-2 (BOM)
  const airportParenMatches = [...text.matchAll(/([A-Za-z][A-Za-z\s\-0-9]+?)\s*\(([A-Z]{3})\)/g)];
  // Filter to only real airport codes
  const validAirports = airportParenMatches.filter(m => m[2] in KNOWN_AIRPORTS || m[2].match(/^[A-Z]{3}$/));
  
  if (validAirports.length >= 2) {
    fromCity = validAirports[0][1].trim();
    from = validAirports[0][2];
    toCity = validAirports[1][1].trim();
    to = validAirports[1][2];
  } else if (validAirports.length === 1) {
    // Check context - is it after "Depart" or "Arrive"?
    const beforeText = text.substring(0, validAirports[0].index);
    if (/Depart/i.test(beforeText.slice(-50))) {
      fromCity = validAirports[0][1].trim();
      from = validAirports[0][2];
    } else {
      toCity = validAirports[0][1].trim();
      to = validAirports[0][2];
    }
  }
  
  // Fallback: look for Depart/Arrive labels followed by city names
  if (!from) {
    const departBlock = text.match(/Depart\s+([A-Za-z\s\-0-9]+?)(?=\n|Boarding|Flight|Arrive)/is);
    if (departBlock) fromCity = departBlock[1].trim();
  }
  if (!to) {
    const arriveBlock = text.match(/Arrive?\s+([A-Za-z\s\-0-9]+?)(?=\n|Departure|Flight|Gate)/is);
    if (arriveBlock) toCity = arriveBlock[1].trim();
  }

  // --- TIMES ---
  let boardingTime = '', departureTime = '';
  
  // Look for "Boarding Time" followed by time on same or next line
  const btMatch = text.match(/Boarding\s*Time\s*[\n\r:]+\s*(\d{1,2}[.:]\d{2})\s*(?:hrs?)?/i);
  if (btMatch) boardingTime = btMatch[1].replace('.', ':');
  
  // Look for "Departure Time" followed by time
  const dtMatch = text.match(/Departure\s*Time\s*[\n\r:]+\s*(\d{1,2}[.:]\d{2})\s*(?:hrs?)?/i);
  if (dtMatch) departureTime = dtMatch[1].replace('.', ':');

  // Fallback: look for HH.MM hrs pattern near boarding/departure keywords
  if (!boardingTime) {
    const btFallback = text.match(/Boarding[\s\S]{0,30}?(\d{1,2}[.:]\d{2})\s*hrs?/i);
    if (btFallback) boardingTime = btFallback[1].replace('.', ':');
  }
  if (!departureTime) {
    const dtFallback = text.match(/Departure[\s\S]{0,30}?(\d{1,2}[.:]\d{2})\s*hrs?/i);
    if (dtFallback) departureTime = dtFallback[1].replace('.', ':');
  }

  // --- DATE ---
  let date = '';
  const dateMatch = cleanText.match(/(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/i);
  if (dateMatch) date = dateMatch[1];

  // --- GATE ---
  let gate = '';
  const gateMatch = text.match(/Gate\s*[\n\r:]+\s*([A-Z0-9]+)/i);
  if (gateMatch && gateMatch[1] !== '-' && !/^\d{2}$/.test(gateMatch[1])) {
    gate = gateMatch[1].trim();
  }
  // More specific: only if it looks like a real gate (letter + number or short code)
  if (!gate) {
    const gateMatch2 = cleanText.match(/Gate[:\s]+([A-Z]\d{1,3}|\d{1,2}[A-Z])/i);
    if (gateMatch2) gate = gateMatch2[1];
  }

  // --- SEAT ---
  let seat = '';
  const seatMatch = text.match(/Seat\s*(?:No)?\s*[\n\r:]+\s*.*?(\d{1,3}[A-F])/i);
  if (seatMatch) seat = seatMatch[1].toUpperCase();
  if (!seat) {
    const seatFallback = cleanText.match(/Seat\s*(?:No)?[:\s]+(\d{1,3}[A-F])/i);
    if (seatFallback) seat = seatFallback[1].toUpperCase();
  }

  // --- ZONE ---
  let zone = '';
  const zoneMatch = cleanText.match(/Zone[:\s]+(\d+)/i);
  if (zoneMatch) zone = zoneMatch[1];

  // --- SEQUENCE ---
  let sequence = '';
  const seqMatch = cleanText.match(/Sequence[:\s]+(\d+)/i);
  if (seqMatch) sequence = seqMatch[1];

  // --- BAGGAGE ---
  let cabinBaggage = '', checkinBaggage = '';
  const cabinMatch = cleanText.match(/Cabin\s*Baggage[:\s]+([\d]+\s*kg[^C]*?)(?=Check|$)/i);
  if (cabinMatch) cabinBaggage = cabinMatch[1].trim();
  const checkinBagMatch = cleanText.match(/Check-?in\s*Baggage[:\s]+([\d]+\s*kg[^A-Z]*)/i);
  if (checkinBagMatch) checkinBaggage = checkinBagMatch[1].trim();

  // --- FARE ---
  let fare = '';
  const fareMatch = cleanText.match(/(?:Selected\s*)?Fare[:\s]*\n?\s*(\w+)/i);
  if (fareMatch && !NOISE_WORDS.includes(fareMatch[1].toUpperCase())) fare = fareMatch[1];

  // --- ADD ONS ---
  let addOns = '';
  const addOnsMatch = cleanText.match(/Add\s*Ons?[:\s]+([A-Z0-9,\s]+?)(?=\s{2,}|Selected|Cabin|$)/i);
  if (addOnsMatch) addOns = addOnsMatch[1].trim();

  return {
    name, pnr, flight, airline,
    from, fromCity, to, toCity,
    gate, seat, zone, sequence,
    boardingTime, departureTime, date,
    cabinBaggage, checkinBaggage, fare, addOns,
    rawText: text,
  };
}

export function isValidBoardingPass(data) {
  const hasRoute = !!(data.from || data.to || data.fromCity || data.toCity);
  const hasIdentifier = !!(data.flight || data.pnr);
  return !!(hasIdentifier || hasRoute || data.name);
}
