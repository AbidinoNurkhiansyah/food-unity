import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MailCheck } from "lucide-react";
import appLogo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

export function VerifyEmailPanel() {
  const location = useLocation();
  const email = location.state?.email || "your email";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary-50/20 backdrop-blur-3xl -z-10"></div>
      
      <div className="w-full max-w-md p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden relative border border-gray-100"
        >
          <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-primary-100 rounded-full opacity-50 pointer-events-none"></div>
          
          <div className="p-8 md:p-10 flex flex-col items-center text-center">
            <img src={appLogo} alt="FoodUnity" className="h-12 mb-6" />
            
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <MailCheck className="h-8 w-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Inbox!</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              We have sent a verification link to <strong>{email}</strong>. 
              Please check your email (including the spam folder) and click the link to activate your account.
            </p>
            
            <CardContent className="p-0 w-full">
              <Link to="/login" className="w-full block">
                <Button className="w-full h-11 rounded-xl bg-primary-500 hover:bg-primary-600 cursor-pointer text-white font-bold shadow-lg shadow-primary-500/20">
                  I have verified, Login
                </Button>
              </Link>
            </CardContent>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
