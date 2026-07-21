import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import authIlustration from "@/assets/auth-ilustration.webp";

export function HeroSection() {
  return (
    <main className="bg-[#F5F5F5] px-4 lg:px-[130px] py-10 lg:py-16 mx-auto grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
      {/* Left Content */}
      <div className="space-y-5 z-10 relative">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-gray-100 rounded-full opacity-50 blur-3xl -z-10"></div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1 items-center">
            <div className="w-2.5 h-2.5 bg-primary-500 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-primary-900 rounded-r-full -ml-1"></div>
          </div>
          <span className="font-bold text-gray-600 tracking-wide text-xs lg:text-sm uppercase">
            Elevate Your Brand With Us
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] xl:text-[3rem] font-bold text-primary-900 leading-[1.15] tracking-tight">
          Sustain the Planet, <br />
          Feed the Community <br />
          with
          <span className="text-primary-500"> FoodUnity</span>
        </h1>

        <p className="text-base lg:text-lg text-gray-500 max-w-lg leading-relaxed pt-1">
          Get surplus food, products nearing their expiration date, and staples
          at deeply discounted prices. You can also share food for free with
          those in need.
        </p>

        <div className="flex flex-wrap items-center gap-4 lg:gap-6 pt-4">
          <Link to="/login">
            <Button className="bg-primary-500 hover:bg-primary-600 text-white rounded-full px-6 lg:px-8 h-12 flex items-center gap-2 text-sm lg:text-base font-bold transition-all group shadow-lg shadow-primary-500/20">
              Explore More{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a
            href="#"
            className="font-bold text-sm lg:text-base text-primary-900 hover:text-primary-500 transition-colors underline underline-offset-4 decoration-2 decoration-gray-300 hover:decoration-primary-500"
          >
            View All Services
          </a>
        </div>
      </div>

      {/* Right Images (Collage) */}
      <div className="relative h-[280px] lg:h-[380px] xl:h-[420px] w-full mt-8 lg:-mt-4 flex gap-4">
        {/* Decorative elements */}
        <div className="absolute -top-4 right-10 flex gap-2 opacity-20 z-0">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-primary-900"
            ></div>
          ))}
        </div>

        {/* Left Column */}
        <div className="flex-1 h-full rounded-[2rem] lg:rounded-[3rem] rounded-r-xl lg:rounded-r-2xl overflow-hidden relative z-10 shadow-sm">
          <img
            src={authIlustration}
            alt="Team"
            className="absolute top-0 left-0 w-[calc(200%+16px)] max-w-none h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-500"
          />
        </div>

        {/* Right Column */}
        <div className="flex-1 h-full flex flex-col gap-4 z-10">
          <div className="flex-[1] rounded-tr-[2rem] lg:rounded-tr-[3rem] rounded-tl-xl lg:rounded-tl-2xl rounded-b-xl lg:rounded-b-2xl overflow-hidden relative shadow-sm">
            <img
              src={authIlustration}
              alt="Team"
              className="absolute top-0 right-0 w-[calc(200%+16px)] max-w-none h-[calc(300%+32px)] object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <div className="flex-[1] rounded-xl lg:rounded-2xl overflow-hidden relative shadow-sm">
            <img
              src={authIlustration}
              alt="Team"
              className="absolute top-1/2 right-0 -translate-y-1/2 w-[calc(200%+16px)] max-w-none h-[calc(300%+32px)] object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <div className="flex-[1] rounded-br-[2rem] lg:rounded-br-[3rem] rounded-t-xl lg:rounded-t-2xl rounded-bl-xl lg:rounded-bl-2xl overflow-hidden relative shadow-sm">
            <img
              src={authIlustration}
              alt="Team"
              className="absolute bottom-0 right-0 w-[calc(200%+16px)] max-w-none h-[calc(300%+32px)] object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>

        {/* Badges/Stickers */}
        <div className="absolute bottom-[10%] left-[-15%] lg:left-[-10%] z-40 bg-primary-900 text-primary-500 rounded-full flex items-center justify-center w-[90px] h-[90px] lg:w-[110px] lg:h-[110px] shadow-xl border-[4px] border-[#F5F5F5]">
          {/* Circular text simulation (rotating) */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary-500 opacity-30 animate-[spin_10s_linear_infinite] m-1.5 lg:m-2"></div>
          <svg
            className="absolute w-full h-full animate-[spin_20s_linear_infinite]"
            viewBox="0 0 100 100"
          >
            <path
              id="circlePath"
              d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
              fill="transparent"
            />
            <text width="500">
              <textPath
                href="#circlePath"
                startOffset="0%"
                className="text-[9px] lg:text-[10px] font-bold fill-primary-500 tracking-[0.2em] uppercase"
              >
                • ZERO WASTE • ZERO HUNGER •
              </textPath>
            </text>
          </svg>
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center text-primary-900 bg-primary-500 rounded-full m-6 lg:m-7">
            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 -rotate-45" />
          </div>
        </div>

        {/* Star/Sparkle decorative */}
        <div className="absolute bottom-10 right-[-10px] lg:bottom-16 lg:right-[-20px] z-40 text-primary-500 animate-pulse drop-shadow-md">
          <svg width="50" height="50" className="lg:w-[70px] lg:h-[70px]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
          </svg>
        </div>
        <div className="absolute bottom-16 right-5 lg:bottom-24 lg:right-10 z-40 text-primary-500 animate-pulse opacity-60">
          <svg width="30" height="30" className="lg:w-[40px] lg:h-[40px]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
          </svg>
        </div>
      </div>
    </main>
  );
}
