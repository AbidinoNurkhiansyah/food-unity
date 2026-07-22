import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.svg";

export function MainNavbar() {
  return (
    <nav className="flex justify-between items-center py-3 px-4 lg:px-[130px] bg-white sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <img src={logo} alt="FoodUnity Logo" className="h-5 w-auto" />
      </div>

      <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-500">
        <a
          href="#"
          className="text-primary-900 underline underline-offset-8 decoration-2 decoration-primary-500"
        >
          Home
        </a>
        <a href="#" className="hover:text-primary-500 transition-colors">
          Services
        </a>
        <a href="#" className="hover:text-primary-500 transition-colors">
          Projects
        </a>
        <a href="#" className="hover:text-primary-500 transition-colors">
          Blogs
        </a>
        <a href="#" className="hover:text-primary-500 transition-colors">
          About Us
        </a>
        <a href="#" className="hover:text-primary-500 transition-colors">
          Pricing
        </a>
      </div>

      <Link to="/login">
        <Button className="bg-primary-500 hover:bg-primary-600 text-white rounded-full px-5 h-10 font-semibold shadow-md cursor-pointer">
          Join As Merchant
        </Button>
      </Link>
    </nav>
  );
}
