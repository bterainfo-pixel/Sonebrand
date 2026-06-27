export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  tag?: string;
  sizes: string[];
  colors?: { name: string; image: string; hex: string }[];
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Black Oversized Hoodie',
    price: 89000,
    category: 'hoodie',
    images: ['https://picsum.photos/seed/sb01a/600/800', 'https://picsum.photos/seed/sb01b/600/800'],
    tag: 'NEW',
    sizes: ['XS','S','M','L','XL'],
    colors: [
      { name: 'BLACK', image: 'https://picsum.photos/seed/sb01a/600/800', hex: '#000000' },
      { name: 'GRAY', image: 'https://picsum.photos/seed/sb01c/600/800', hex: '#808080' },
    ],
    description: 'Маш тухтай, өргөн загварын юүдэнтэй цамц. Өдөр тутмын хэрэглээнд төгс зохицно.'
  },
  {
    id: '2',
    name: 'White Graphic Tee',
    price: 55000,
    category: 'tshirt',
    images: ['https://picsum.photos/seed/sb02a/600/800', 'https://picsum.photos/seed/sb02b/600/800'],
    tag: 'BEST SELLER',
    sizes: ['S','M','L','XL'],
    colors: [
      { name: 'WHITE', image: 'https://picsum.photos/seed/sb02a/600/800', hex: '#ffffff' },
      { name: 'BEIGE', image: 'https://picsum.photos/seed/sb02c/600/800', hex: '#f5f5dc' },
    ],
    description: '100% даавуун материалтай, зуны өдрүүдэд өмсөхөд сэрүүхэн загварлаг футболк.'
  },
  {
    id: '3',
    name: 'Cargo Pants',
    price: 79000,
    category: 'pants',
    images: ['https://picsum.photos/seed/sb03a/600/800', 'https://picsum.photos/seed/sb03b/600/800'],
    sizes: ['S','M','L','XL','XXL'],
    colors: [
      { name: 'OLIVE', image: 'https://picsum.photos/seed/sb03a/600/800', hex: '#556b2f' },
      { name: 'KHAKI', image: 'https://picsum.photos/seed/sb03c/600/800', hex: '#f0e68c' },
    ],
    description: 'Эвтэйхэн, удаан эдэлгээтэй карго өмд. Streetwear стилийн хамгийн тохиромжтой сонголт.'
  },
  {
    id: '4',
    name: 'Bomber Jacket',
    price: 129000,
    category: 'jacket',
    images: ['https://picsum.photos/seed/sb04a/600/800', 'https://picsum.photos/seed/sb04b/600/800'],
    tag: 'LIMITED',
    sizes: ['M','L','XL'],
    colors: [
      { name: 'NAVY', image: 'https://picsum.photos/seed/sb04a/600/800', hex: '#000080' },
      { name: 'BLACK', image: 'https://picsum.photos/seed/sb04c/600/800', hex: '#000000' },
    ],
    description: 'Сонгодог бомбер хүрэм. Өвлийн болон намрын улиралд тохиромжтой.'
  },
  {
    id: '5',
    name: 'All Black Longsleeve',
    price: 65000,
    category: 'tshirt',
    images: ['https://picsum.photos/seed/sb05a/600/800', 'https://picsum.photos/seed/sb05b/600/800'],
    sizes: ['XS','S','M','L','XL'],
    colors: [
      { name: 'BLACK', image: 'https://picsum.photos/seed/sb05a/600/800', hex: '#000000' },
    ],
    description: 'Зөөлөн материалтай, биед эвтэйхэн лонгслив.'
  },
  {
    id: '6',
    name: 'Zip-Up Hoodie',
    price: 95000,
    category: 'hoodie',
    images: ['https://picsum.photos/seed/sb06a/600/800', 'https://picsum.photos/seed/sb06b/600/800'],
    tag: 'NEW',
    sizes: ['S','M','L','XL'],
    colors: [
      { name: 'GRAY', image: 'https://picsum.photos/seed/sb06a/600/800', hex: '#808080' },
      { name: 'BLACK', image: 'https://picsum.photos/seed/sb06c/600/800', hex: '#000000' },
    ],
    description: 'Цахилгаантай, өдөр тутам өмсөхөд тохиромжтой худи.'
  },
  {
    id: '7',
    name: 'Jogger Pants',
    price: 69000,
    category: 'pants',
    images: ['https://picsum.photos/seed/sb07a/600/800', 'https://picsum.photos/seed/sb07b/600/800'],
    sizes: ['S','M','L','XL','XXL'],
    colors: [
      { name: 'CHARCOAL', image: 'https://picsum.photos/seed/sb07a/600/800', hex: '#36454f' },
    ],
    description: 'Дасгал хийх болон чөлөөт цагаараа өмсөхөд тохиромжтой жоггер.'
  },
  {
    id: '8',
    name: 'Windbreaker Jacket',
    price: 110000,
    category: 'jacket',
    images: ['https://picsum.photos/seed/sb08a/600/800', 'https://picsum.photos/seed/sb08b/600/800'],
    tag: 'BEST SELLER',
    sizes: ['M','L','XL'],
    colors: [
      { name: 'BLACK', image: 'https://picsum.photos/seed/sb08a/600/800', hex: '#000000' },
      { name: 'WHITE', image: 'https://picsum.photos/seed/sb08c/600/800', hex: '#ffffff' },
    ],
    description: 'Салхины хамгаалалттай, хөнгөн хүрэм.'
  },
];

export const categories: Category[] = [
  { id: 'hoodie',  name: 'HOODIE COLLECTION', image: 'https://picsum.photos/seed/cat01/800/600' },
  { id: 'tshirt',  name: 'GRAPHIC TEES',       image: 'https://picsum.photos/seed/cat02/800/600' },
  { id: 'pants',   name: 'PANTS',               image: 'https://picsum.photos/seed/cat03/800/600' },
  { id: 'jacket',  name: 'JACKETS',             image: 'https://picsum.photos/seed/cat04/800/600' },
];

export const navLinks = [
  { label: 'НҮҮР',          href: '/' },
  { label: 'БАРАА',         href: '/products' },
  { label: 'LOGISTIC',      href: '/logistic' },
  { label: 'БИДНИЙ ТУХАЙ',  href: '/about' },
  { label: 'FAQ',           href: '/faq' },
];
