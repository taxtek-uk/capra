import { Link } from "react-router-dom";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { FeatureCard } from "@/components/FeatureCard";
import { ProductCard } from "@/components/ProductCard";
import { Stat } from "@/components/Stat";
import { FadeIn, SlideIn } from "@/components/Motion";
import {
  Shield,
  Thermometer,
  Sparkles,
  Package,
  Clock,
  Award,
  Quote,
  Star,
  CheckCircle,
  ArrowRight,
  Users,
  Globe,
  Zap,
} from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useState, useEffect } from "react";

export const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroImages = [
    "https://d64gsuwffb70l.cloudfront.net/68dc5e5981e3945a0583e0bf_1759272714430_a7eeef76.webp",
    "https://d64gsuwffb70l.cloudfront.net/68dc5e5981e3945a0583e0bf_1759272691247_061d9775.jpg",
    "https://d64gsuwffb70l.cloudfront.net/68dc5e5981e3945a0583e0bf_1759272695082_c9af6d56.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const achievements = [
    { icon: Users, value: "50K+", label: "Happy Customers" },
    { icon: Globe, value: "25+", label: "Countries Served" },
    { icon: Award, value: "99%", label: "Customer Satisfaction" },
    { icon: Zap, value: "5", label: "Years Excellence" }
  ];

  return (
    <div className="pt-16 md:pt-26 overflow-hidden">
      {/* Enhanced Hero Section with Carousel */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-30" : "opacity-0"
              }`}
            >
              <img
                src={image}
                alt={`CAPRA Products ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl animate-spin-slow"></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl text-white">
             
            
            <FadeIn delay={0.1}>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent drop-shadow-2xl">
                  CAPRA
                </span>
                <br />
                <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-white/90">
                  Thermos Vacuum Flask
                </span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <p className="text-2xl md:text-3xl mb-4 text-blue-100 font-light">
                Premium Hot & Cool Bottles Manufacturer
              </p>
              <p className="text-lg md:text-xl mb-10 text-white/80 max-w-2xl leading-relaxed">
                Experience unmatched temperature retention with our revolutionary vacuum insulation technology. 
                Built for life, designed for excellence.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <Link
                  to="/products"
                  className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  Explore Products
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
              </div>
            </FadeIn>

            {/* Hero Stats */}
            <FadeIn delay={0.6}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => (
                  <div key={index} className="text-center group">
                    <achievement.icon className="w-8 h-8 mx-auto mb-2 text-blue-300 group-hover:text-white transition-colors" />
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{achievement.value}</div>
                    <div className="text-sm text-white/70">{achievement.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </Container>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <Section className="bg-gradient-to-b from-white to-gray-50 -mt-20 pt-32 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Stat
              value="18+"
              label="Hours Hot/Cold Retention"
              icon={<Clock className="w-10 h-10" />}
            />
            <Stat
              value="100%"
              label="Food-Grade Stainless Steel"
              icon={<Shield className="w-10 h-10" />}
              delay={0.1}
            />
            <Stat
              value="3"
              label="Capacity Options Available"
              icon={<Package className="w-10 h-10" />}
              delay={0.2}
            />
          </div>
        </div>
      </Section>

      {/* Enhanced Why CAPRA Section */}
      <Section className="bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm mb-4">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose CAPRA
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Premium quality vacuum flasks engineered for everyday performance with cutting-edge technology and sustainable materials
            </p>
          </FadeIn>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={Award}
            title="Best Quality Guaranteed"
            description="Rigorous quality control with international certifications ensures every product exceeds industry standards"
             
          />
          <FeatureCard
            icon={Shield}
            title="High-Grade Stainless Steel"
            description="Premium 304 food-grade stainless steel with antimicrobial properties for ultimate safety and durability"
            delay={0.1}
             
          />
          <FeatureCard
            icon={Sparkles}
            title="Unbreakable Design"
            description="Military-grade construction with impact-resistant technology designed to withstand extreme conditions"
            delay={0.2}
             
          />
          <FeatureCard
            icon={Thermometer}
            title="Advanced Insulation"
            description="Revolutionary double-wall vacuum insulation maintains perfect temperature for up to 18+ hours"
            delay={0.3}
             
          />
        </div>
      </Section>

      {/* Enhanced Featured Products */}
      <Section className="bg-white">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-semibold text-sm mb-4">
              Our Products
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Premium Product Lines
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our comprehensive range of vacuum flasks and bottles, each designed with precision engineering and premium materials
            </p>
          </FadeIn>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <ProductCard
            id="vt"
            title="Vacuum Thermos"
            capacity="1.0L - 3.0L"
            image="https://d64gsuwffb70l.cloudfront.net/68dc5e5981e3945a0583e0bf_1759272691247_061d9775.jpg"
            badges={["Hot & Cool", "Unbreakable", "18+ Hours"]}
            colors={["#2563eb", "#dc2626", "#f59e0b", "#64748b"]}
            href="/products/vacuum-thermos"
             
          />
          <ProductCard
            id="vb"
            title="Vacuum Bottle"
            capacity="500ml - 1.0L"
            image="https://d64gsuwffb70l.cloudfront.net/68dc5e5981e3945a0583e0bf_1759272695082_c9af6d56.jpg"
            badges={["Portable", "Leak-Proof", "Ergonomic"]}
            colors={["#2563eb", "#64748b", "#1e293b"]}
            href="/products/vacuum-bottle"
            delay={0.1}
            
          />
          <ProductCard
            id="tt"
            title="Tumbler Thermos"
            capacity="350ml - 500ml"
            image="https://d64gsuwffb70l.cloudfront.net/68dc5e5981e3945a0583e0bf_1759272696385_2d57bc4c.jpg"
            badges={["Double-Wall", "Stylish", "Compact"]}
            colors={["#2563eb", "#dc2626", "#64748b"]}
            href="/products/tumbler-thermos"
            delay={0.2}
             
          />
        </div>
      </Section>

      {/* Enhanced Brand Story Section */}
      <Section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <SlideIn direction="left">
            <div className="space-y-8">
              <div>
                <span className="inline-block px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full font-semibold text-sm mb-4">
                  Our Story
                </span>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Crafting Excellence Since 2019
                </h2>
              </div>
              
              <div className="space-y-6 text-lg text-blue-100 leading-relaxed">
                <p>
                  Salman Industries designs, develops, and manufactures high-grade vacuum flasks under the 
                  <span className="font-semibold text-white"> CAPRA</span> and 
                  <span className="font-semibold text-white"> PHOENIX</span> brands. Our commitment to quality 
                  and innovation has made us a trusted name across multiple countries.
                </p>
                <p>
                  Guided by <span className="font-semibold text-white">"Quality first"</span> and 
                  <span className="font-semibold text-white"> "Honesty as foundation,"</span> we operate with 
                  modern enterprise systems and rigorous quality controls that exceed international standards.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-900 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Learn More About Us
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-all duration-300"
                >
                  <CheckCircle className="w-5 h-5" />
                  View Certifications
                </Link>
              </div>
            </div>
          </SlideIn>
          
          <SlideIn direction="right">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-2xl opacity-20"></div>
              <img
                src="https://d64gsuwffb70l.cloudfront.net/68dc5e5981e3945a0583e0bf_1759272697697_5e948d76.jpg"
                alt="CAPRA Manufacturing Excellence"
                className="relative rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </SlideIn>
        </div>
      </Section>

      {/* Enhanced Testimonials Section */}
      <Section className="bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands of satisfied customers worldwide
            </p>
          </FadeIn>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              text: "CAPRA flasks are a staple in our retail stores — durable, stylish, and our customers absolutely love them. The quality is unmatched.",
              author: "Ali Khan",
              role: "Retail Partner",
              rating: 5,
              company: "Khan Retail Group"
            },
            {
              text: "We've trusted CAPRA for corporate gifting for over 3 years, and the feedback has been excellent every single time. Outstanding quality!",
              author: "Sarah Ahmed",
              role: "Procurement Manager",
              rating: 5,
              company: "Tech Solutions Inc."
            },
            {
              text: "From design to delivery, CAPRA's professionalism and quality is unmatched. They've been our go-to supplier for premium flasks.",
              author: "James Smith",
              role: "International Distributor",
              rating: 5,
              company: "Global Trade Partners"
            },
          ].map((testimonial, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-2">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star key={starIndex} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="w-10 h-10 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <h4 className="font-bold text-gray-900 text-lg">{testimonial.author}</h4>
                  <p className="text-blue-600 font-medium">{testimonial.role}</p>
                  <p className="text-gray-500 text-sm">{testimonial.company}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Enhanced FAQ Section */}
      <Section className="bg-white">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-semibold text-sm mb-4">
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about our premium vacuum flasks and services
            </p>
          </FadeIn>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="q1" className="border border-gray-200 rounded-xl px-6 hover:shadow-lg transition-shadow">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-blue-600 transition-colors">
                How long do CAPRA flasks keep beverages hot/cold?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base leading-relaxed pt-2">
                Our advanced vacuum insulation technology ensures beverages stay hot or cold for up to 18+ hours. 
                Hot beverages maintain temperature for 12-18 hours, while cold beverages stay chilled for up to 24 hours.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="q2" className="border border-gray-200 rounded-xl px-6 hover:shadow-lg transition-shadow">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-blue-600 transition-colors">
                Are the flasks made of safe materials?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base leading-relaxed pt-2">
                Absolutely! All CAPRA products are made from premium food-grade 304 stainless steel with zero harmful 
                coatings or BPA. Our materials meet international safety standards and are completely safe for daily use.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="q3" className="border border-gray-200 rounded-xl px-6 hover:shadow-lg transition-shadow">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-blue-600 transition-colors">
                Do you offer bulk or corporate orders?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base leading-relaxed pt-2">
                Yes! We specialize in bulk, wholesale, and customized corporate orders with branding options. 
                We offer competitive pricing for large orders and can customize products with your company logo and colors.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="q4" className="border border-gray-200 rounded-xl px-6 hover:shadow-lg transition-shadow">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-blue-600 transition-colors">
                What warranty do you provide?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base leading-relaxed pt-2">
                We provide a comprehensive 2-year warranty on all CAPRA products covering manufacturing defects. 
                Our customer service team is always ready to assist with any issues or concerns.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="q5" className="border border-gray-200 rounded-xl px-6 hover:shadow-lg transition-shadow">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-blue-600 transition-colors">
                How can I place an order?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base leading-relaxed pt-2">
                You can explore our products online and reach out to our sales team through the Contact page for 
                bulk or retail inquiries. We also work with authorized distributors worldwide for easy access.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Section>

      {/* Enhanced CTA Section */}
      <Section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-center py-20 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Ready to Elevate Your 
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Beverage Experience?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
              Partner with CAPRA for world-class thermos and vacuum flask solutions. 
              Join thousands of satisfied customers worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/contact"
                className="group px-12 py-5 bg-white text-blue-600 font-bold text-lg rounded-2xl shadow-2xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
              >
                Get in Touch Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products"
                className="group px-12 py-5 bg-transparent border-2 border-white/50 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
              >
                <Package className="w-5 h-5" />
                View All Products
              </Link>
            </div>
            
            <div className="mt-12 flex justify-center items-center gap-8 text-blue-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Free Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Custom Branding</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Worldwide Shipping</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>
    </div>
  );
};

// Add these CSS animations to your global styles
const styles = `
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-30px); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}
`;
