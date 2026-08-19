import { formatInr } from '@/constants/crops';

export type BuyerKind = 'processor' | 'fmcg' | 'apmc';

export type CropBuyer = {
  id: string;
  name: string;
  needTons: number;
  model: string;
  distanceKm: number;
  priceNote: string;
  updated: string;
  contractFarming: boolean;
};

export type CropContract = {
  buyer: string;
  quantity: string;
  grade: string;
  pickup: boolean;
  price: string;
  expiry: string;
  agreementNo: string;
};

export type CropScheme = {
  name: string;
  hint: string;
};

export type CropMarket = {
  buyers: CropBuyer[];
  contract?: CropContract;
  schemes: CropScheme[];
  apmc?: {
    name: string;
    today: number;
    yesterday: number;
    weekly: string;
  };
};

const commonSchemes: CropScheme[] = [
  { name: 'PM-KISAN', hint: '₹6,000 / year in 3 instalments' },
  { name: 'PMFBY', hint: 'Crop insurance against yield loss' },
];

export const cropMarkets: Partial<Record<string, CropMarket>> = {
  'wheat-hd2967': {
    apmc: { name: 'Nashik APMC', today: 2250, yesterday: 2210, weekly: '+3.1%' },
    buyers: [
      {
        id: 'itc',
        name: 'ITC Foods',
        needTons: 60,
        model: 'Contract farming available',
        distanceKm: 42,
        priceNote: 'Premium for 11.5% protein',
        updated: 'Yesterday',
        contractFarming: true,
      },
      {
        id: 'adani',
        name: 'Adani Wilmar',
        needTons: 110,
        model: 'Contract purchase',
        distanceKm: 58,
        priceNote: 'Price updated yesterday',
        updated: 'Yesterday',
        contractFarming: true,
      },
      {
        id: 'tata',
        name: 'Tata Consumer',
        needTons: 75,
        model: 'Direct procurement',
        distanceKm: 71,
        priceNote: 'Pickup from farm gate',
        updated: '2 days ago',
        contractFarming: false,
      },
    ],
    contract: {
      buyer: 'ITC Foods',
      quantity: '60 tonnes',
      grade: 'FAQ · 11.5% protein · max 12% moisture',
      pickup: true,
      price: '₹2,310 / quintal',
      expiry: '30 Nov 2026',
      agreementNo: 'KS-CF-2026-0412',
    },
    schemes: [
      ...commonSchemes,
      { name: 'MSP procurement', hint: 'FCI / state agency floor price' },
    ],
  },
  'onion-alr': {
    apmc: { name: 'Lasalgaon APMC', today: 1850, yesterday: 1920, weekly: '−4.2%' },
    buyers: [
      {
        id: 'naf',
        name: 'NAFED',
        needTons: 40,
        model: 'Buffer procurement',
        distanceKm: 18,
        priceNote: 'When mandi falls below floor',
        updated: 'Today',
        contractFarming: false,
      },
      {
        id: 'dehaat',
        name: 'DeHaat Export Desk',
        needTons: 25,
        model: 'Quality-linked purchase',
        distanceKm: 12,
        priceNote: '40–60 mm bulbs preferred',
        updated: 'Yesterday',
        contractFarming: false,
      },
    ],
    schemes: [
      ...commonSchemes,
      { name: 'NAFED buffer', hint: 'Support buy during price crash' },
    ],
  },
  'soybean-js335': {
    apmc: { name: 'Nashik APMC', today: 4280, yesterday: 4210, weekly: '+2.4%' },
    buyers: [
      {
        id: 'adani',
        name: 'Adani Wilmar',
        needTons: 110,
        model: 'Contract purchase',
        distanceKm: 58,
        priceNote: 'Price updated yesterday',
        updated: 'Yesterday',
        contractFarming: true,
      },
      {
        id: 'itc',
        name: 'ITC Agri',
        needTons: 80,
        model: 'Direct procurement',
        distanceKm: 42,
        priceNote: 'Oil-seed crushing line',
        updated: 'Today',
        contractFarming: true,
      },
    ],
    contract: {
      buyer: 'Adani Wilmar',
      quantity: '110 tonnes',
      grade: 'FAQ · max 12% moisture',
      pickup: true,
      price: '₹4,350 / quintal',
      expiry: '15 Oct 2026',
      agreementNo: 'KS-CF-2026-0881',
    },
    schemes: [
      ...commonSchemes,
      { name: 'MSP procurement', hint: 'Oilseed floor price window' },
    ],
  },
  'cotton-nh615': {
    apmc: { name: 'Yeola APMC', today: 7100, yesterday: 7020, weekly: '+1.8%' },
    buyers: [
      {
        id: 'welspun',
        name: 'Welspun India',
        needTons: 90,
        model: 'Contract farming available',
        distanceKm: 64,
        priceNote: 'Staple length 28 mm+',
        updated: 'Yesterday',
        contractFarming: true,
      },
      {
        id: 'cci',
        name: 'Cotton Corporation of India',
        needTons: 200,
        model: 'MSP procurement',
        distanceKm: 31,
        priceNote: 'When mandi is at MSP',
        updated: 'Today',
        contractFarming: false,
      },
    ],
    contract: {
      buyer: 'Welspun India',
      quantity: '90 tonnes',
      grade: 'Shankar-6 · 28 mm staple',
      pickup: true,
      price: '₹7,250 / quintal',
      expiry: '31 Jan 2027',
      agreementNo: 'KS-CF-2026-1104',
    },
    schemes: [
      ...commonSchemes,
      { name: 'CCI MSP', hint: 'Government cotton purchase' },
    ],
  },
  'maize-african': {
    apmc: { name: 'Nashik APMC', today: 2150, yesterday: 2135, weekly: '+0.9%' },
    buyers: [
      {
        id: 'itc',
        name: 'ITC Foods',
        needTons: 55,
        model: 'Direct procurement',
        distanceKm: 42,
        priceNote: 'Feed and starch grade',
        updated: 'Yesterday',
        contractFarming: true,
      },
      {
        id: 'suguna',
        name: 'Suguna Feeds',
        needTons: 70,
        model: 'Contract purchase',
        distanceKm: 39,
        priceNote: 'Poultry-feed line',
        updated: '2 days ago',
        contractFarming: false,
      },
    ],
    contract: {
      buyer: 'ITC Foods',
      quantity: '55 tonnes',
      grade: 'Feed grade · max 14% moisture',
      pickup: true,
      price: '₹2,180 / quintal',
      expiry: '20 Sep 2026',
      agreementNo: 'KS-CF-2026-0733',
    },
    schemes: commonSchemes,
  },
  'mustard-nrchb101': {
    apmc: { name: 'Nashik APMC', today: 5650, yesterday: 5580, weekly: '+1.6%' },
    buyers: [
      {
        id: 'adani',
        name: 'Adani Wilmar',
        needTons: 40,
        model: 'Oil crushing purchase',
        distanceKm: 58,
        priceNote: 'Oil content 40%+',
        updated: 'Yesterday',
        contractFarming: false,
      },
    ],
    schemes: [
      ...commonSchemes,
      { name: 'MSP procurement', hint: 'Mustard floor price' },
    ],
  },
  'sugarcane-com86032': {
    buyers: [
      {
        id: 'factory',
        name: 'Nashik Sahakari Sakhar Karkhana',
        needTons: 400,
        model: 'Factory tying / FRP',
        distanceKm: 16,
        priceNote: 'FRP notified by state',
        updated: 'This week',
        contractFarming: true,
      },
    ],
    contract: {
      buyer: 'Nashik Sahakari Sakhar Karkhana',
      quantity: '400 tonnes',
      grade: 'CoM 86032 · 11.5% recovery',
      pickup: true,
      price: '₹3,150 / tonne (FRP)',
      expiry: '31 Mar 2027',
      agreementNo: 'KS-CF-2026-1502',
    },
    schemes: [
      ...commonSchemes,
      { name: 'Fair & Remunerative Price', hint: 'State FRP for cane' },
    ],
  },
  'groundnut-tag24': {
    apmc: { name: 'Nashik APMC', today: 6200, yesterday: 6140, weekly: '+1.2%' },
    buyers: [
      {
        id: 'adani',
        name: 'Adani Wilmar',
        needTons: 35,
        model: 'Oil crushing purchase',
        distanceKm: 58,
        priceNote: 'Bold kernels preferred',
        updated: 'Yesterday',
        contractFarming: false,
      },
    ],
    schemes: [
      ...commonSchemes,
      { name: 'MSP procurement', hint: 'Groundnut floor price' },
    ],
  },
};

