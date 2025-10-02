export const siteConfig = {
  name: 'CAPRA',
  tagline: 'Make Life Easy.',
  description: 'Premium vacuum flasks, bottles, and thermal jugs manufacturer',
  url: 'https://capra.pk',
  contact: {
    email: 'info@capra.pk',
    phone: '+92 55 4253697',
    whatsapp: '+92 311 007 5000',
    address: 'Makki Road Jinnah Colony on Same Nala, Gujranwala Pakistan',
  },
  social: {
    facebook: 'https://facebook.com/capra.pk',
    whatsapp: 'https://wa.me/923110075000',
  },
  navigation: [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { 
      name: 'Products', 
      href: '/products',
      children: [
        { name: 'Vacuum Thermos', href: '/products/vacuum-thermos' },
        { name: 'Vacuum Bottle', href: '/products/vacuum-bottle' },
        { name: 'Tumbler Thermos', href: '/products/tumbler-thermos' },
      ]
    },
    { name: 'Contact', href: '/contact' },
  ],
}
