import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import sdg12Icon from "@/assets/sdg-12.png";
import sdg12Ils from "@/assets/sdg-12-ils.png";
import sdg2Icon from "@/assets/sdg-2.png";
import sdg2Ils from "@/assets/sdg-2-ils.png";

export function EcoImpact() {
  return (
    <section
      id="eco-impact"
      className="py-10 lg:py-20 bg-[#F5F5F5] px-4 lg:px-[130px]"
    >
      <div className="max-w-3xl mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-sm font-bold text-palette-600 tracking-widest uppercase mb-4">
            Eco Impact
          </h2>
          <h3 className="text-3xl lg:text-5xl font-bold text-primary-900 leading-[1.15] tracking-tight">
            Small actions, global impact.
          </h3>
          <p className="text-gray-600 leading-relaxed text-base lg:text-lg mt-6 max-w-2xl">
            FoodUnity is built on the foundation of the United Nations
            Sustainable Development Goals. Every meal you save directly
            contributes to a healthier planet.
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        <motion.div
          className="relative p-8 rounded-3xl shadow-sm border border-gray-100/20 overflow-hidden flex flex-col justify-end min-h-[300px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={sdg12Ils}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#BF8B2E]/60 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#BF8B2E]/90 via-[#BF8B2E]/40 to-transparent"></div>
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 flex items-center justify-center mb-6 overflow-hidden">
              <img
                src={sdg12Icon}
                alt="SDG 12 Icon"
                className="w-full h-full object-contain"
              />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">
              SDG 12: Responsible Consumption
            </h4>
            <p className="text-white/80 leading-relaxed">
              We help reduce global food waste at the retail and consumer
              levels, creating a more sustainable production lifecycle.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="relative p-8 rounded-3xl shadow-sm border border-gray-100/20 overflow-hidden flex flex-col justify-end min-h-[300px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={sdg2Ils}
              alt="Background SDG 2"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#CF9C05]/60 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#CF9C05]/90 via-[#CF9C05]/40 to-transparent"></div>
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 flex items-center justify-center mb-6 overflow-hidden">
              <img
                src={sdg2Icon}
                alt="SDG 2 Icon"
                className="w-full h-full object-contain"
              />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">
              SDG 2: Zero Hunger
            </h4>
            <p className="text-white/80 leading-relaxed">
              By connecting surplus food with communities in need, we ensure
              perfectly good food feeds people, not landfills.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="relative p-8 rounded-3xl shadow-lg overflow-hidden flex flex-col justify-end min-h-[300px] text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Background styling for SDG 13 Theme */}
          <div className="absolute inset-0 z-0 bg-[#3F7E44]"></div>
          {/* Faded large icon in the background to simulate an illustration */}
          <div className="absolute -bottom-6 -right-6 opacity-[0.15] z-0 pointer-events-none transform -rotate-12">
            <Leaf className="w-64 h-64 text-white" />
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#2c5c30] to-transparent mix-blend-multiply"></div>

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                <Leaf className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-3">SDG 13: Climate Action</h4>
              <p className="text-white/80 leading-relaxed">
                Food waste generates significant greenhouse gases. Saving just 1
                kg of food prevents approximately 2.5 kg of CO₂ emissions.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">1:2.5</span>
                <span className="text-white/80 font-medium">ratio</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
