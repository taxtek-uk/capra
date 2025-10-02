import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { ProductsHub } from './pages/products/ProductsHub';
import { VacuumThermos } from './pages/products/VacuumThermos';
import { VacuumBottle } from './pages/products/VacuumBottle';
import { TumblerThermos } from './pages/products/TumblerThermos';
import { ComingSoon } from './pages/ComingSoon';
import { Quality } from './pages/Quality';
import { Career } from './pages/Career';

// 👉 NEW: support pages
import { Help } from './pages/Help';
import { Warranty } from './pages/Warranty';
import { Returns } from './pages/Returns';
import { Shipping } from './pages/Shipping';
import { SizeGuide } from './pages/SizeGuide';
import { Care } from './pages/Care';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

            {/* Products */}
            <Route path="/products" element={<ProductsHub />} />
            <Route path="/products/vacuum-thermos" element={<VacuumThermos />} />
            <Route path="/products/vacuum-bottle" element={<VacuumBottle />} />
            <Route path="/products/tumbler-thermos" element={<TumblerThermos />} />

            {/* Core pages */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/quality" element={<Quality />} />

            {/* Careers (both paths supported) */}
            <Route path="/careers" element={<Career />} />
            <Route path="/career" element={<Career />} />

            {/* Support hub pages */}
            <Route path="/help" element={<Help />} />
            <Route path="/warranty" element={<Warranty />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/size-guide" element={<SizeGuide />} />
            <Route path="/care" element={<Care />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
