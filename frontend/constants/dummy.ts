export const farmer = {
  name: 'Ramesh Patil',
  firstName: 'Ramesh',
  phone: '98765 43210',
  location: 'Nashik, Maharashtra',
  farmSize: 4.5,
  soilType: 'Black cotton soil',
  primaryCrop: 'Onion',
  season: 'Rabi',
};

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

export const farmHealth = [
  {
    id: 'soil',
    title: 'Soil Health',
    status: 'Good',
    tone: 'good' as HealthTone,
    score: 82,
    description: 'Nutrients are balanced. Add a light nitrogen dose before sowing.',
    icon: 'leaf-outline' as const,
  },
  {
    id: 'water',
    title: 'Water',
    status: 'Fair',
    tone: 'fair' as HealthTone,
    score: 68,
    description: 'Soil moisture is adequate. Plan drip irrigation before the dry spell.',
    icon: 'water-outline' as const,
  },
  {
    id: 'weather',
    title: 'Weather',
    status: 'Excellent',
    tone: 'excellent' as HealthTone,
    score: 91,
    description: 'Clear skies and mild days. Ideal window for field work this week.',
    icon: 'partly-sunny-outline' as const,
  },
  {
    id: 'vegetation',
    title: 'Vegetation',
    status: 'Good',
    tone: 'good' as HealthTone,
    score: 76,
    description: 'Crop cover looks healthy. No stress detected in the last 7 days.',
    icon: 'nutrition-outline' as const,
  },
  {
    id: 'risk',
    title: 'Risk',
    status: 'Low',
    tone: 'low' as HealthTone,
    score: 24,
    description: 'Pest and drought risk stay low. Keep a light watch on aphids.',
    icon: 'warning-outline' as const,
  },
];

export const suggestedQuestions = [
  'Best crop this season?',
  'How is my soil?',
  'Nearby fertilizer deals?',
];

export const aiReplies: Record<string, string> = {
  'Best crop this season?':
    'For your 4.5 acre plot in Nashik this Rabi, Wheat HD-2967 is the strongest match — 87% confidence, low risk, and solid expected yield of 18.4 q/acre.',
  'How is my soil?':
    'Soil health is Good (82). Black cotton soil is holding nutrients well. A light nitrogen dose before sowing will keep the score high.',
  'Nearby fertilizer deals?':
    'NPK 19:19:19 from GreenLeaf Traders is 12% below the local average this week. There is also an AI-recommended soil test kit if you want a fresh reading.',
};

export const defaultAiReply =
  'I can help with crop choice, yield, farm health, and nearby deals. Ask me anything about your field.';

export const welcomeAiMessage =
  'Namaste Ramesh. I am your Krishi Setu advisor. How can I help your farm today?';

export const dealCategories = ['All', 'Seeds', 'Fertilizers', 'Irrigation', 'Protection'] as const;

export type DealCategory = (typeof dealCategories)[number];

export type Deal = {
  id: string;
  name: string;
  dealer: string;
  price: number;
  mrp?: number;
  discount?: number;
  category: Exclude<DealCategory, 'All'>;
  aiRecommended?: boolean;
  image: number;
};

export const deals: Deal[] = [
  {
    id: '1',
    name: 'HD-2967 Wheat Seeds',
    dealer: 'AgroMart Nashik',
    price: 2450,
    mrp: 2880,
    discount: 15,
    category: 'Seeds',
    aiRecommended: true,
    image: require('../assets/images/product-seeds.jpg'),
  },
  {
    id: '2',
    name: 'NPK 19:19:19',
    dealer: 'GreenLeaf Traders',
    price: 1180,
    mrp: 1340,
    discount: 12,
    category: 'Fertilizers',
    image: require('../assets/images/product-fertilizer.jpg'),
  },
  {
    id: '3',
    name: 'Drip Kit · 1 Acre',
    dealer: 'JalSeva',
    price: 8900,
    mrp: 9900,
    discount: 10,
    category: 'Irrigation',
    image: require('../assets/images/product-drip.jpg'),
  },
  {
    id: '4',
    name: 'Neem Oil 5L',
    dealer: 'KrishiCare',
    price: 620,
    category: 'Protection',
    image: require('../assets/images/product-neem.jpg'),
  },
  {
    id: '5',
    name: 'Urea 45 kg',
    dealer: 'Bharat Fertilizers',
    price: 266,
    category: 'Fertilizers',
    image: require('../assets/images/product-urea.jpg'),
  },
  {
    id: '6',
    name: 'Soil Test Kit',
    dealer: 'FarmLab',
    price: 499,
    category: 'Protection',
    aiRecommended: true,
    image: require('../assets/images/product-soil-kit.jpg'),
  },
];

export const images = {
  loginHero: require('../assets/images/login-hero.jpg'),
  avatar: require('../assets/images/farmer-avatar.jpg'),
  wheat: require('../assets/images/crop-wheat.jpg'),
  icon: require('../assets/images/icon.jpg'),
};
