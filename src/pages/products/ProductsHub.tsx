import { Link } from 'react-router-dom';
import { Section } from '@/components/Section';
import { Container } from '@/components/Container';
import { FadeIn, ScaleIn, SlideIn } from '@/components/Motion';
import { 
  ArrowRight, 
  Star, 
  Shield, 
  Thermometer, 
  Clock, 
  Package, 
  Award, 
  Zap, 
  Filter, 
  Search, 
  Grid, 
  List, 
  Heart, 
  ShoppingCart, 
  Eye, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Globe, 
  Sparkles,
  Play,
  Download,
  Share2,
  Bookmark
} from 'lucide-react';
import { useState } from 'react';

export const ProductsHub = () => {
  const [viewMode, setViewMode] = useState('grid'); // 1. Toggle view mode
  const [searchTerm, setSearchTerm] = useState(''); // 2. Search functionality
  const [selectedFilter, setSelectedFilter] = useState('all'); // 3. Filter categories
  const [favorites, setFavorites] = useState([]); // 4. Favorite products

  const categories = [
    {
      id: 'vacuum-thermos',
      title: 'Vacuum Thermos',
      subtitle: 'Premium Flask & Jug Series', // 5. Added subtitle
      description: 'Flask & Jug series with 1.0L to 3.0L capacity. Models: SLD-010, SLD-020, SLD-030, RIT-010, RIT-020',
      image: 'https://d64gsuwffb70l.cloudfront.net/68dc5e5981e3945a0583e0bf_1759272691247_061d9775.jpg',
      href: '/products/vacuum-thermos',
      badge: 'Best Seller', // 6. Product badges
      rating: 4.9, // 7. Star ratings
      reviews: 1250,
      price: 'From $29.99', // 8. Price display
      features: ['18+ Hours Hot/Cold', 'Unbreakable', 'Food Grade Steel'], // 9. Feature highlights
      colors: ['#2563eb', '#dc2626', '#f59e0b', '#64748b'], // 10. Color variants
      category: 'thermos'
    },
    {
      id: 'vacuum-bottle',
      title: 'Vacuum Bottle',
      subtitle: 'Daily Companion Series',
      description: 'Sleek daily bottles with stainless steel construction and multiple finish options',
      image: 'https://d64gsuwffb70l.cloudfront.net/68dc5e5981e3945a0583e0bf_1759272695082_c9af6d56.jpg',
      href: '/products/vacuum-bottle',
      badge: 'New Arrival',
      rating: 4.8,
      reviews: 890,
      price: 'From $19.99',
      features: ['Leak-Proof', 'Portable', 'Ergonomic Design'],
      colors: ['#2563eb', '#64748b', '#1e293b'],
      category: 'bottle'
    },
    {
      id: 'tumbler-thermos',
      title: 'Tumbler Thermos',
      subtitle: 'Office & Travel Collection',
      description: 'Double-wall tumblers perfect for desk and travel use',
      image: 'https://d64gsuwffb70l.cloudfront.net/68dc5e5981e3945a0583e0bf_1759272696385_2d57bc4c.jpg',
      href: '/products/tumbler-thermos',
      badge: 'Eco-Friendly',
      rating: 4.7,
      reviews: 650,
      price: 'From $15.99',
      features: ['Double-Wall', 'Stylish', 'Compact'],
      colors: ['#2563eb', '#dc2626', '#64748b'],
      category: 'tumbler'
    },
  ];

  const stats = [ // 11. Statistics section
    { icon: Users, value: '50K+', label: 'Happy Customers' },
    { icon: Globe, value: '25+', label: 'Countries' },
    { icon: Award, value: '99%', label: 'Satisfaction' },
    { icon: TrendingUp, value: '5+', label: 'Years Excellence' }
  ];

  const filters = [ // 12. Filter options
    { id: 'all', label: 'All Products' },
    { id: 'thermos', label: 'Thermos' },
    { id: 'bottle', label: 'Bottles' },
    { id: 'tumbler', label: 'Tumblers' }
  ];

   

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || category.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="pt-16 md:pt-26 overflow-hidden">
      {/* 14. Enhanced Hero Section with Video Background */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* 15. Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl animate-spin-slow"></div>
        </div>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <FadeIn>
                {/* 16. Trust indicators */}
                 
                
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent drop-shadow-2xl">
                    Our Products
                  </span>
                </h1>
                
                <p className="text-2xl md:text-3xl mb-4 text-blue-100 font-light">
                  Premium Thermal Solutions
                </p>
                <p className="text-lg md:text-xl mb-10 text-white/80 max-w-2xl leading-relaxed">
                  Explore our comprehensive range of premium vacuum flasks, bottles, and thermal solutions 
                  designed for everyday performance and built to last a lifetime.
                </p>
                
                {/* 17. Action buttons with icons */}
                 
              </FadeIn>
            </div>

            {/* 18. Statistics grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <FadeIn key={index} delay={0.2 + index * 0.1}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                    <stat.icon className="w-8 h-8 text-blue-300 mb-4 group-hover:scale-110 transition-transform" />
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-blue-200 text-sm">{stat.label}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 19. Search and Filter Section */}
      <Section className="bg-white -mt-20 pt-32 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
            {/* 20. Search bar with icon */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* 21. Filter buttons */}
            <div className="flex gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedFilter === filter.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* 22. View mode toggle */}
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 23. Products Grid/List */}
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredCategories.map((category, index) => (
              <ScaleIn key={category.id} delay={index * 0.1}>
                <div className={`group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 shadow-lg hover:shadow-2xl hover:border-blue-200 transition-all duration-500 hover:-translate-y-2 ${
                  viewMode === 'list' ? 'flex gap-6' : ''
                }`}>
                  {/* 24. Enhanced image section */}
                  <div className={`relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden ${
                    viewMode === 'list' ? 'w-64 h-48' : 'aspect-[4/3]'
                  }`}>
                    <img 
                      src={category.image} 
                      alt={category.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    
                    {/* 25. Overlay actions */}
                    

                    {/* 26. Product badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                        category.badge === 'Best Seller' ? 'bg-green-500' :
                        category.badge === 'New Arrival' ? 'bg-blue-500' :
                        'bg-purple-500'
                      }`}>
                        {category.badge}
                      </span>
                    </div>

                    {/* 27. Color variants */}
                    <div className="absolute bottom-4 right-4 flex gap-1">
                      {category.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-6 flex-1">
                    {/* 28. Enhanced content section */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{category.title}</h3>
                        <p className="text-blue-600 font-medium text-sm">{category.subtitle}</p>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bookmark className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    {/* 29. Rating and reviews */}
                    

                    <p className="text-gray-600 mb-4 leading-relaxed">{category.description}</p>

                    {/* Feature highlights */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {category.features.map((feature, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>

                     
                  </div>
                </div>
              </ScaleIn>
            ))}
          </div>

          {/* No results message */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
};