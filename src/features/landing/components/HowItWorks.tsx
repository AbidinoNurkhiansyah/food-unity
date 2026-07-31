import { Store, HandHeart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import hiw1 from "@/assets/hiw-1.svg";
import hiw2 from "@/assets/hiw-2.svg";
import hiw3 from "@/assets/hiw-3.svg";
export function HowItWorks() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <section
      id="how-it-works"
      className="py-10 lg:py-20 bg-white px-4 lg:px-[130px] overflow-hidden"
    >
      <motion.div
        className="max-w-3xl mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-sm font-bold text-primary-500 tracking-widest uppercase mb-4">
          How It Works
        </h2>
        <h3 className="text-3xl lg:text-5xl font-bold text-primary-900 leading-[1.15] tracking-tight">
          Three steps to rescue perfectly good food.
        </h3>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-10 lg:gap-12 relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Connector Line (Desktop only) */}
        <motion.div
          className="hidden md:block absolute top-7 left-[4rem] right-[4rem] h-[2px] bg-gray-100 z-0 origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        />

        {/* Step 1 */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-2 relative z-10"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#F5F5F5] text-primary-900 flex items-center justify-center font-bold text-2xl">
            1
          </div>

          <div>
            <img
              src={hiw1}
              alt="Find Near You Illustration"
              className="w-full max-h-[150px] h-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-500 -mt-2"
            />
            <h4 className="text-xl font-bold text-primary-900 mb-3">
              Find Near You
            </h4>
            <p className="text-gray-500 leading-relaxed text-base lg:text-lg">
              Open the app and discover local bakeries, cafes, and restaurants
              offering surplus food at a discount or for free.
            </p>
          </div>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-6 relative z-10"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#F5F5F5] text-primary-900 flex items-center justify-center font-bold text-2xl">
            2
          </div>
          <div>
            <img
              src={hiw2}
              alt="Find Near You Illustration"
              className="w-full max-h-[200px] h-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-500 -mt-2"
            />
            <h4 className="text-xl font-bold text-primary-900 mb-3">
              Claim Your Food
            </h4>
            <p className="text-gray-500 leading-relaxed text-base lg:text-lg">
              Secure your meal by claiming it through the app. Your order is
              locked in, preventing double-booking.
            </p>
          </div>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-6 relative z-10"
        >
          <div className="w-14 h-14 rounded-2xl bg-palette-700 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-palette-700/30">
            3
          </div>
          <div>
            <img
              src={hiw3}
              alt="Find Near You Illustration"
              className="w-full max-h-[200px] h-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-500 -mt-2"
            />
            <h4 className="text-xl font-bold text-primary-900 mb-3">
              Pick Up in Store
            </h4>
            <p className="text-gray-500 leading-relaxed text-base lg:text-lg">
              Show your claim code at the store before the pickup window closes.
              Save money and help the planet.
            </p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-20 p-8 lg:p-14 bg-[#F5F5F5] rounded-3xl grid md:grid-cols-2 items-center gap-10 lg:gap-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div>
          <h4 className="text-2xl lg:text-3xl font-bold text-primary-900 mb-4 leading-tight">
            Have surplus food to share?
          </h4>
          <p className="text-gray-600 leading-relaxed mb-8 text-base lg:text-lg">
            Whether you're a business recovering costs or an individual donating
            extra meals, list your perfectly good food in seconds and let our
            community pick it up.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 font-bold text-primary-500 hover:text-primary-600 transition-colors underline underline-offset-8 decoration-2 decoration-primary-500/30 hover:decoration-primary-500 group"
          >
            Start Sharing Food{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:gap-6">
          <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm flex flex-col gap-4 transition-transform hover:-translate-y-1">
            <Store className="w-8 h-8 lg:w-10 lg:h-10 text-primary-500" />
            <span className="font-bold text-primary-900 text-lg">
              List Surplus
            </span>
          </div>
          <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm flex flex-col gap-4 translate-y-4 lg:translate-y-8 transition-transform hover:translate-y-3 lg:hover:translate-y-7">
            <HandHeart className="w-8 h-8 lg:w-10 lg:h-10 text-primary-500" />
            <span className="font-bold text-primary-900 text-lg">
              Reduce Waste
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
