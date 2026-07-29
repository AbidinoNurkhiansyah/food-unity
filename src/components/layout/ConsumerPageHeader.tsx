import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface ConsumerPageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  backTo?: string;
  onBack?: () => void;
}

export const ConsumerPageHeader: React.FC<ConsumerPageHeaderProps> = ({
  title,
  icon,
  backTo,
  onBack,
}) => {
  const navigate = useNavigate();

  const handleBack = (e: React.MouseEvent) => {
    if (onBack) {
      e.preventDefault();
      onBack();
    } else if (!backTo) {
      e.preventDefault();
      navigate("/explore");
    }
  };

  const buttonClass =
    "p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 flex items-center justify-center cursor-pointer";

  return (
    <header className="bg-white sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-[130px] h-16 flex items-center gap-4">
        {backTo && !onBack ? (
          <Link to={backTo} className={buttonClass} aria-label="Back">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleBack}
            className={buttonClass}
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2 select-none">
          {icon}
          <span>{title}</span>
        </h1>
      </div>
    </header>
  );
};
