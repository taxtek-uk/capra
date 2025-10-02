import { Section } from '@/components/Section';
import { Container } from '@/components/Container';
import { FadeIn } from '@/components/Motion';
import { 
  Target, 
  Award, 
  Users, 
  Globe, 
  Factory,
  Shield,
  CheckCircle,
  Star,
  Building,
  MapPin,
  Phone,
  Mail,
  Lightbulb,
  Heart,
  Handshake,
  Rocket,
  Eye,
  ArrowRight,
  Play,
  BarChart3,
  Layers,
  Settings
} from 'lucide-react';
import { useState } from 'react';

export const About = () => {
  const [activeTab, setActiveTab] = useState('story');
  const [playingVideo, setPlayingVideo] = useState(false);

  const team = [
    { 
      name: 'Jamshed Khan', 
      role: 'Chief Executive Officer', 
      email: 'jamshed@capra.pk',
      bio: 'Visionary leader with 15+ years in manufacturing excellence',
      image: '/images/img-placeholder.jpg'
    },
    { 
      name: 'Rizwan Khan', 
      role: 'Vice President Operations', 
      email: 'rizwan@capra.pk',
      bio: 'Expert in operational efficiency and quality management',
      image: '/images/img-placeholder.jpg'
    },
    { 
      name: 'Jan Shair Khan', 
      role: 'Director of Innovation', 
      email: 'janshair@capra.pk',
      bio: 'Leading R&D initiatives and product development',
      image: '/images/img-placeholder.jpg'
    },
    { 
      name: 'Salman Khan', 
      role: 'Director of Sales', 
      email: 'salman@capra.pk',
      bio: 'Driving global expansion and market development',
      image: '/images/img-placeholder.jpg'
    },
    { 
      name: 'Adnan Khan', 
      role: 'Director of Quality', 
      email: 'adnan@capra.pk',
      bio: 'Ensuring excellence in every product we manufacture',
      image: '/images/img-placeholder.jpg'
    },
  ];

  const milestones = [
    { 
      year: '2019', 
      title: 'Company Founded', 
      description: 'Salman Industries established with a vision to manufacture premium vacuum flasks and revolutionize the industry',
      icon: Rocket,
      color: 'bg-blue-500'
    },
    { 
      year: '2020', 
      title: 'Product Launch', 
      description: 'Successfully introduced CAPRA and PHOENIX brand vacuum thermos lines with cutting-edge technology',
      icon: Star,
      color: 'bg-green-500'
    },
    { 
      year: '2021', 
      title: 'Export Expansion', 
      description: 'Extended our global reach to international markets across Asia, Middle East, and beyond',
      icon: Globe,
      color: 'bg-purple-500'
    },
    { 
      year: '2022', 
      title: 'Quality Certification', 
      description: 'Achieved ISO 9001:2015 certification and multiple international quality standards',
      icon: Award,
      color: 'bg-orange-500'
    },
    { 
      year: '2023', 
      title: 'Innovation Hub', 
      description: 'Launched state-of-the-art R&D facility for advanced product development and testing',
      icon: Lightbulb,
      color: 'bg-indigo-500'
    },
    { 
      year: '2024', 
      title: 'Sustainability Initiative', 
      description: 'Implemented eco-friendly manufacturing processes and sustainable packaging solutions',
      icon: Layers,
      color: 'bg-emerald-500'
    },
  ];

  const stats = [
    { value: '50,000+', label: 'Happy Customers', icon: Users, color: 'text-blue-600' },
    { value: '25+', label: 'Countries Served', icon: Globe, color: 'text-green-600' },
    { value: '100+', label: 'Product Variants', icon: Settings, color: 'text-purple-600' },
    { value: '99%', label: 'Customer Satisfaction', icon: Star, color: 'text-orange-600' },
  ];

  const values = [
    {
      icon: Award,
      title: 'Quality First',
      description: 'Our unwavering commitment to delivering exceptional quality in every single product we manufacture',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Target,
      title: 'Honesty Foundation',
      description: 'Built on the bedrock of integrity, transparency, and ethical business practices in all our operations',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Professional R&D, production, and management teams dedicated to innovation and excellence',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Globe,
      title: 'Global Vision',
      description: 'Serving customers worldwide while maintaining local values and personalized service',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Lightbulb,
      title: 'Innovation Drive',
      description: 'Continuously pushing boundaries with cutting-edge technology and sustainable solutions',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Heart,
      title: 'Customer Focus',
      description: 'Every decision we make is centered around creating value and satisfaction for our customers',
      color: 'from-red-500 to-red-600'
    },
  ];

  const certifications = [
    { name: 'ISO 9001:2015', description: 'Quality Management System' },
    { name: 'FDA Approved', description: 'Food Safety Standards' },
    { name: 'CE Marking', description: 'European Conformity' },
    { name: 'LFGB Certified', description: 'German Food Safety' },
  ];

  const tabs = [
    { id: 'story', label: 'Our Story', icon: Building },
    { id: 'mission', label: 'Mission & Vision', icon: Eye },
    { id: 'values', label: 'Our Values', icon: Heart },
    { id: 'certifications', label: 'Certifications', icon: Shield },
  ];

  return (
    <div className="pt-16 md:pt-26 overflow-hidden">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <img
            src="https://d64gsuwffb70l.cloudfront.net/68dc5e5981e3945a0583e0bf_1759272697697_5e948d76.jpg"
            alt="CAPRA Manufacturing"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-blue-900/60 to-transparent"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <FadeIn>
                
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                    About CAPRA
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                  Established in 2019, Salman Industries designs, develops, manufactures and markets 
                  high-grade vacuum flasks, bottles and tableware. CAPRA and PHOENIX product lines 
                  are trusted across multiple countries.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 mb-12 hidden">
                  
                  <a
                    href="#team"
                    className="group px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    Meet Our Team
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </FadeIn>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <FadeIn key={index} delay={0.2 + index * 0.1}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                    <stat.icon className={`w-8 h-8 ${stat.color} mb-4 group-hover:scale-110 transition-transform`} />
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-blue-200 text-sm">{stat.label}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Enhanced Content Tabs */}
      <Section className="bg-white -mt-20 pt-32 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'story' && (
              <FadeIn>
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Our Story</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <p className="text-lg text-gray-700 leading-relaxed">
                        Founded in 2019 with a bold vision to revolutionize the vacuum flask industry, 
                        Salman Industries has grown from a small manufacturing unit to a globally 
                        recognized brand trusted by customers worldwide.
                      </p>
                      <p className="text-lg text-gray-700 leading-relaxed">
                        Our journey began with a simple belief: everyone deserves access to premium 
                        quality products that enhance their daily lives. Today, we manufacture over 
                        100 product variants under the CAPRA and PHOENIX brands.
                      </p>
                      <div className="flex items-center gap-4 pt-4">
                        <div className="flex items-center gap-2">
                          <Factory className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold">Modern Facility</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-green-600" />
                          <span className="font-semibold">Expert Team</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <img
                        src="https://d64gsuwffb70l.cloudfront.net/68dc5e5981e3945a0583e0bf_1759272697697_5e948d76.jpg"
                        alt="CAPRA Manufacturing Facility"
                        className="rounded-2xl shadow-2xl"
                      />
                      <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                        <div className="text-2xl font-bold text-blue-600">2019</div>
                        <div className="text-sm text-gray-600">Est.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {activeTab === 'mission' && (
              <FadeIn>
                <div className="max-w-4xl mx-auto text-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
                      <Eye className="w-12 h-12 text-blue-600 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                      <p className="text-gray-700 leading-relaxed">
                        To become the world's most trusted brand for premium vacuum flasks and 
                        thermal products, setting new standards for quality, innovation, and 
                        customer satisfaction.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
                      <Target className="w-12 h-12 text-green-600 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                      <p className="text-gray-700 leading-relaxed">
                        "To provide high-quality products. Quality is the first priority." 
                        We operate with modern enterprise systems and rigorous quality assurance 
                        to exceed customer expectations.
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-4">Our Commitment</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We operate with modern enterprise systems, strong R&D capabilities, and 
                      rigorous quality assurance processes to ensure every CAPRA product meets 
                      the highest standards of excellence and sustainability.
                    </p>
                  </div>
                </div>
              </FadeIn>
            )}

            {activeTab === 'values' && (
              <FadeIn>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {values.map((value, index) => (
                    <div key={index} className="group hover:scale-105 transition-all duration-300">
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-100 h-full">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <value.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-gray-900">{value.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            )}

            {activeTab === 'certifications' && (
              <FadeIn>
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-2xl font-bold text-center mb-8">Quality Certifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {certifications.map((cert, index) => (
                      <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{cert.name}</h4>
                            <p className="text-gray-600 text-sm">{cert.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center bg-blue-50 rounded-xl p-6">
                    <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-700">
                      All our products meet international safety and quality standards, 
                      ensuring complete peace of mind for our customers worldwide.
                    </p>
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </Section>

      {/* Enhanced Timeline */}
      <Section className="bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm mb-4">
              Our Journey
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Milestones & Achievements
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to global recognition - here's how we've grown over the years
            </p>
          </FadeIn>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-indigo-600"></div>
            
            {milestones.map((milestone, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="relative flex items-start gap-8 mb-12">
                  {/* Timeline Icon */}
                  <div className={`relative z-10 w-16 h-16 ${milestone.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <milestone.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-2xl font-bold text-blue-600">{milestone.year}</span>
                      <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* Enhanced Team Section */}
      <Section className="bg-white" id="team">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-semibold text-sm mb-4">
              Our Team
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Leadership Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the visionary leaders driving CAPRA's success and innovation
            </p>
          </FadeIn>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-2xl mx-auto object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-300 text-sm font-medium"
                  >
                    <Mail className="w-4 h-4" />
                    Contact
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Contact CTA Section */}
      <Section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="text-center max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to Partner with Us?
            </h2>
            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              Join thousands of satisfied customers worldwide. Experience the CAPRA difference today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="/contact"
                className="group px-10 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl shadow-2xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
              >
                <Handshake className="w-5 h-5" />
                Start Partnership
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/products"
                className="group px-10 py-4 bg-transparent border-2 border-white/50 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
              >
                <BarChart3 className="w-5 h-5" />
                View Products
              </a>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-blue-200">
              <div className="flex items-center justify-center gap-3">
                <Phone className="w-5 h-5" />
                <span>+1 (234) 567-8900</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Mail className="w-5 h-5" />
                <span>info@capra.com</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <MapPin className="w-5 h-5" />
                <span>Visit Our Facility</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>
    </div>
  );
};