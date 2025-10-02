export type Product = {
  id: string;
  family: 'vacuum-thermos' | 'vacuum-bottle' | 'tumbler-thermos';
  title: string;
  model?: string;
  capacity?: string;
  mode?: 'Simple' | 'Push';
  materials?: string[];
  features?: string[];
  colors?: string[];
  images?: string[];
  badges?: string[];
  specs?: Record<string, string>;
};

export const products: Product[] = [
  {
    id: 'sld-010',
    family: 'vacuum-thermos',
    title: 'CAPRA Vacuum Jug',
    model: 'SLD-010',
    capacity: '1.0L',
    mode: 'Simple',
    materials: ['Stainless Steel', 'BPA-Free'],
    features: ['Unbreakable', 'Hot & Cool', 'Easy Clean'],
    colors: ['#2563eb', '#dc2626', '#f59e0b', '#64748b'],
    badges: ['Hot & Cool', 'Unbreakable'],
    specs: {
      'Type': 'Vacuum Jug',
      'Capacity': '1.0 Liter',
      'Mode': 'Simple Pour',
      'Material': 'Stainless Steel (In & Out)',
    },
  },
  {
    id: 'sld-020',
    family: 'vacuum-thermos',
    title: 'CAPRA Vacuum Flask',
    model: 'SLD-020',
    capacity: '2.0L',
    mode: 'Simple',
    materials: ['Stainless Steel', 'BPA-Free'],
    features: ['Unbreakable', 'Hot & Cool', 'Easy Clean'],
    colors: ['#2563eb', '#dc2626', '#f59e0b', '#64748b'],
    badges: ['Hot & Cool', 'Unbreakable'],
  },
  {
    id: 'sld-030',
    family: 'vacuum-thermos',
    title: 'CAPRA Vacuum Flask',
    model: 'SLD-030',
    capacity: '3.0L',
    mode: 'Push',
    materials: ['Stainless Steel', 'BPA-Free'],
    features: ['Unbreakable', 'Hot & Cool', 'Push Button'],
    colors: ['#2563eb', '#dc2626', '#f59e0b', '#64748b'],
    badges: ['Hot & Cool', 'Push Button'],
  },
  {
    id: 'rit-010',
    family: 'vacuum-thermos',
    title: 'CAPRA Vacuum Flask',
    model: 'RIT-010',
    capacity: '1.0L',
    mode: 'Push',
    materials: ['Stainless Steel', 'BPA-Free'],
    features: ['Unbreakable', 'Hot & Cool', 'Push Button'],
    colors: ['#2563eb', '#dc2626', '#f59e0b', '#64748b'],
    badges: ['Hot & Cool', 'Push Button'],
  },
  {
    id: 'rit-020',
    family: 'vacuum-thermos',
    title: 'CAPRA Vacuum Jug',
    model: 'RIT-020',
    capacity: '3.0L',
    mode: 'Push',
    materials: ['Stainless Steel', 'BPA-Free'],
    features: ['Unbreakable', 'Hot & Cool', 'Push Button'],
    colors: ['#2563eb', '#dc2626', '#f59e0b', '#64748b'],
    badges: ['Hot & Cool', 'Push Button'],
  },
];

export const getProductsByFamily = (family: Product['family']) => {
  return products.filter(p => p.family === family);
};

export const getProductById = (id: string) => {
  return products.find(p => p.id === id);
};
