import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.svg";

export function MainNavbar() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection(location.pathname);
      return;
    }

    const handleScroll = () => {
      const howItWorks = document.getElementById("how-it-works");
      const ecoImpact = document.getElementById("eco-impact");

      // Trigger point is 1/3 from the top of the screen
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      if (ecoImpact && scrollPosition >= ecoImpact.offsetTop) {
        setActiveSection("/#eco-impact");
      } else if (howItWorks && scrollPosition >= howItWorks.offsetTop) {
        setActiveSection("/#how-it-works");
      } else {
        setActiveSection("/");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const getLinkClass = (path: string) => {
    return activeSection === path
      ? "text-primary-500 underline underline-offset-8 decoration-2 decoration-primary-500"
      : "hover:text-primary-500 transition-colors";
  };

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="flex justify-between items-center py-3 px-4 lg:px-[130px] bg-white sticky top-0 z-50 border-t border-gray-200">
      <div className="flex items-center gap-2">
        <Link to="/" onClick={handleHomeClick}>
          <img src={logo} alt="FoodUnity Logo" className="h-6 w-auto" />
        </Link>
      </div>

      <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-600">
        <Link to="/" className={getLinkClass("/")} onClick={handleHomeClick}>
          Home
        </Link>
        <Link to="/explore" className={getLinkClass("/explore")}>
          Explore Foods
        </Link>
        <a href="/#how-it-works" className={getLinkClass("/#how-it-works")}>
          How it Works
        </a>
        <a href="/#eco-impact" className={getLinkClass("/#eco-impact")}>
          Eco Impact
        </a>
      </div>

      <Link to="/login" state={{ intent: 'merchant' }}>
        <Button className="bg-primary-500 hover:bg-primary-600 text-white rounded-full px-5 h-10 font-semibold shadow-md cursor-pointer transition-transform hover:scale-105">
          Join as Merchant
        </Button>
      </Link>
    </nav>
  );
}
