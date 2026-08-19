export const farmer = {
  name: 'Ramesh Patil',
  firstName: 'Ramesh',
  phone: '98765 43210',
  district: 'Nashik',
  state: 'Maharashtra',
  location: 'Nashik, Maharashtra',
  farmSize: 4.5,
  soilType: 'Black cotton soil',
  primaryCrop: 'Onion',
  season: 'Rabi',
  farmerId: 'MH27-NSK-04512',
  verification: {
    pmKisan: true,
    aadhaar: true,
    aadhaarLast4: '2194',
  },
};

export const mandis = [
  { value: 'lasalgaon', label: 'Lasalgaon APMC' },
  { value: 'nashik', label: 'Nashik APMC' },
  { value: 'pimpalgaon', label: 'Pimpalgaon Baswant APMC' },
  { value: 'yeola', label: 'Yeola APMC' },
  { value: 'vashi', label: 'Mumbai Vashi APMC' },
];

export type CropSeason = {
  season: string;
  crop: string;
  yield?: string;
};

export type SoilHealthCard = {
  status: 'tested' | 'due';
  testedOn: string;
  lab: string;
  cardId: string;
};

export type FarmPlot = {
  id: string;
  shortName: string;
  name: string;
  size: number;
  unit: string;
  surveyNo: string;
  khasraNo: string;
  soilType: string;
  irrigation: string;
  soilHealthCard: SoilHealthCard;
  pastCrops: CropSeason[];
};

export const farms: FarmPlot[] = [
  {
    id: 'farm-1',
    shortName: 'Farm 1',
    name: 'Sinnar Main Plot',
    size: 4.5,
    unit: 'Acres',
    surveyNo: '312',
    khasraNo: 'Gat 12/4',
    soilType: 'Black cotton soil',
    irrigation: 'Borewell',
    soilHealthCard: {
      status: 'tested',
      testedOn: 'March 2025',
      lab: 'KVK Nashik',
      cardId: 'SHC-MH-2025-11842',
    },
    pastCrops: [
      { season: 'Rabi 2024–25', crop: 'Onion', yield: '165 q' },
      { season: 'Kharif 2025', crop: 'Soybean', yield: '8.2 q/acre' },
      { season: 'Summer 2025', crop: 'Green gram', yield: '4.1 q/acre' },
    ],
  },
  {
    id: 'farm-2',
    shortName: 'Farm 2',
    name: 'Igatpuri Hill Plot',
    size: 2.8,
    unit: 'Acres',
    surveyNo: '88',
    khasraNo: 'Gat 7/2',
    soilType: 'Red laterite',
    irrigation: 'Rain-fed',
    soilHealthCard: {
      status: 'due',
      testedOn: 'January 2024',
      lab: 'KVK Nashik',
      cardId: 'SHC-MH-2024-07310',
    },
    pastCrops: [
      { season: 'Kharif 2025', crop: 'Finger millet (nachni)', yield: '6.4 q/acre' },
      { season: 'Rabi 2024–25', crop: 'Gram', yield: '5.8 q/acre' },
    ],
  },
  {
    id: 'farm-3',
    shortName: 'Farm 3',
    name: 'Niphad Canal Plot',
    size: 6,
    unit: 'Bigha',
    surveyNo: '201',
    khasraNo: 'Gat 19/1',
    soilType: 'Medium black soil',
    irrigation: 'Canal',
    soilHealthCard: {
      status: 'tested',
      testedOn: 'January 2025',
      lab: 'Soil Testing Lab, Niphad',
      cardId: 'SHC-MH-2025-09004',
    },
    pastCrops: [
      { season: 'Rabi 2024–25', crop: 'Wheat HD-2967', yield: '17.8 q/acre' },
      { season: 'Kharif 2025', crop: 'Maize', yield: '22 q/acre' },
    ],
  },
];

export const weather = {
  temp: 28,
  condition: 'Clear sky',
  high: 32,
  low: 21,
  humidity: 54,
  wind: '9 km/h',
  rainChance: 12,
  location: 'Nashik',
};

export const farmSummary = {
  acres: 4.5,
  health: 'Good',
  healthScore: 78,
  nextAction: 'Irrigation in 2 days',
};

export const recentRecommendation = {
  crop: 'Wheat HD-2967',
  confidence: 87,
  expectedYield: '18.4 q/acre',
  risk: 'Low',
  season: 'Rabi',
};

