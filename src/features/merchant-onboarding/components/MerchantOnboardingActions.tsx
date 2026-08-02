import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MerchantOnboardingActionsProps {
  currentStep: number;
  submitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSaveClick: () => void;
}

export function MerchantOnboardingActions({
  currentStep,
  submitting,
  onBack,
  onNext,
  onSaveClick,
}: MerchantOnboardingActionsProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Prevent accidental double clicks when stepping between stages
  useEffect(() => {
    setIsTransitioning(true);
    const t = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(t);
  }, [currentStep]);

  return (
    <div className="border-t border-slate-100 bg-white/80 backdrop-blur-md px-6 py-4 md:px-16 md:py-5 flex justify-between items-center z-10 shrink-0">
      {currentStep > 1 ? (
        <Button
          type="button"
          variant="outline"
          className="px-6 h-11 rounded-xl font-bold border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 cursor-pointer transition-all duration-200"
          onClick={onBack}
        >
          Back
        </Button>
      ) : (
        <div /> // Spacer
      )}

      {currentStep < 3 ? (
        <Button
          type="button"
          disabled={isTransitioning}
          className="px-8 h-11 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-bold rounded-xl cursor-pointer shadow-lg shadow-primary-500/10 hover:shadow-primary-500/25 transition-all duration-200"
          onClick={onNext}
        >
          Continue
        </Button>
      ) : (
        <Button
          type="button"
          disabled={submitting || isTransitioning}
          onClick={(e) => {
            e.preventDefault();
            onSaveClick();
          }}
          className="px-8 h-11 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-bold rounded-xl cursor-pointer shadow-lg shadow-primary-500/10 hover:shadow-primary-500/25 transition-all duration-200 flex items-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>Save & Finish</>
          )}
        </Button>
      )}
    </div>
  );
}
