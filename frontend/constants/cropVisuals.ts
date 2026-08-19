import type { ComponentProps } from 'react';
import type { ImageSource } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import type { Resilience, WaterNeed } from '@/constants/crops';

type Glyph = ComponentProps<typeof Ionicons>['name'];

export type CropArt = {
  source?: ImageSource;
  color: string;
  icon: Glyph;
};

export const cropArt: Record<string, CropArt> = {
  'wheat-hd2967': {
    source: require('../assets/images/crop-wheat.jpg'),
    color: '#E8C547',
    icon: 'leaf',
  },
  'onion-alr': {
    source: { uri: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=640&q=80' },
    color: '#C48BDB',
    icon: 'nutrition',
  },
  'gram-vijay': {
    source: { uri: 'https://images.unsplash.com/photo-1647427060118-7545861053fb?w=640&q=80' },
    color: '#D4A574',
    icon: 'ellipse',
  },
  'mustard-nrchb101': {
    source: { uri: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=640&q=80' },
    color: '#F4D35E',
    icon: 'flower',
  },
  'jowar-csv22': {
    source: { uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=640&q=80' },
    color: '#C9A227',
    icon: 'leaf',
  },
  'soybean-js335': {
    source: { uri: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=640&q=80' },
    color: '#7CB342',
    icon: 'leaf',
  },
  'cotton-nh615': {
    source: { uri: 'https://images.unsplash.com/photo-1574944985070-8b3b3a2d1d3a?w=640&q=80' },
    color: '#F5F0E6',
    icon: 'cloudy',
  },
  'tur-bdn711': {
    source: { uri: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=640&q=80' },
    color: '#C47A3A',
    icon: 'ellipse',
  },
  'bajra-ictp8203': {
    source: { uri: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=640&q=80' },
    color: '#CDB37A',
    icon: 'leaf',
  },
  'maize-african': {
    source: { uri: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=640&q=80' },
    color: '#F6C445',
    icon: 'sunny',
  },
  'groundnut-tag24': {
    source: { uri: 'https://images.unsplash.com/photo-1567892737950-30c4db37cd89?w=640&q=80' },
    color: '#D4A017',
    icon: 'ellipse',
  },
  'moong-ipm23': {
    source: { uri: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=640&q=80' },
    color: '#8BC34A',
    icon: 'nutrition',
  },
  'sugarcane-com86032': {
    source: { uri: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=640&q=80' },
    color: '#66BB6A',
    icon: 'leaf',
  },
};

export const highlightMeta: Record<
  string,
  { label: string; color: string; bg: string; icon: Glyph }
> = {
  'best-match': { label: 'Best match', color: '#1B5E20', bg: '#E8F5E9', icon: 'star' },
  'highest-profit': { label: 'Highest profit', color: '#0D47A1', bg: '#E3F2FD', icon: 'trending-up' },
  'lowest-water': { label: 'Lowest water need', color: '#01579B', bg: '#E1F5FE', icon: 'water' },
  safest: { label: 'Safest crop', color: '#1B5E20', bg: '#E8F5E9', icon: 'shield-checkmark' },
  fastest: { label: 'Fastest harvest', color: '#E65100', bg: '#FFF3E0', icon: 'flash' },
  'best-msp': { label: 'Best MSP', color: '#33691E', bg: '#F1F8E9', icon: 'ribbon' },
  'low-investment': { label: 'Low investment', color: '#4A148C', bg: '#F3E5F5', icon: 'wallet' },
};

export function waterIcon(need: WaterNeed): Glyph {
  if (need === 'low') return 'rainy-outline';
  if (need === 'high') return 'water';
  return 'water-outline';
}

export function waterTone(need: WaterNeed) {
  if (need === 'low') return { bg: '#E3F2FD', fg: '#1565C0' };
  if (need === 'high') return { bg: '#E3F2FD', fg: '#0D47A1' };
  return { bg: '#E8F5E9', fg: '#2E7D32' };
}

export function riskFromResilience(resilience: Resilience): {
  label: string;
  tone: 'good' | 'fair' | 'watch';
} {
  if (resilience === 'high') return { label: 'Low risk', tone: 'good' };
  if (resilience === 'medium') return { label: 'Medium risk', tone: 'fair' };
  return { label: 'High risk', tone: 'watch' };
}