export const recentYield = {
  value: '82.8 q',
  change: '+6.2%',
  revenue: '₹1,86,300',
};

export const aiTip = {
  title: 'AI Tip',
  body: 'Light irrigation this evening will protect soil moisture before the dry spell mid-week.',
};

export const recommendationResult = {
  crop: 'Wheat HD-2967',
  confidence: 87,
  expectedYield: '18.4 q/acre',
  risk: 'Low' as const,
  water: 'Moderate',
  reasoning:
    'Your black soil, current moisture, and the coming cool Rabi window favour wheat. HD-2967 is a strong match for Nashik conditions this season.',
};

export const yieldForecast = {
  expected: 82.8,
  unit: 'quintals',
  perAcre: 18.4,
  revenue: '₹1,86,300',
  confidence: 84,
  season: 'Rabi 2026',
  chart: {
    labels: ['21', '22', '23', '24', '25', '26'],
    values: [14.2, 15.1, 16.8, 15.9, 17.4, 18.4],
  },
};

export type HealthTone = 'excellent' | 'good' | 'fair' | 'low' | 'watch';

export type HealthParameter = {
  label: string;
  value: string;
  hint?: string;
  tone?: HealthTone;
};

export const farmHealth = [
  {
    id: 'soil',
    title: 'Soil Health',
    status: 'Good',
    tone: 'good' as HealthTone,
    score: 82,
    description: 'Nutrients are balanced. Add a light nitrogen dose before sowing.',
    icon: 'leaf-outline' as const,
    advice: 'Apply 25 kg zinc sulphate per hectare and a light basal nitrogen dose before sowing.',
    parameters: [
      { label: 'pH', value: '7.2', hint: 'Neutral — ideal for onion and wheat' },
      { label: 'Electrical conductivity', value: '0.32 dS/m', hint: 'Non-saline' },
      { label: 'Organic carbon', value: '0.68%', hint: 'Medium' },
      { label: 'Nitrogen (N)', value: '248 kg/ha', hint: 'Medium' },
      { label: 'Phosphorus (P)', value: '22.4 kg/ha', hint: 'High' },
      { label: 'Potassium (K)', value: '310 kg/ha', hint: 'Medium' },
      { label: 'Sulphur (S)', value: '14.2 mg/kg', hint: 'Adequate' },
      { label: 'Zinc (Zn)', value: '0.72 mg/kg', hint: 'Low — needs correction', tone: 'fair' as HealthTone },
      { label: 'Boron (B)', value: '0.51 mg/kg', hint: 'Adequate' },
      { label: 'Iron (Fe)', value: '8.4 mg/kg', hint: 'Sufficient' },
      { label: 'Manganese (Mn)', value: '5.1 mg/kg', hint: 'Sufficient' },
      { label: 'Copper (Cu)', value: '0.38 mg/kg', hint: 'Adequate' },
    ],
  },
  {
    id: 'water',
    title: 'Water',
    status: 'Fair',
    tone: 'fair' as HealthTone,
    score: 68,
    description: 'Soil moisture is adequate. Plan drip irrigation before the dry spell.',
    icon: 'water-outline' as const,
    advice: 'Run a short drip cycle in 2 days. Avoid flood irrigation this week.',
    parameters: [
      { label: 'Soil moisture', value: '42%', hint: 'Adequate for onion' },
      { label: 'Available water', value: '28 mm', hint: 'Root zone' },
      { label: 'Last irrigation', value: '3 days ago', hint: 'Borewell + drip' },
      { label: 'Next irrigation', value: 'In 2 days', hint: 'Before the dry spell' },
      { label: 'Irrigation source', value: 'Borewell', hint: 'Drip on Farm 1' },
      { label: 'Water quality (TDS)', value: '480 ppm', hint: 'Safe for drip' },
      { label: 'Rainfall (7 days)', value: '4 mm', hint: 'Below normal', tone: 'fair' as HealthTone },
      { label: 'Water table', value: '18 m', hint: 'Stable' },
    ],
  },
  {
    id: 'weather',
    title: 'Weather',
    status: 'Excellent',
    tone: 'excellent' as HealthTone,
    score: 91,
    description: 'Clear skies and mild days. Ideal window for field work this week.',
    icon: 'partly-sunny-outline' as const,
    advice: 'Finish spraying and sowing work in the next 4 clear days.',
    parameters: [
      { label: 'Now', value: '28°C', hint: 'Clear sky' },
      { label: 'High / Low', value: '32° / 21°C', hint: 'Mild for Rabi' },
      { label: 'Humidity', value: '54%', hint: 'Comfortable' },
      { label: 'Wind', value: '9 km/h', hint: 'Safe for spray' },
      { label: 'Rain chance today', value: '12%', hint: 'No wet spell' },
      { label: '7-day rain', value: '8 mm', hint: 'Light, scattered' },
      { label: 'Heat stress', value: 'None', hint: 'No crop stress expected' },
      { label: 'Field-work window', value: 'Excellent', hint: 'This week' },
    ],
  },
  {
    id: 'vegetation',
    title: 'Vegetation',
    status: 'Good',
    tone: 'good' as HealthTone,
    score: 76,
    description: 'Crop cover looks healthy. No stress detected in the last 7 days.',
    icon: 'nutrition-outline' as const,
    advice: 'Canopy is filling well. Watch zinc on younger leaves after the next irrigation.',
    parameters: [
      { label: 'NDVI', value: '0.62', hint: 'Healthy canopy' },
      { label: 'Canopy cover', value: '71%', hint: 'Closing well' },
      { label: 'Leaf colour', value: 'Deep green', hint: 'No widespread chlorosis' },
      { label: 'Growth stage', value: 'Vegetative', hint: 'On schedule' },
      { label: 'Moisture stress', value: 'Low', hint: 'Last 7 days' },
      { label: '7-day NDVI change', value: '+0.04', hint: 'Improving' },
      { label: 'Weed pressure', value: 'Low', hint: 'Inter-rows clean' },
      { label: 'Nutrient stress', value: 'Mild zinc', hint: 'Younger leaves', tone: 'fair' as HealthTone },
    ],
  },
  {
    id: 'risk',
    title: 'Risk',
    status: 'Low',
    tone: 'low' as HealthTone,
    score: 24,
    description: 'Pest and drought risk stay low. Keep a light watch on aphids.',
    icon: 'warning-outline' as const,
    advice: 'Scout for aphids twice this week. No spray needed unless colonies build on new shoots.',
    parameters: [
      { label: 'Pest (aphids)', value: 'Low watch', hint: 'Scout twice this week', tone: 'fair' as HealthTone },
      { label: 'Disease', value: 'Low', hint: 'No blight reported nearby' },
      { label: 'Drought (14 days)', value: 'Moderate', hint: 'Dry spell mid-week', tone: 'fair' as HealthTone },
      { label: 'Flood', value: 'None', hint: 'No heavy rain in outlook' },
      { label: 'Hail / wind', value: 'Low', hint: 'Wind under 15 km/h' },
      { label: 'Market price risk', value: 'Moderate', hint: 'Onion mandi is volatile', tone: 'fair' as HealthTone },
      { label: 'Overall farm risk', value: 'Low', hint: 'Score 24 of 100' },
    ],
  },
];

export const suggestedQuestions = [
  'Best crop this season?',
  'How is my soil?',
  'What if my land is hilly?',
];

export const aiReplies: Record<string, string> = {
  'Best crop this season?':
    'For your 4.5 acre plateau plot in Nashik this Rabi, Wheat HD-2967 ranks first — about 94% soil and climate match, MSP support, and 18.4 q/acre. Onion Agrifound Light Red is the high-profit alternative if you can take market risk.',
  'How is my soil?':
    'Soil health is Good (82). Black cotton soil is holding nutrients well. A light nitrogen dose before sowing will keep the score high.',
  'What if my land is hilly?':
    'On sloping land, millets rise in the ranking. Bajra and jowar need less water and hold the soil better than cane or cotton. Update the farm plot in Profile if the land is hilly — recommendations will refresh from that profile.',
};

export const defaultAiReply =
  'I can help with crop choice, land topology, yield, and farm health. Ask me anything about your field.';

export const welcomeAiMessage =
  'Namaste Ramesh. I am your Krishi Setu advisor. How can I help your farm today?';

export const images = {
  avatar: require('../assets/images/farmer-avatar.jpg'),
  wheat: require('../assets/images/crop-wheat.jpg'),
  icon: require('../assets/images/icon.jpg'),
};
