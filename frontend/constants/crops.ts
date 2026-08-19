import { farmer } from '@/constants/dummy';
import type { Locale } from '@/constants/i18n';

export type Season = 'Kharif' | 'Rabi' | 'Zaid';
export type Topology = 'plains' | 'plateau' | 'hills' | 'valley' | 'coastal' | 'lowland';
export type WaterNeed = 'low' | 'medium' | 'high';
export type DurationBand = 'short' | 'medium' | 'long';
export type Resilience = 'high' | 'medium' | 'low';
export type MarketDemand = 'high' | 'medium' | 'low';
export type TopologyFit = 'strong' | 'fair' | 'weak';

export type LText = { en: string; hi: string; mr: string };

export const topologies: { value: Topology; label: string; hint: string }[] = [
  { value: 'plains', label: 'Plains', hint: 'Flat open land' },
  { value: 'plateau', label: 'Plateau', hint: 'Deccan / upland, like Nashik' },
  { value: 'hills', label: 'Hills', hint: 'Sloping or terraced land' },
  { value: 'valley', label: 'Valley', hint: 'River basin, deeper soil' },
  { value: 'coastal', label: 'Coastal', hint: 'Near the sea, salt-aware' },
  { value: 'lowland', label: 'Low-lying', hint: 'Flood-prone or waterlogged' },
];

export type CropCandidate = {
  id: string;
  name: LText;
  variety: string;
  seasons: Season[];
  topologies: Topology[];
  adjacentTopologies?: Topology[];
  waterNeed: WaterNeed;
  durationMin: number;
  durationMax: number;
  durationBand: DurationBand;
  perennial?: boolean;
  netIncomePerAcre: number;
  inputCostPerAcre: number;
  mspSupported: boolean;
  marketDemand: MarketDemand;
  mspPrice: number | null;
  mandiPrice: number;
  expectedYieldQPerAcre: number;
  resilience: Resilience;
  pestRisk: LText;
  npk: { n: string; p: string; k: string; ph: string };
  inputs: LText;
  soilMatch: LText;
  why: LText;
  soilAdvisory: LText;
  weatherAdvisory: LText;
  schedule: { when: LText; action: LText }[];
  nashikBonus?: boolean;
};

export type RankedCrop = CropCandidate & {
  score: number;
  topologyFit: TopologyFit;
};

export type CropSort = 'match' | 'profit' | 'input' | 'market';
export type DurationFilter = 'all' | DurationBand;
export type WaterFilter = 'all' | WaterNeed;
export type ClimateFilter = 'all' | 'resilient' | 'drought' | 'flood';

export type CropFilters = {
  sort: CropSort;
  duration: DurationFilter;
  water: WaterFilter;
  climate: ClimateFilter;
  mspOnly: boolean;
  highDemandOnly: boolean;
};

export const defaultFilters: CropFilters = {
  sort: 'match',
  duration: 'all',
  water: 'all',
  climate: 'all',
  mspOnly: false,
  highDemandOnly: false,
};

export function pickText(text: LText, locale: Locale): string {
  return text[locale];
}