export const CONTRACT_QTY_PRESETS = [5, 10, 20, 40, 50] as const;

export function getCropMarket(cropId: string): CropMarket | undefined {
  return cropMarkets[cropId];
}

export function hasLargeBuyers(cropId: string): boolean {
  return (cropMarkets[cropId]?.buyers.length ?? 0) > 0;
}

export function hasContract(cropId: string): boolean {
  return Boolean(cropMarkets[cropId]?.contract);
}

export function parsePriceAmount(price: string): number {
  const match = price.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

export type PriceUnit = 'quintal' | 'tonne';

export type SalePrice = {
  amount: number;
  per: PriceUnit;
};

export function salePriceForCrop(cropId: string, liveToday?: number, mandiFallback?: number): SalePrice {
  const market = cropMarkets[cropId];
  if (liveToday != null || market?.apmc) {
    return { amount: liveToday ?? market!.apmc!.today, per: 'quintal' };
  }
  if (market?.contract) {
    const per: PriceUnit = /tonne/i.test(market.contract.price) ? 'tonne' : 'quintal';
    return { amount: parsePriceAmount(market.contract.price), per };
  }
  return { amount: mandiFallback ?? 0, per: 'quintal' };
}

export function formatSalePrice(price: SalePrice): string {
  return `${formatInr(price.amount)} / ${price.per === 'tonne' ? 'tonne' : 'q'}`;
}

export function expectedEarnings(tonnes: number, price: SalePrice): number {
  if (tonnes <= 0 || price.amount <= 0) return 0;
  if (price.per === 'tonne') return Math.round(tonnes * price.amount);
  return Math.round(tonnes * 10 * price.amount);
}

export function overlayContract(
  cropId: string,
  patch: {
    buyer?: string;
    quantity?: string;
    price?: string;
    pickup?: boolean;
    agreementNo?: string;
  },
): CropContract | undefined {
  const base = cropMarkets[cropId]?.contract;
  const buyer = patch.buyer ?? base?.buyer;
  if (!buyer) return undefined;
  return {
    buyer,
    quantity: patch.quantity ?? base?.quantity ?? '5 tonnes',
    grade: base?.grade ?? 'FAQ',
    pickup: patch.pickup ?? base?.pickup ?? true,
    price: patch.price ?? base?.price ?? '',
    expiry: base?.expiry ?? '31 Dec 2026',
    agreementNo: patch.agreementNo ?? base?.agreementNo ?? `KS-CF-2026-${cropId.slice(0, 4).toUpperCase()}`,
  };
}
