import Hero from "../components/Hero/Hero";
import Featured from "../components/Hero/Featured";
import Shipping from "../components/Hero/Shipping";
import Products from "./Products";
import Footer from "../components/Hero/Footer";

export default function Home() {
  return (
    <div>
      <Hero />
      <Featured />
      <div className="pt-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Designed to Represent
        </h2>
        <p className="text-lg text-gray-700">Merch that moves with you.</p>
      </div>
      <div id="products-section" className="pt-28">
        <Products />
      </div>
      {/* Shipping section below products, full width and bigger */}
      <div className="w-full pt-20 pb-10">
        <Shipping />
      </div>
      <Footer />
    </div>
  );
}