export function formatInr(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

export function waterLabel(need: WaterNeed): string {
  if (need === 'low') return 'Low / Rain-fed';
  if (need === 'high') return 'High';
  return 'Medium';
}

export function durationLabel(crop: CropCandidate): string {
  if (crop.perennial) return 'Perennial';
  return `${crop.durationMin}–${crop.durationMax} days`;
}

export function regionalName(crop: CropCandidate, locale?: Locale): string {
  if (locale === 'hi') return crop.name.hi;
  if (locale === 'mr') return crop.name.mr;
  return `${crop.name.hi} · ${crop.name.mr}`;
}

export function priceSecurityLabel(crop: CropCandidate): string {
  if (crop.mspSupported) return 'MSP Supported';
  if (crop.marketDemand === 'high') return 'High Market Demand';
  return 'Open market';
}

export function priceSecurityHint(crop: CropCandidate): string {
  if (crop.mspSupported) return 'Government floor';
  if (crop.marketDemand === 'high') return 'Strong mandi demand';
  return 'Price follows the mandi';
}

export function isDroughtHardy(crop: CropCandidate): boolean {
  return crop.waterNeed === 'low' || crop.resilience === 'high';
}

export function isFloodHardy(crop: CropCandidate): boolean {
  return crop.topologies.includes('lowland') || Boolean(crop.perennial && crop.waterNeed === 'high');
}

export function matchesDuration(crop: CropCandidate, band: DurationFilter): boolean {
  if (band === 'all') return true;
  if (band === 'short') {
    return !crop.perennial && crop.durationMin <= 90 && crop.durationMax >= 60;
  }
  if (band === 'medium') {
    return !crop.perennial && crop.durationMin < 150 && crop.durationMax >= 120;
  }
  return Boolean(crop.perennial) || crop.durationMin >= 150 || crop.durationMax > 150;
}

export function matchesClimate(crop: CropCandidate, climate: ClimateFilter): boolean {
  if (climate === 'all') return true;
  if (climate === 'resilient') return crop.resilience === 'high';
  if (climate === 'drought') return isDroughtHardy(crop);
  return isFloodHardy(crop);
}

export function countActiveFilters(filters: CropFilters): number {
  let count = 0;
  if (filters.duration !== 'all') count += 1;
  if (filters.water !== 'all') count += 1;
  if (filters.climate !== 'all') count += 1;
  if (filters.mspOnly) count += 1;
  if (filters.highDemandOnly) count += 1;
  return count;
}

export function sortSummary(sort: CropSort): string {
  if (sort === 'profit') return 'Sorted by highest expected net income per acre';
  if (sort === 'input') return 'Sorted by lowest starting capital for seed, fertilizer, and labour';
  if (sort === 'market') return 'Sorted by market demand and government MSP support';
  return 'Ranked by soil, climate, and terrain match';
}

export const cropCatalog: CropCandidate[] = [
  {
    id: 'wheat-hd2967',
    name: { en: 'Wheat', hi: 'गेहूँ', mr: 'गहू' },
    variety: 'HD-2967',
    seasons: ['Rabi'],
    topologies: ['plains', 'plateau', 'valley'],
    adjacentTopologies: ['hills'],
    waterNeed: 'medium',
    durationMin: 120,
    durationMax: 140,
    durationBand: 'medium',
    netIncomePerAcre: 28600,
    inputCostPerAcre: 14200,
    mspSupported: true,
    marketDemand: 'high',
    mspPrice: 2425,
    mandiPrice: 2250,
    expectedYieldQPerAcre: 18.4,
    resilience: 'medium',
    nashikBonus: true,
    pestRisk: {
      en: 'Low. Watch for aphids in late January and rust if nights stay wet.',
      hi: 'कम। जनवरी के अंत में माहू और नम रातों में रस्ट पर नज़र रखें।',
      mr: 'कमी. जानेवारी अखेरीस मावा आणि ओल्या रात्री गंज रोगावर लक्ष ठेवा.',
    },
    npk: { n: 'Medium — top-dress urea', p: 'Good match', k: 'Good match', ph: '7.1–7.4 ideal' },
    inputs: {
      en: 'Seed 40 kg/acre, DAP 50 kg, urea 50 kg, 2–3 irrigations.',
      hi: 'बीज 40 किग्रा/एकड़, डीएपी 50 किग्रा, यूरिया 50 किग्रा, 2–3 सिंचाई।',
      mr: 'बी 40 किग्रॅ/एकर, डीएपी 50 किग्रॅ, युरिया 50 किग्रॅ, 2–3 पाणी.',
    },
    soilMatch: {
      en: 'Black cotton soil holds moisture well for wheat on the Deccan plateau.',
      hi: 'काली कपाशी मिट्टी दक्कन पठार पर गेहूँ के लिए नमी अच्छी रखती है।',
      mr: 'काळी कापूस माती दख्खन पठारावर गव्हाला चांगली ओल धरते.',
    },
    why: {
      en: 'Cool Rabi weather, black soil, and a government MSP make HD-2967 a safe staple for this field.',
      hi: 'ठंडी रबी, काली मिट्टी और सरकारी एमएसपी से एचडी-2967 इस खेत के लिए सुरक्षित विकल्प है।',
      mr: 'थंड रब्बी, काळी माती आणि शासकीय एमएसपीमुळे एचडी-2967 या शेतासाठी सुरक्षित पर्याय आहे.',
    },
    soilAdvisory: {
      en: 'Nutrients are balanced. Apply a light nitrogen dose at crown-root initiation.',
      hi: 'पोषक संतुलित हैं। क्राउन रूट चरण पर हल्की नाइट्रोजन दें।',
      mr: 'अन्नद्रव्ये संतुलित आहेत. क्राउन रूट टप्प्यावर हलके नत्र द्या.',
    },
    weatherAdvisory: {
      en: 'A short dry spell is due mid-week. One light irrigation will protect grain fill.',
      hi: 'सप्ताह के मध्य में हल्की सूखा अवधि है। एक हल्की सिंचाई दाना भरने की रक्षा करेगी।',
      mr: 'आठवड्याच्या मध्यात कोरडा काळ अपेक्षित. एक हलके पाणी दाणे भरण्यास मदत करेल.',
    },
    schedule: [
      {
        when: { en: 'Day 0–7', hi: 'दिन 0–7', mr: 'दिवस 0–7' },
        action: {
          en: 'Seed treatment and sowing in residual moisture.',
          hi: 'बीज उपचार और अवशिष्ट नमी में बुवाई।',
          mr: 'बीज प्रक्रिया आणि शिल्लक ओलीत पेरणी.',
        },
      },
      {
        when: { en: 'Day 20–25', hi: 'दिन 20–25', mr: 'दिवस 20–25' },
        action: {
          en: 'First irrigation and urea top-dress.',
          hi: 'पहली सिंचाई और यूरिया टॉप ड्रेस।',
          mr: 'पहिली पाणीपाळी आणि युरिया टॉप ड्रेस.',
        },
      },
      {
        when: { en: 'Day 55–65', hi: 'दिन 55–65', mr: 'दिवस 55–65' },
        action: {
          en: 'Weed control and ear-head irrigation.',
          hi: 'निराई और बाली सिंचाई।',
          mr: 'निंदणी आणि कणसात पाणी.',
        },
      },
      {
        when: { en: 'Day 120–135', hi: 'दिन 120–135', mr: 'दिवस 120–135' },
        action: {
          en: 'Harvest when grain is hard and straw turns gold.',
          hi: 'दाना सख्त और पुआल सुनहरा होने पर कटाई।',
          mr: 'दाणे कडक आणि काड सोनेरी झाल्यावर काढणी.',
        },
      },
    ],
  },
  {
    id: 'onion-alr',
    name: { en: 'Onion', hi: 'प्याज़', mr: 'कांदा' },
    variety: 'Agrifound Light Red',
    seasons: ['Rabi'],
    topologies: ['plains', 'plateau'],
    adjacentTopologies: ['valley'],
    waterNeed: 'medium',
    durationMin: 120,
    durationMax: 150,
    durationBand: 'medium',
    netIncomePerAcre: 72000,
    inputCostPerAcre: 28500,
    mspSupported: false,
    marketDemand: 'high',
    mspPrice: null,
    mandiPrice: 1800,
    expectedYieldQPerAcre: 95,
    resilience: 'medium',
    nashikBonus: true,
    pestRisk: {
      en: 'Medium. Thrips and purple blotch rise if humidity stays high after irrigation.',
      hi: 'मध्यम। सिंचाई के बाद नमी रहने पर थ्रिप्स और पर्पल ब्लॉच बढ़ सकते हैं।',
      mr: 'मध्यम. पाण्यानंतर आर्द्रता राहिल्यास थ्रिप्स व पर्पल ब्लॉच वाढतात.',
    },
    npk: { n: 'Split doses', p: 'Basal DAP needed', k: 'Add SOP at bulb swell', ph: '6.5–7.5' },
    inputs: {
      en: 'Seedlings 8–10 kg seed/acre, FYM, drip preferred, 2 sprays for thrips.',
      hi: 'पौध 8–10 किग्रा बीज/एकड़, गोबर खाद, ड्रिप बेहतर, थ्रिप्स के 2 छिड़काव।',
      mr: 'रोपे 8–10 किग्रॅ बी/एकर, शेणखत, ठिबक चांगले, थ्रिप्ससाठी 2 फवारण्या.',
    },
    soilMatch: {
      en: 'Nashik black soil and elevation are a classic match for Light Red onion.',
      hi: 'नासिक की काली मिट्टी और ऊँचाई लाइट रेड प्याज़ के लिए सिद्ध मेल है।',
      mr: 'नाशिकची काळी माती आणि उंची लाईट रेड कांद्यासाठी सिद्ध जुळणी आहे.',
    },
    why: {
      en: 'Highest likely net income here, with strong Lasalgaon mandi demand. Price is volatile — no MSP floor.',
      hi: 'यहाँ सबसे अधिक संभावित शुद्ध आय, लासलगांव मंडी की मांग मजबूत। भाव अस्थिर — एमएसपी नहीं।',
      mr: 'येथे सर्वाधिक संभाव्य निव्वळ उत्पन्न, लासलगाव बाजाराची मागणी जोरदार. भाव अस्थिर — एमएसपी नाही.',
    },
    soilAdvisory: {
      en: 'Keep beds raised. Avoid waterlogging around the bulb neck.',
      hi: 'क्यारियाँ ऊँची रखें। गाँठ के पास जलभराव न होने दें।',
      mr: 'वाफे उंच ठेवा. कांद्याच्या मानेजवळ पाणी साचू देऊ नका.',
    },
    weatherAdvisory: {
      en: 'Unseasonal rain near harvest can stain bulbs. Keep a drying plan ready.',
      hi: 'कटाई के पास बेमौसम बारिश से गाँठें दागदार हो सकती हैं। सुखाने की योजना रखें।',
      mr: 'काढणीजवळ बेमोसमी पावसाने कांदे डागाळू शकतात. सुकवण्याची तयारी ठेवा.',
    },
    schedule: [
      {
        when: { en: 'Day 0–10', hi: 'दिन 0–10', mr: 'दिवस 0–10' },
        action: {
          en: 'Transplant on ridges with drip lines.',
          hi: 'मेड़ों पर ड्रिप के साथ रोपाई।',
          mr: 'गादीवाफ्यावर ठिबकसह लावणी.',
        },
      },
      {
        when: { en: 'Day 30–40', hi: 'दिन 30–40', mr: 'दिवस 30–40' },
        action: {
          en: 'Weeding and first thrips spray if needed.',
          hi: 'निराई और आवश्यकता पर पहला थ्रिप्स छिड़काव।',
          mr: 'निंदणी आणि गरज असल्यास पहिली थ्रिप्स फवारणी.',
        },
      },
      {
        when: { en: 'Day 70–90', hi: 'दिन 70–90', mr: 'दिवस 70–90' },
        action: {
          en: 'Potash at bulb development and steady moisture.',
          hi: 'गाँठ बनते समय पोटाश और स्थिर नमी।',
          mr: 'कांदा फुगताना पालाश आणि स्थिर ओल.',
        },
      },
      {
        when: { en: 'Day 130–150', hi: 'दिन 130–150', mr: 'दिवस 130–150' },
        action: {
          en: 'Stop irrigation, neck-fall, then harvest and cure.',
          hi: 'सिंचाई बंद करें, गर्दन गिरने पर खुदाई और क्योरिंग।',
          mr: 'पाणी बंद करा, मान पडली की काढणी व क्युरिंग.',
        },
      },
    ],
  },
  {
    id: 'gram-vijay',
    name: { en: 'Gram (Chana)', hi: 'चना', mr: 'हरभरा' },
    variety: 'Vijay',
    seasons: ['Rabi'],
    topologies: ['plains', 'plateau', 'hills'],
    adjacentTopologies: ['valley'],
    waterNeed: 'low',
    durationMin: 110,
    durationMax: 130,
    durationBand: 'medium',
    netIncomePerAcre: 31800,
    inputCostPerAcre: 9800,
    mspSupported: true,
    marketDemand: 'high',
    mspPrice: 5650,
    mandiPrice: 5400,
    expectedYieldQPerAcre: 8.2,
    resilience: 'high',
    pestRisk: {
      en: 'Low–medium. Pod borer is the main watch; dry spells actually help this crop.',
      hi: 'कम–मध्यम। फली छेदक मुख्य खतरा; सूखा इस फसल को नुकसान कम करता है।',
      mr: 'कमी–मध्यम. शेंगा पोखरणारा मुख्य धोका; कोरडा काळ या पिकाला अनुकूल.',
    },
    npk: { n: 'Low — crop fixes nitrogen', p: 'Needs DAP at sowing', k: 'Adequate', ph: '6.5–8.0' },
    inputs: {
      en: 'Seed 30 kg/acre, Rhizobium culture, one protective spray if pod borer appears.',
      hi: 'बीज 30 किग्रा/एकड़, राइजोबियम कल्चर, फली छेदक दिखे तो एक छिड़काव।',
      mr: 'बी 30 किग्रॅ/एकर, रायझोबियम कल्चर, शेंगा पोखरणारा दिसल्यास एक फवारणी.',
    },
    soilMatch: {
      en: 'Works on residual moisture in black soil. Strong pH match for this farm.',
      hi: 'काली मिट्टी की बची नमी पर अच्छा चलता है। इस खेत की पीएच से मेल खाता है।',
      mr: 'काळ्या मातीतील शिल्लक ओलीवर चांगले येते. या शेताच्या पीएचशी जुळते.',
    },
    why: {
      en: 'MSP-backed pulse with low water and low starting capital. High resilience to dry spells.',
      hi: 'एमएसपी युक्त दलहन, कम पानी और कम लागत। सूखे के प्रति अधिक सहनशील।',
      mr: 'एमएसपी असलेले कडधान्य, कमी पाणी व कमी खर्च. कोरड्या काळाला सहनशील.',
    },
    soilAdvisory: {
      en: 'Do not over-irrigate. One flowering irrigation is enough on this soil.',
      hi: 'अधिक सिंचाई न करें। इस मिट्टी पर फूल आने पर एक सिंचाई काफी है।',
      mr: 'जास्त पाणी देऊ नका. या मातीत फुलोऱ्यात एक पाणी पुरेसे.',
    },
    weatherAdvisory: {
      en: 'Unseasonal rain at harvest can spoil grain colour. Keep threshing ready.',
      hi: 'कटाई पर बेमौसम बारिश दाने का रंग खराब कर सकती है। मड़ाई तैयार रखें।',
      mr: 'काढणीवेळी बेमोसमी पाऊस दाण्याचा रंग खराब करू शकतो. मळणी तयार ठेवा.',
    },
    schedule: [
      {
        when: { en: 'Day 0–5', hi: 'दिन 0–5', mr: 'दिवस 0–5' },
        action: {
          en: 'Sow with Rhizobium-treated seed.',
          hi: 'राइजोबियम उपचारित बीज से बुवाई।',
          mr: 'रायझोबियम प्रक्रिया केलेल्या बियाणे पेरा.',
        },
      },
      {
        when: { en: 'Day 40–50', hi: 'दिन 40–50', mr: 'दिवस 40–50' },
        action: {
          en: 'One irrigation at flowering if soil is dry.',
          hi: 'मिट्टी सूखी हो तो फूल पर एक सिंचाई।',
          mr: 'माती कोरडी असेल तर फुलोऱ्यात एक पाणी.',
        },
      },
      {
        when: { en: 'Day 110–125', hi: 'दिन 110–125', mr: 'दिवस 110–125' },
        action: {
          en: 'Harvest when pods turn brown and rattle.',
          hi: 'फलियाँ भूरी हों और खनखनाएँ तब कटाई।',
          mr: 'शेंगा तपकिरी होऊन खणखणल्या की काढणी.',
        },
      },
    ],
  },
  {
    id: 'mustard-nrchb101',
    name: { en: 'Mustard', hi: 'सरसों', mr: 'मोहरी' },
    variety: 'NRCHB-101',
    seasons: ['Rabi'],
    topologies: ['plains', 'plateau'],
    adjacentTopologies: ['hills', 'valley'],
    waterNeed: 'low',
    durationMin: 90,
    durationMax: 120,
    durationBand: 'medium',
    netIncomePerAcre: 26400,
    inputCostPerAcre: 8700,
    mspSupported: true,
    marketDemand: 'high',
    mspPrice: 5950,
    mandiPrice: 5800,
    expectedYieldQPerAcre: 7.4,
    resilience: 'high',
    pestRisk: {
      en: 'Medium. Aphids build if January stays warm and still.',
      hi: 'मध्यम। जनवरी गर्म और शांत रहे तो माहू बढ़ते हैं।',
      mr: 'मध्यम. जानेवारी उबदार व शांत राहिल्यास मावा वाढतो.',
    },
    npk: { n: 'Split N', p: 'Basal P required', k: 'Low need', ph: '6.5–7.5' },
    inputs: {
      en: 'Seed 2 kg/acre, sulphur 8 kg, one aphid spray if colonies appear.',
      hi: 'बीज 2 किग्रा/एकड़, गंधक 8 किग्रा, माहू दिखे तो एक छिड़काव।',
      mr: 'बी 2 किग्रॅ/एकर, गंधक 8 किग्रॅ, मावा दिसल्यास एक फवारणी.',
    },
    soilMatch: {
      en: 'Low water need fits plateau fields that dry quickly after winter showers.',
      hi: 'कम पानी की जरूरत पठारी खेतों से मेल खाती है जो सर्दियों की बारिश के बाद जल्दी सूखते हैं।',
      mr: 'कमी पाण्याची गरज पठारी शेतांना मानवते, हिवाळी पावसानंतर ते लवकर कोरडे होतात.',
    },
    why: {
      en: 'Oilseed with MSP support, short-to-medium duration, and low input cash.',
      hi: 'एमएसपी युक्त तिलहन, मध्यम अवधि, कम लागत।',
      mr: 'एमएसपी असलेले तेलबिया पीक, मध्यम कालावधी, कमी खर्च.',
    },
    soilAdvisory: {
      en: 'Add sulphur. Mustard yellows if sulphur is short on this black soil.',
      hi: 'गंधक डालें। इस काली मिट्टी में गंधक कम हो तो सरसों पीली पड़ती है।',
      mr: 'गंधक द्या. या काळ्या मातीत गंधक कमी तर मोहरी पिवळी पडते.',
    },
    weatherAdvisory: {
      en: 'Frost is unlikely in Nashik. Watch warm January nights for aphids.',
      hi: 'नासिक में पाला कम होता है। जनवरी की गर्म रातों पर माहू देखें।',
      mr: 'नाशिकमध्ये दंव दुर्मिळ. उबदार जानेवारी रात्री माव्यावर लक्ष ठेवा.',
    },
    schedule: [
      {
        when: { en: 'Day 0–4', hi: 'दिन 0–4', mr: 'दिवस 0–4' },
        action: {
          en: 'Line sowing with sulphur in the basal mix.',
          hi: 'कतार बुवाई, बेसल में गंधक मिलाएँ।',
          mr: 'ओळीने पेरणी, बेसलमध्ये गंधक मिसळा.',
        },
      },
      {
        when: { en: 'Day 30–40', hi: 'दिन 30–40', mr: 'दिवस 30–40' },
        action: {
          en: 'Thin plants and scout for aphids.',
          hi: 'पौधे छँटाएँ और माहू देखें।',
          mr: 'रोपे विरळ करा आणि मावा तपासा.',
        },
      },
      {
        when: { en: 'Day 100–115', hi: 'दिन 100–115', mr: 'दिवस 100–115' },
        action: {
          en: 'Harvest when 75% pods turn yellow.',
          hi: '75% फलियाँ पीली होने पर कटाई।',
          mr: '७५% शेंगा पिवळ्या झाल्या की काढणी.',
        },
      },
    ],
  },
  {
    id: 'jowar-csv22',
    name: { en: 'Jowar (Sorghum)', hi: 'ज्वार', mr: 'ज्वारी' },
    variety: 'CSV-22',
    seasons: ['Rabi', 'Kharif'],
    topologies: ['plains', 'plateau', 'hills'],
    adjacentTopologies: ['valley'],
    waterNeed: 'low',
    durationMin: 110,
    durationMax: 130,
    durationBand: 'medium',
    netIncomePerAcre: 18600,
    inputCostPerAcre: 7200,
    mspSupported: true,
    marketDemand: 'medium',
    mspPrice: 3490,
    mandiPrice: 3100,
    expectedYieldQPerAcre: 10.5,
    resilience: 'high',
    pestRisk: {
      en: 'Low. Shoot fly in early growth if sowing is late; otherwise hardy.',
      hi: 'कम। देर से बुवाई पर शूट फ्लाई; वरना फसल मजबूत है।',
      mr: 'कमी. उशिरा पेरणीत शूट फ्लाय; अन्यथा पीक कणखर.',
    },
    npk: { n: 'Low–medium', p: 'Basal only', k: 'Low', ph: '6.5–8.5' },
    inputs: {
      en: 'Seed 6 kg/acre, limited fertilizer, often rain-fed on rabi residual moisture.',
      hi: 'बीज 6 किग्रा/एकड़, सीमित खाद, अक्सर रबी अवशिष्ट नमी पर बारिश-निर्भर।',
      mr: 'बी 6 किग्रॅ/एकर, मर्यादित खत, अनेकदा रब्बी शिल्लक ओलीवर पावसाधार.',
    },
    soilMatch: {
      en: 'Built for Deccan plateau and sloping land that cannot hold a thirsty crop.',
      hi: 'दक्कन पठार और ढलान के लिए बनी फसल, जहाँ प्यासी फसल नहीं टिकती।',
      mr: 'दख्खन पठार व उतारासाठी बनलेले पीक, जिथे जास्त पाण्याची गरज भागत नाही.',
    },
    why: {
      en: 'Climate-resilient millet with MSP, low water, and the lowest starting capital in this list.',
      hi: 'जलवायु-सहिष्णु मोटा अनाज, एमएसपी, कम पानी, इस सूची में सबसे कम लागत।',
      mr: 'हवामान-सहनशील तृणधान्य, एमएसपी, कमी पाणी, या यादीत सर्वात कमी खर्च.',
    },
    soilAdvisory: {
      en: 'Avoid heavy nitrogen. It causes lodging on this black soil.',
      hi: 'अधिक नाइट्रोजन न दें। इस काली मिट्टी पर फसल गिर सकती है।',
      mr: 'जास्त नत्र देऊ नका. या काळ्या मातीत पीक लोळू शकते.',
    },
    weatherAdvisory: {
      en: 'Handles dry spells well. Only irrigate if leaves roll tightly at noon.',
      hi: 'सूखा सह लेती है। दोपहर को पत्ते कसकर मुड़ें तभी सिंचाई करें।',
      mr: 'कोरडा काळ चांगला सहन करते. दुपारी पाने घट्ट गुंडाळली तरच पाणी द्या.',
    },
    schedule: [
      {
        when: { en: 'Day 0–6', hi: 'दिन 0–6', mr: 'दिवस 0–6' },
        action: {
          en: 'Sow on residual moisture; treat seed against shoot fly.',
          hi: 'अवशिष्ट नमी में बुवाई; शूट फ्लाई से बीज उपचार।',
          mr: 'शिल्लक ओलीत पेरणी; शूट फ्लायपासून बीज प्रक्रिया.',
        },
      },
      {
        when: { en: 'Day 110–125', hi: 'दिन 110–125', mr: 'दिवस 110–125' },
        action: {
          en: 'Harvest grain and store fodder separately.',
          hi: 'दाना काटें और चारा अलग रखें।',
          mr: 'दाणे काढा आणि चारा वेगळा साठवा.',
        },
      },
    ],
  },
  {
    id: 'soybean-js335',
    name: { en: 'Soybean', hi: 'सोयाबीन', mr: 'सोयाबीन' },
    variety: 'JS-335',
    seasons: ['Kharif'],
    topologies: ['plains', 'plateau'],
    adjacentTopologies: ['valley', 'hills'],
    waterNeed: 'medium',
    durationMin: 90,
    durationMax: 110,
    durationBand: 'medium',
    netIncomePerAcre: 24200,
    inputCostPerAcre: 12800,
    mspSupported: true,
    marketDemand: 'high',
    mspPrice: 4892,
    mandiPrice: 4600,
    expectedYieldQPerAcre: 9.6,
    resilience: 'medium',
    pestRisk: {
      en: 'Medium. Spodoptera and yellow mosaic if monsoon is wet and stagnant.',
      hi: 'मध्यम। गीले ठहरे मानसून में स्पोडोप्टेरा और येलो मोज़ेक।',
      mr: 'मध्यम. ओल्या थांबलेल्या पावसात स्पोडोप्टेरा व यलो मोझॅक.',
    },
    npk: { n: 'Starter only', p: 'Critical at sowing', k: 'Medium', ph: '6.5–7.5' },
    inputs: {
      en: 'Seed 30 kg/acre, Rhizobium + PSB, one insecticide if defoliators appear.',
      hi: 'बीज 30 किग्रा/एकड़, राइजोबियम + पीएसबी, पत्ती काटने वाले कीट हों तो दवा।',
      mr: 'बी 30 किग्रॅ/एकर, रायझोबियम + पीएसबी, पाने खाणारे कीड दिसल्यास औषध.',
    },
    soilMatch: {
      en: 'Black soil of the plateau is a standard soybean belt match.',
      hi: 'पठार की काली मिट्टी सोयाबीन पट्टी से मेल खाती है।',
      mr: 'पठाराची काळी माती सोयाबीन पट्ट्याशी जुळते.',
    },
    why: {
      en: 'Main Kharif cash pulse-oilseed with MSP and a short field occupancy.',
      hi: 'खरीफ की मुख्य नकदी फसल, एमएसपी और खेत कम दिनों तक घेरती है।',
      mr: 'खरीपातील मुख्य रोख पीक, एमएसपी आणि शेत कमी दिवस व्यापते.',
    },
    soilAdvisory: {
      en: 'Ensure drainage. Soybean hates standing water after heavy rain.',
      hi: 'निकास सुनिश्चित करें। तेज बारिश के बाद खड़ा पानी सोयाबीन को नुकसान करता है।',
      mr: 'निचरा सुनिश्चित करा. मुसळधार पावसानंतर साचलेले पाणी सोयाबीनला नुकसान करते.',
    },
    weatherAdvisory: {
      en: 'A break in monsoon at flowering reduces pods. Keep a life-saving irrigation ready.',
      hi: 'फूल आने पर मानसून रुकने से फलियाँ कम होती हैं। जीवन रक्षक सिंचाई तैयार रखें।',
      mr: 'फुलोऱ्यात पाऊस खंडित झाल्यास शेंगा कमी होतात. जीवनरक्षक पाणी तयार ठेवा.',
    },
    schedule: [
      {
        when: { en: 'Onset of monsoon', hi: 'मानसून शुरू होते ही', mr: 'पाऊस सुरू होताच' },
        action: {
          en: 'Sow treated seed on a well-drained bed.',
          hi: 'उपचारित बीज अच्छे निकास वाली क्यारी में बोएँ।',
          mr: 'प्रक्रिया केलेले बी चांगल्या निचऱ्याच्या वाफ्यात पेरा.',
        },
      },
      {
        when: { en: 'Day 90–105', hi: 'दिन 90–105', mr: 'दिवस 90–105' },
        action: {
          en: 'Harvest at 15% grain moisture to avoid shatter.',
          hi: '15% नमी पर कटाई ताकि दाने न झड़ें।',
          mr: '१५% ओलीवर काढणी करा म्हणजे दाणे गळणार नाहीत.',
        },
      },
    ],
  },
  {
    id: 'cotton-nh615',
    name: { en: 'Cotton', hi: 'कपास', mr: 'कापूस' },
    variety: 'NH-615',
    seasons: ['Kharif'],
    topologies: ['plains', 'plateau'],
    adjacentTopologies: ['valley'],
    waterNeed: 'high',
    durationMin: 150,
    durationMax: 180,
    durationBand: 'long',
    netIncomePerAcre: 41200,
    inputCostPerAcre: 26400,
    mspSupported: true,
    marketDemand: 'high',
    mspPrice: 7710,
    mandiPrice: 7200,
    expectedYieldQPerAcre: 8.8,
    resilience: 'low',
    pestRisk: {
      en: 'High. Pink bollworm and sucking pests need a weekly scouting habit.',
      hi: 'उच्च। गुलाबी सुंडी और चूसक कीटों के लिए साप्ताहिक निगरानी जरूरी।',
      mr: 'उच्च. गुलाबी बोंडअळी व रसशोषक किडींसाठी साप्ताहिक तपासणी आवश्यक.',
    },
    npk: { n: 'Split 3 times', p: 'Basal', k: 'At flowering', ph: '6.5–8.0' },
    inputs: {
      en: 'Seed 1.2 kg/acre, heavy fertilizer and 4–6 sprays. Highest cash outlay.',
      hi: 'बीज 1.2 किग्रा/एकड़, अधिक खाद और 4–6 छिड़काव। सबसे अधिक लागत।',
      mr: 'बी 1.2 किग्रॅ/एकर, जास्त खत व 4–6 फवारण्या. सर्वाधिक खर्च.',
    },
    soilMatch: {
      en: 'Deep black cotton soil is named for this crop — but only if irrigation is reliable.',
      hi: 'गहरी काली कपाशी मिट्टी इसी फसल के लिए प्रसिद्ध है — सिंचाई पक्की हो तो।',
      mr: 'खोल काळी कापूस माती या पिकासाठी प्रसिद्ध — पाणी खात्रीचे असेल तर.',
    },
    why: {
      en: 'High profit and MSP, but long duration, high water, and high pest pressure.',
      hi: 'अधिक लाभ और एमएसपी, पर लंबी अवधि, अधिक पानी और कीट दबाव।',
      mr: 'जास्त नफा व एमएसपी, पण दीर्घ काळ, जास्त पाणी आणि कीड दबाव.',
    },
    soilAdvisory: {
      en: 'Deep cracks in summer are normal. Fill moisture before square formation.',
      hi: 'गर्मी में गहरी दरारें सामान्य हैं। फूल-कली से पहले नमी भरें।',
      mr: 'उन्हाळ्यात खोल भेगा सामान्य. कळी येण्यापूर्वी ओल भरा.',
    },
    weatherAdvisory: {
      en: 'Extended dry spells at flowering cut boll set. Not a rain-fed first choice.',
      hi: 'फूल पर लंबा सूखा फलियाँ घटाता है। बारिश-निर्भर पहली पसंद नहीं।',
      mr: 'फुलोऱ्यात दीर्घ कोरडा काळ बोंडे कमी करतो. पावसाधार पहिली निवड नाही.',
    },
    schedule: [
      {
        when: { en: 'June sowing', hi: 'जून बुवाई', mr: 'जून पेरणी' },
        action: {
          en: 'Sow after a soaking rain; gap-fill in 10 days.',
          hi: 'भीगोने वाली बारिश के बाद बुवाई; 10 दिन में खाली जगह भरें।',
          mr: 'भिजवणाऱ्या पावसानंतर पेरणी; १० दिवसांत रिकामी जागा भरा.',
        },
      },
      {
        when: { en: 'Day 150–180', hi: 'दिन 150–180', mr: 'दिवस 150–180' },
        action: {
          en: 'Pick in 2–3 flushes; keep kapas dry.',
          hi: '2–3 बार चुनाई; कपास सूखी रखें।',
          mr: '२–३ वेळा वेचणी; कापूस कोरडा ठेवा.',
        },
      },
    ],
  },
  {
    id: 'tur-bdn711',
    name: { en: 'Tur (Arhar)', hi: 'तूर / अरहर', mr: 'तूर' },
    variety: 'BDN-711',
    seasons: ['Kharif'],
    topologies: ['plains', 'plateau', 'hills'],
    adjacentTopologies: ['valley'],
    waterNeed: 'medium',
    durationMin: 150,
    durationMax: 170,
    durationBand: 'long',
    netIncomePerAcre: 33600,
    inputCostPerAcre: 11200,
    mspSupported: true,
    marketDemand: 'high',
    mspPrice: 8000,
    mandiPrice: 7600,
    expectedYieldQPerAcre: 7.1,
    resilience: 'high',
    pestRisk: {
      en: 'Medium. Pod borer at flowering is the one pest that can erase profit.',
      hi: 'मध्यम। फूल पर फली छेदक लाभ खत्म कर सकता है।',
      mr: 'मध्यम. फुलोऱ्यातील शेंगा पोखरणारा नफा संपवू शकतो.',
    },
    npk: { n: 'Starter', p: 'Important', k: 'Low', ph: '6.5–8.0' },
    inputs: {
      en: 'Seed 5 kg/acre, intercrop friendly, 1–2 pod-borer sprays.',
      hi: 'बीज 5 किग्रा/एकड़, अंतर-फसल अनुकूल, 1–2 फली छेदक छिड़काव।',
      mr: 'बी 5 किग्रॅ/एकर, आंतरपीक अनुकूल, 1–2 शेंगा पोखरणारा फवारणी.',
    },
    soilMatch: {
      en: 'Deep roots tap plateau moisture. Good fit for slightly sloping fields.',
      hi: 'गहरी जड़ें पठार की नमी लेती हैं। हल्की ढलान वाले खेत के लिए अच्छा।',
      mr: 'खोल मुळे पठारातील ओल घेतात. हलका उतार असलेल्या शेतासाठी चांगले.',
    },
    why: {
      en: 'Strong MSP pulse that handles dry spells better than cotton or sugarcane.',
      hi: 'मजबूत एमएसपी दलहन, कपास या गन्ने से बेहतर सूखा सहती है।',
      mr: 'मजबूत एमएसपी कडधान्य, कापूस किंवा ऊसापेक्षा कोरडा काळ चांगला सहन करते.',
    },
    soilAdvisory: {
      en: 'Do not waterlog young plants. Ridges help on heavier patches.',
      hi: 'नन्हे पौधों में जलभराव न करें। भारी मिट्टी पर मेड़ मदद करती है।',
      mr: 'लहान रोपांत पाणी साचू देऊ नका. भारी मातीत वरंबा मदत करतो.',
    },
    weatherAdvisory: {
      en: 'A dry September is tolerable. Wet, cloudy flowering invites pod borer.',
      hi: 'सूखा सितंबर सहनीय है। गीला, बादलों वाला फूल फली छेदक लाता है।',
      mr: 'कोरडा सप्टेंबर चालतो. ओला, ढगाळ फुलोरा शेंगा पोखरणारा आणतो.',
    },
    schedule: [
      {
        when: { en: 'June–July', hi: 'जून–जुलाई', mr: 'जून–जुलै' },
        action: {
          en: 'Sow on ridges; consider soybean intercrop.',
          hi: 'मेड़ पर बुवाई; सोयाबीन अंतर-फसल सोचें।',
          mr: 'वरंब्यावर पेरणी; सोयाबीन आंतरपीक विचारा.',
        },
      },
      {
        when: { en: 'Day 150–170', hi: 'दिन 150–170', mr: 'दिवस 150–170' },
        action: {
          en: 'Pick when 80% pods are dry and rattle.',
          hi: '80% फलियाँ सूखी और खनखनाएँ तब चुनाई।',
          mr: '८०% शेंगा कोरड्या व खणखणल्या की वेचणी.',
        },
      },
    ],
  },
  {
    id: 'bajra-ictp8203',
    name: { en: 'Bajra (Pearl millet)', hi: 'बाजरा', mr: 'बाजरी' },
    variety: 'ICTP-8203',
    seasons: ['Kharif', 'Zaid'],
    topologies: ['hills', 'plateau', 'plains'],
    adjacentTopologies: ['coastal'],
    waterNeed: 'low',
    durationMin: 70,
    durationMax: 90,
    durationBand: 'short',
    netIncomePerAcre: 15400,
    inputCostPerAcre: 6100,
    mspSupported: true,
    marketDemand: 'medium',
    mspPrice: 2775,
    mandiPrice: 2500,
    expectedYieldQPerAcre: 9.2,
    resilience: 'high',
    pestRisk: {
      en: 'Low. Downy mildew only if nights stay very humid after showers.',
      hi: 'कम। बौछार के बाद बहुत नम रातें हों तो डाउनी मिल्ड्यू।',
      mr: 'कमी. पावसानंतर रात्री खूप आर्द्र राहिल्यास डाउनी मिल्ड्यू.',
    },
    npk: { n: 'Low', p: 'Low–medium', k: 'Low', ph: '7.0–8.5' },
    inputs: {
      en: 'Seed 1.5 kg/acre, little fertilizer, typically rain-fed.',
      hi: 'बीज 1.5 किग्रा/एकड़, कम खाद, आमतौर पर बारिश पर।',
      mr: 'बी 1.5 किग्रॅ/एकर, कमी खत, सामान्यतः पावसावर.',
    },
    soilMatch: {
      en: 'Best match for hills and light soils that dry fast.',
      hi: 'पहाड़ियों और जल्दी सूखने वाली हल्की मिट्टी के लिए सबसे अच्छा मेल।',
      mr: 'डोंगर व लवकर कोरडी होणारी हलकी माती यासाठी सर्वोत्तम जुळणी.',
    },
    why: {
      en: 'Short 70–90 day crop, rain-fed, high resilience to heat and dry spells.',
      hi: '70–90 दिन की छोटी फसल, बारिश-निर्भर, गर्मी और सूखे के प्रति सहिष्णु।',
      mr: '७०–९० दिवसांचे छोटे पीक, पावसाधार, उष्णता व कोरड्या काळाला सहनशील.',
    },
    soilAdvisory: {
      en: 'Do not overwater. Bajra lodges and gets diseased in standing water.',
      hi: 'अधिक पानी न दें। खड़े पानी में बाजरा गिरता और बीमार होता है।',
      mr: 'जास्त पाणी देऊ नका. साचलेल्या पाण्यात बाजरी लोळते व आजारी पडते.',
    },
    weatherAdvisory: {
      en: 'Built for dry spells and heat. A good choice if the monsoon is delayed.',
      hi: 'सूखे और गर्मी के लिए बनी फसल। मानसून देर हो तो अच्छा विकल्प।',
      mr: 'कोरडा काळ व उष्णतेसाठी बनलेले पीक. पाऊस उशिरा तर चांगला पर्याय.',
    },
    schedule: [
      {
        when: { en: 'Day 0–5', hi: 'दिन 0–5', mr: 'दिवस 0–5' },
        action: {
          en: 'Sow after a shower; keep a wider row on slopes.',
          hi: 'बौछार के बाद बुवाई; ढलान पर कतार चौड़ी रखें।',
          mr: 'पावसानंतर पेरणी; उतारावर ओळ रुंद ठेवा.',
        },
      },
      {
        when: { en: 'Day 70–90', hi: 'दिन 70–90', mr: 'दिवस 70–90' },
        action: {
          en: 'Harvest ears when grains are hard.',
          hi: 'दाने सख्त होने पर बालियाँ काटें।',
          mr: 'दाणे कडक झाल्यावर कणसे कापा.',
        },
      },
    ],
  },
  {
    id: 'maize-african',
    name: { en: 'Maize', hi: 'मक्का', mr: 'मका' },
    variety: 'African Tall',
    seasons: ['Kharif', 'Zaid'],
    topologies: ['plains', 'valley'],
    adjacentTopologies: ['plateau'],
    waterNeed: 'medium',
    durationMin: 85,
    durationMax: 110,
    durationBand: 'short',
    netIncomePerAcre: 22800,
    inputCostPerAcre: 13500,
    mspSupported: true,
    marketDemand: 'high',
    mspPrice: 2400,
    mandiPrice: 2200,
    expectedYieldQPerAcre: 18,
    resilience: 'medium',
    pestRisk: {
      en: 'Medium. Fall armyworm needs early scouting in the funnel.',
      hi: 'मध्यम। फॉल आर्मीवर्म के लिए कीप में जल्दी निगरानी जरूरी।',
      mr: 'मध्यम. फॉल आर्मीवर्मसाठी पानाच्या जात्यात लवकर तपासणी.',
    },
    npk: { n: 'High — split', p: 'Basal', k: 'At tasseling', ph: '6.0–7.5' },
    inputs: {
      en: 'Seed 8 kg/acre, urea in 3 splits, one armyworm spray if found.',
      hi: 'बीज 8 किग्रा/एकड़, यूरिया 3 बार, आर्मीवर्म मिले तो छिड़काव।',
      mr: 'बी 8 किग्रॅ/एकर, युरिया 3 वेळा, आर्मीवर्म दिसल्यास फवारणी.',
    },
    soilMatch: {
      en: 'Prefers deeper valley or plain soils over thin hill tops.',
      hi: 'पतली पहाड़ी चोटी से अधिक गहरी घाटी या मैदानी मिट्टी पसंद करती है।',
      mr: 'पातळ डोंगरमाथ्यापेक्षा खोल दरी किंवा मैदानी माती पसंत करते.',
    },
    why: {
      en: 'Short occupancy with MSP and fodder value. Needs reliable mid-season water.',
      hi: 'कम अवधि, एमएसपी और चारा मूल्य। बीच सीजन में पक्का पानी चाहिए।',
      mr: 'कमी कालावधी, एमएसपी व चारा मूल्य. हंगामाच्या मध्ये खात्रीचे पाणी हवे.',
    },
    soilAdvisory: {
      en: 'Side-dress nitrogen before tasseling or cobs stay small.',
      hi: 'फूल निकलने से पहले नाइट्रोजन साइड-ड्रेस करें वर भुट्टे छोटे रहेंगे।',
      mr: 'कणीस येण्यापूर्वी नत्र साइड-ड्रेस करा नाहीतर कणसे लहान राहतील.',
    },
    weatherAdvisory: {
      en: 'A dry week at silking cuts grain. Keep one irrigation reserved.',
      hi: 'रेशम निकलते समय सूखा सप्ताह दाने घटाता है। एक सिंचाई बचाकर रखें।',
      mr: 'रेशीम येताना कोरडा आठवडा दाणे कमी करतो. एक पाणी राखून ठेवा.',
    },
    schedule: [
      {
        when: { en: 'Day 0–6', hi: 'दिन 0–6', mr: 'दिवस 0–6' },
        action: {
          en: 'Sow in lines; treat seed against soil insects.',
          hi: 'कतार में बुवाई; मिट्टी के कीटों से बीज उपचार।',
          mr: 'ओळीने पेरणी; मातीतील किडींपासून बीज प्रक्रिया.',
        },
      },
      {
        when: { en: 'Day 90–110', hi: 'दिन 90–110', mr: 'दिवस 90–110' },
        action: {
          en: 'Harvest at 20% grain moisture; dry before bagging.',
          hi: '20% नमी पर कटाई; बोरे से पहले सुखाएँ।',
          mr: '२०% ओलीवर काढणी; पिशवीत भरण्यापूर्वी सुकवा.',
        },
      },
    ],
  },
  {
    id: 'groundnut-tag24',
    name: { en: 'Groundnut', hi: 'मूंगफली', mr: 'भुईमूग' },
    variety: 'TAG-24',
    seasons: ['Kharif', 'Zaid'],
    topologies: ['plains', 'coastal', 'plateau'],
    adjacentTopologies: ['valley'],
    waterNeed: 'medium',
    durationMin: 100,
    durationMax: 120,
    durationBand: 'medium',
    netIncomePerAcre: 27600,
    inputCostPerAcre: 14800,
    mspSupported: true,
    marketDemand: 'high',
    mspPrice: 6783,
    mandiPrice: 6400,
    expectedYieldQPerAcre: 8.4,
    resilience: 'medium',
    pestRisk: {
      en: 'Medium. Leaf miner and collar rot if soils stay wet.',
      hi: 'मध्यम। मिट्टी गीली रहे तो लीफ माइनर और कॉलर रॉट।',
      mr: 'मध्यम. माती ओली राहिल्यास लीफ मायनर व कॉलर रॉट.',
    },
    npk: { n: 'Low', p: 'High at sowing', k: 'Gypsum at pegging', ph: '6.0–7.5' },
    inputs: {
      en: 'Seed 40 kg/acre, gypsum 200 kg at pegging, seed treatment essential.',
      hi: 'बीज 40 किग्रा/एकड़, पेगिंग पर जिप्सम 200 किग्रा, बीज उपचार जरूरी।',
      mr: 'बी 40 किग्रॅ/एकर, पेगिंगवेळी जिप्सम 200 किग्रॅ, बीज प्रक्रिया आवश्यक.',
    },
    soilMatch: {
      en: 'Prefers lighter, well-drained patches. Heavy sticky clay lowers pod count.',
      hi: 'हल्की, अच्छी निकास वाली मिट्टी बेहतर। भारी चिपकने वाली मिट्टी फलियाँ घटाती है।',
      mr: 'हलकी, चांगल्या निचऱ्याची माती चांगली. चिकट भारी माती शेंगा कमी करते.',
    },
    why: {
      en: 'MSP oilseed with good mandi demand. Needs gypsum and careful harvest.',
      hi: 'एमएसपी तिलहन, मंडी मांग अच्छी। जिप्सम और सावधानी से खुदाई जरूरी।',
      mr: 'एमएसपी तेलबिया, बाजार मागणी चांगली. जिप्सम व काळजीपूर्वक खणणे गरजेचे.',
    },
    soilAdvisory: {
      en: 'Apply gypsum at pegging so pods fill and shells stay clean.',
      hi: 'पेगिंग पर जिप्सम दें ताकि फलियाँ भरें और छिलका साफ रहे।',
      mr: 'पेगिंगवेळी जिप्सम द्या म्हणजे शेंगा भरतील व साल स्वच्छ राहील.',
    },
    weatherAdvisory: {
      en: 'A dry spell at pegging is harmful. Keep soil moist but not flooded.',
      hi: 'पेगिंग पर सूखा नुकसान करता है। मिट्टी नम रखें, डूबी नहीं।',
      mr: 'पेगिंगवेळी कोरडा काळ नुकसान करतो. माती ओली ठेवा, बुडवू नका.',
    },
    schedule: [
      {
        when: { en: 'Day 0–7', hi: 'दिन 0–7', mr: 'दिवस 0–7' },
        action: {
          en: 'Sow treated kernels 5 cm deep.',
          hi: 'उपचारित दाने 5 सेमी गहराई में बोएँ।',
          mr: 'प्रक्रिया केलेले दाणे ५ सेमी खोल पेरा.',
        },
      },
      {
        when: { en: 'Day 100–120', hi: 'दिन 100–120', mr: 'दिवस 100–120' },
        action: {
          en: 'Dig when inner shells turn brown; dry 4 days.',
          hi: 'भीतरी छिलका भूरा हो तब खोदें; 4 दिन सुखाएँ।',
          mr: 'आतील साल तपकिरी झाल्यावर खणा; ४ दिवस सुकवा.',
        },
      },
    ],
  },
  {
    id: 'moong-ipm23',
    name: { en: 'Moong (Green gram)', hi: 'मूंग', mr: 'मुग' },
    variety: 'IPM 2-3',
    seasons: ['Zaid', 'Kharif'],
    topologies: ['plains', 'plateau', 'valley'],
    adjacentTopologies: ['hills'],
    waterNeed: 'low',
    durationMin: 60,
    durationMax: 75,
    durationBand: 'short',
    netIncomePerAcre: 19800,
    inputCostPerAcre: 6400,
    mspSupported: true,
    marketDemand: 'high',
    mspPrice: 8682,
    mandiPrice: 8200,
    expectedYieldQPerAcre: 4.6,
    resilience: 'high',
    pestRisk: {
      en: 'Low–medium. Yellow mosaic if whitefly builds in hot Zaid weather.',
      hi: 'कम–मध्यम। गर्म जायद में सफेद मक्खी से येलो मोज़ेक।',
      mr: 'कमी–मध्यम. उष्ण झायडमध्ये पांढरी माशीमुळे यलो मोझॅक.',
    },
    npk: { n: 'Starter only', p: 'Basal', k: 'Low', ph: '6.5–7.5' },
    inputs: {
      en: 'Seed 8 kg/acre, Rhizobium, one irrigation at flowering.',
      hi: 'बीज 8 किग्रा/एकड़, राइजोबियम, फूल पर एक सिंचाई।',
      mr: 'बी 8 किग्रॅ/एकर, रायझोबियम, फुलोऱ्यात एक पाणी.',
    },
    soilMatch: {
      en: 'Fits a short summer window on residual or light irrigation.',
      hi: 'बची नमी या हल्की सिंचाई पर छोटी गर्मी की खिड़की में फिट।',
      mr: 'शिल्लक ओल किंवा हलके पाणी देऊन उन्हाळी छोट्या खिडकीत बसते.',
    },
    why: {
      en: 'Fastest crop here (60–75 days), MSP pulse, low water, low capital.',
      hi: 'सबसे तेज फसल (60–75 दिन), एमएसपी दलहन, कम पानी, कम पूंजी।',
      mr: 'सर्वात जलद पीक (६०–७५ दिवस), एमएसपी कडधान्य, कमी पाणी, कमी भांडवल.',
    },
    soilAdvisory: {
      en: 'A short crop — do not leave leftover nitrogen that will lodge plants.',
      hi: 'छोटी फसल — बचा नाइट्रोजन न छोड़ें, पौधे गिर सकते हैं।',
      mr: 'लहान पीक — शिल्लक नत्र राहू देऊ नका, रोपे लोळतील.',
    },
    weatherAdvisory: {
      en: 'Hot dry Zaid is fine. Avoid fields that flood in a summer storm.',
      hi: 'गर्म सूखी जायद ठीक है। गर्मी की आंधी में डूबने वाले खेत से बचें।',
      mr: 'उष्ण कोरडे झायद चालते. उन्हाळी वादळात बुडणाऱ्या शेतापासून दूर रहा.',
    },
    schedule: [
      {
        when: { en: 'Day 0–4', hi: 'दिन 0–4', mr: 'दिवस 0–4' },
        action: {
          en: 'Sow after a pre-sowing irrigation in Zaid.',
          hi: 'जायद में बुवाई-पूर्व सिंचाई के बाद बोएँ।',
          mr: 'झायडमध्ये पेरणीपूर्व पाण्यानंतर पेरा.',
        },
      },
      {
        when: { en: 'Day 60–75', hi: 'दिन 60–75', mr: 'दिवस 60–75' },
        action: {
          en: 'Pick in two flushes; dry in shade.',
          hi: 'दो बार चुनाई; छाया में सुखाएँ।',
          mr: 'दोन वेळा वेचणी; सावलीत सुकवा.',
        },
      },
    ],
  },
  {
    id: 'sugarcane-com86032',
    name: { en: 'Sugarcane', hi: 'गन्ना', mr: 'ऊस' },
    variety: 'CoM 0265',
    seasons: ['Kharif', 'Rabi'],
    topologies: ['plains', 'valley', 'lowland'],
    adjacentTopologies: ['plateau'],
    waterNeed: 'high',
    durationMin: 300,
    durationMax: 365,
    durationBand: 'long',
    perennial: true,
    netIncomePerAcre: 68500,
    inputCostPerAcre: 42000,
    mspSupported: true,
    marketDemand: 'high',
    mspPrice: 340,
    mandiPrice: 340,
    expectedYieldQPerAcre: 420,
    resilience: 'low',
    pestRisk: {
      en: 'Medium. Early shoot borer and woolly aphid if ratoon is stressed.',
      hi: 'मध्यम। पेड़ी तनाव में हो तो अरो बोरर और वूली एफिड।',
      mr: 'मध्यम. खोडवा तणातात असेल तर खोडकिडा व वूली अफिड.',
    },
    npk: { n: 'Very high', p: 'Basal', k: 'Split', ph: '6.5–7.5' },
    inputs: {
      en: 'Setts 12,000/acre, heavy fertilizer, 8–12 irrigations. Highest capital.',
      hi: 'सेट 12,000/एकड़, अधिक खाद, 8–12 सिंचाई। सबसे अधिक पूंजी।',
      mr: 'सिट 12,000/एकर, जास्त खत, 8–12 पाणी. सर्वाधिक भांडवल.',
    },
    soilMatch: {
      en: 'Needs deep soil and reliable water. Weak on dry plateau without canal or well.',
      hi: 'गहरी मिट्टी और पक्का पानी चाहिए। बिना नहर/कुएँ के सूखे पठार पर कमजोर।',
      mr: 'खोल माती व खात्रीचे पाणी हवे. कालवा/विहीर नसलेल्या कोरड्या पठारावर कमकुवत.',
    },
    why: {
      en: 'Highest long-term income if water is assured. Factory FRP gives price security.',
      hi: 'पानी पक्का हो तो दीर्घकालिक आय सबसे अधिक। फैक्टरी एफआरपी से भाव सुरक्षित।',
      mr: 'पाणी खात्रीचे असेल तर दीर्घकालीन उत्पन्न सर्वाधिक. कारखाना एफआरपीने भाव सुरक्षित.',
    },
    soilAdvisory: {
      en: 'Trash mulch after each cut to keep this black soil from cracking.',
      hi: 'हर कटाई के बाद कचरा मल्च डालें ताकि काली मिट्टी फटे नहीं।',
      mr: 'प्रत्येक तोडीनंतर पाचट आच्छादन करा म्हणजे काळी माती भेगाळणार नाही.',
    },
    weatherAdvisory: {
      en: 'A long dry spell without irrigation will lock the cane. Not rain-fed safe.',
      hi: 'बिना सिंचाई के लंबा सूखा गन्ना रोक देगा। बारिश-निर्भर सुरक्षित नहीं।',
      mr: 'पाण्याशिवाय दीर्घ कोरडा काळ ऊस अडवेल. पावसाधार सुरक्षित नाही.',
    },
    schedule: [
      {
        when: { en: 'Planting month', hi: 'रोपण महीना', mr: 'लागवड महिना' },
        action: {
          en: 'Plant two-bud setts in furrows with basal fertilizer.',
          hi: 'कुंड में दो आँख वाले सेट और बेसल खाद।',
          mr: 'सऱ्यात दोन डोळ्यांचे सिट व बेसल खत.',
        },
      },
      {
        when: { en: 'Month 10–12', hi: 'माह 10–12', mr: 'महिना 10–12' },
        action: {
          en: 'Harvest at factory indent; keep ratoon if the stool is healthy.',
          hi: 'फैक्टरी इंडेंट पर कटाई; स्टूल स्वस्थ हो तो पेड़ी रखें।',
          mr: 'कारखाना इंडेंटवर तोडणी; खोड निरोगी असेल तर खोडवा ठेवा.',
        },
      },
    ],
  },
];

function demandScore(crop: CropCandidate): number {
  const demand = crop.marketDemand === 'high' ? 3 : crop.marketDemand === 'medium' ? 2 : 1;
  return demand * 10 + (crop.mspSupported ? 5 : 0);
}

function topologyFit(crop: CropCandidate, topology: Topology): TopologyFit {
  if (crop.topologies.includes(topology)) return 'strong';
  if (crop.adjacentTopologies?.includes(topology)) return 'fair';
  return 'weak';
}

export function rankCrops(input: {
  season: Season;
  topology: Topology;
  location?: string;
}): RankedCrop[] {
  const location = (input.location ?? farmer.location).toLowerCase();
  const nashik = location.includes('nashik') || location.includes('नाशिक') || location.includes('नासिक');
  const dryLand = input.topology === 'hills' || input.topology === 'plateau';
  const wetLand = input.topology === 'lowland' || input.topology === 'valley';

  return cropCatalog
    .filter((crop) => crop.seasons.includes(input.season))
    .map((crop) => {
      const fit = topologyFit(crop, input.topology);
      let score = 64;
      if (fit === 'strong') score += 16;
      else if (fit === 'fair') score += 5;
      else score -= 14;

      if (crop.waterNeed === 'low' && dryLand) score += 6;
      if (crop.waterNeed === 'medium') score += 3;
      if (crop.waterNeed === 'high' && dryLand) score -= 8;
      if (crop.waterNeed === 'high' && wetLand) score += 5;
      if ((crop.perennial || crop.durationBand === 'long') && crop.waterNeed === 'high' && dryLand) {
        score -= 6;
      }
      if (nashik && crop.nashikBonus) score += 8;
      if (crop.resilience === 'high') score += 4;
      else if (crop.resilience === 'low') score -= 5;
      if (crop.mspSupported) score += 2;
      if (crop.marketDemand === 'high') score += 1;

      score = Math.max(56, Math.min(95, Math.round(score)));
      return { ...crop, score, topologyFit: fit };
    })
    .filter((crop) => crop.topologyFit !== 'weak')
    .sort((a, b) => b.score - a.score || b.netIncomePerAcre - a.netIncomePerAcre);
}

export function applyCropFilters(crops: RankedCrop[], filters: CropFilters): RankedCrop[] {
  const list = crops.filter((crop) => {
    if (!matchesDuration(crop, filters.duration)) return false;
    if (filters.water !== 'all' && crop.waterNeed !== filters.water) return false;
    if (!matchesClimate(crop, filters.climate)) return false;
    if (filters.mspOnly && !crop.mspSupported) return false;
    if (filters.highDemandOnly && crop.marketDemand !== 'high') return false;
    return true;
  });

  const sorted = [...list];
  if (filters.sort === 'profit') {
    sorted.sort((a, b) => b.netIncomePerAcre - a.netIncomePerAcre || b.score - a.score);
  } else if (filters.sort === 'input') {
    sorted.sort((a, b) => a.inputCostPerAcre - b.inputCostPerAcre || b.score - a.score);
  } else if (filters.sort === 'market') {
    sorted.sort((a, b) => demandScore(b) - demandScore(a) || b.score - a.score);
  } else {
    sorted.sort((a, b) => b.score - a.score || b.netIncomePerAcre - a.netIncomePerAcre);
  }
  return sorted;
}

export function rankLabel(index: number, sort: CropSort): string {
  if (index === 0) {
    if (sort === 'profit') return '#1 Highest Profitability';
    if (sort === 'input') return '#1 Lowest Input Cost';
    if (sort === 'market') return '#1 Market Potential & MSP';
    return '#1 Best Overall Match';
  }
  return `#${index + 1} Alternative`;
}

export function getCropById(id: string): CropCandidate | undefined {
  return cropCatalog.find((crop) => crop.id === id);
}

export type ChartSeries = {
  id: string;
  name: LText;
  labels: string[];
  values: number[];
  years: string[];
};

export type YieldReport = {
  crop: CropCandidate;
  acres: number;
  expected: number;
  perAcre: number;
  mandiRevenue: number;
  mspRevenue: number | null;
  confidence: number;
  seasonLabel: string;
  chart: ChartSeries;
  previous: ChartSeries[];
};

const YEAR_LABELS = ['21', '22', '23', '24', '25', '26'];
const YEAR_FULL = ['2021', '2022', '2023', '2024', '2025', '2026'];
const YEAR_WEIGHTS = [0.78, 0.84, 0.91, 0.87, 0.95, 1];

function hashSeed(id: string): number {
  return id.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
}

function buildSeries(crop: CropCandidate): ChartSeries {
  const seed = hashSeed(crop.id);
  const values = YEAR_WEIGHTS.map((weight, index) => {
    const wobble = ((seed + index * 7) % 5) * 0.012;
    return Number((crop.expectedYieldQPerAcre * (weight + wobble)).toFixed(1));
  });
  return {
    id: crop.id,
    name: crop.name,
    labels: YEAR_LABELS,
    values,
    years: YEAR_FULL,
  };
}

export function buildYieldReport(
  cropId: string,
  acres = farmer.farmSize,
  season: Season = 'Rabi',
): YieldReport {
  const crop = getCropById(cropId) ?? cropCatalog[0];
  const perAcre = crop.expectedYieldQPerAcre;
  const expected = Number((perAcre * acres).toFixed(1));
  const mandiRevenue = Math.round(expected * crop.mandiPrice);
  const mspRevenue = crop.mspPrice ? Math.round(expected * crop.mspPrice) : null;
  const previousIds =
    crop.seasons.includes('Rabi')
      ? ['onion-alr', 'soybean-js335']
      : ['wheat-hd2967', 'onion-alr'];

  return {
    crop,
    acres,
    expected,
    perAcre,
    mandiRevenue,
    mspRevenue,
    confidence: Math.max(76, Math.min(92, 70 + Math.round(perAcre % 17))),
    seasonLabel: `${season} 2026`,
    chart: buildSeries(crop),
    previous: previousIds
      .flatMap((id) => {
        const item = getCropById(id);
        return item && item.id !== crop.id ? [item] : [];
      })
      .slice(0, 2)
      .map(buildSeries),
  };
}

export function yieldSpeechSummary(report: YieldReport, locale: Locale): string {
  const name = pickText(report.crop.name, locale);
  const variety = report.crop.variety;
  const yieldLine =
    locale === 'hi'
      ? `अपेक्षित उपज ${report.perAcre} क्विंटल प्रति एकड़, कुल ${report.expected} क्विंटल।`
      : locale === 'mr'
        ? `अपेक्षित उत्पादन ${report.perAcre} क्विंटल प्रति एकर, एकूण ${report.expected} क्विंटल.`
        : `Expected yield ${report.perAcre} quintals per acre, total ${report.expected} quintals.`;
  const money =
    locale === 'hi'
      ? `मंडी पर अनुमानित आमदनी ${formatInr(report.mandiRevenue)}।`
      : locale === 'mr'
        ? `बाजारात अंदाजित उत्पन्न ${formatInr(report.mandiRevenue)}.`
        : `Estimated mandi revenue ${formatInr(report.mandiRevenue)}.`;
  const msp = report.crop.mspPrice
    ? locale === 'hi'
      ? `वर्तमान एमएसपी ${formatInr(report.crop.mspPrice)} प्रति क्विंटल।`
      : locale === 'mr'
        ? `सध्याचा एमएसपी ${formatInr(report.crop.mspPrice)} प्रति क्विंटल.`
        : `Current MSP is ${formatInr(report.crop.mspPrice)} per quintal.`
    : locale === 'hi'
      ? 'इस फसल पर सरकारी एमएसपी नहीं है।'
      : locale === 'mr'
        ? 'या पिकाला शासकीय एमएसपी नाही.'
        : 'This crop has no official MSP.';
  return `${name}, ${variety}. ${yieldLine} ${money} ${msp}`;
}
