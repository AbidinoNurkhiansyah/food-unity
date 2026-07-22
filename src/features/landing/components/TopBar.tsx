import { Phone, Mail, MapPin } from "lucide-react";

const Facebook = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Twitter = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Instagram = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Youtube = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export function TopBar() {
  return (
    <div className="bg-palette-800 text-white flex justify-between items-stretch text-sm relative z-20">
      <div className="flex gap-6 py-2.5 px-4 lg:pl-[130px] flex-wrap items-center">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-primary-500" />
          <span>(000) 000-0000</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary-500" />
          <span>example@gmail.com</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary-500" />
          <span>2464 Royal Ln. Mesa, New Jersey 45463</span>
        </div>
      </div>

      {/* Right side with skewed green background */}
      <div className="hidden lg:flex items-center gap-5 bg-primary-500 text-primary-900 px-8 lg:pr-[130px] py-2 relative">
        {/* Skewed decorative element */}
        <div className="absolute top-0 -left-6 w-12 h-full bg-primary-500 -skew-x-[30deg]"></div>
        <Facebook className="w-4 h-4 cursor-pointer relative z-10 hover:text-white transition-colors" />
        <Twitter className="w-4 h-4 cursor-pointer relative z-10 hover:text-white transition-colors" />
        <Instagram className="w-4 h-4 cursor-pointer relative z-10 hover:text-white transition-colors" />
        <Youtube className="w-4 h-4 cursor-pointer relative z-10 hover:text-white transition-colors" />
      </div>
    </div>
  );
}
