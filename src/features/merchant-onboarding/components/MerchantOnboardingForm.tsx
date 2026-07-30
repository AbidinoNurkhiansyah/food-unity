import { useState, useRef } from "react";
import { useMerchantOnboardingForm } from "../hooks/useMerchantOnboardingForm";
import { MerchantOnboardingSidebar } from "./MerchantOnboardingSidebar";
import { MerchantOnboardingActions } from "./MerchantOnboardingActions";
import { MerchantStepOne } from "./MerchantStepOne";
import { MerchantStepTwo } from "./MerchantStepTwo";
import { MerchantStepThree } from "./MerchantStepThree";
import { toast } from "sonner";
import appLogo from "@/assets/logo.svg";
import { motion, AnimatePresence } from "framer-motion";

export function MerchantOnboardingForm() {
  const {
    register,
    handleSubmit,
    trigger,
    errors,
    control,
    submitting,
    provinces,
    regencies,
    districts,
    villages,
    selectedProvince,
    selectedRegency,
    selectedDistrict,
    selectedVillage,
    setSelectedVillage,
    handleProvinceChange,
    handleRegencyChange,
    handleDistrictChange,
    regionError,
    coordinates,
    customCoordinates,
    isLoaded,
    loadError,
    handleGetCurrentLocation,
    isDetectingLocation,
    onMapClick,
    handleCoordChange,
    onSubmit,
  } = useMerchantOnboardingForm();

  const [currentStep, setCurrentStep] = useState(1);
  // Guard against accidental form submissions during step transitions.
  // Only true when the user explicitly clicks "Save & Finish".
  const isIntentionalSubmit = useRef(false);

  const nextStep = async () => {
    if (currentStep === 1) {
      const isValid = await trigger(["merchantType", "phoneNumber"]);
      if (isValid) {
        setCurrentStep(2);
      } else {
        toast.error("Please complete the required business / donor details.");
      }
    } else if (currentStep === 2) {
      const isAddressValid = await trigger(["detailAddress"]);
      if (
        !selectedProvince ||
        !selectedRegency ||
        !selectedDistrict ||
        !selectedVillage
      ) {
        toast.error("Please select a complete administrative region.");
        return;
      }
      if (isAddressValid) {
        setCurrentStep(3);
      } else {
        toast.error("Please complete the address details correctly.");
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentStep !== 3 || !isIntentionalSubmit.current) return;
    isIntentionalSubmit.current = false;
    handleSubmit(onSubmit, () => {
      toast.error("Please complete all required fields.");
    })(e);
  };

  return (
    <div className="w-full h-screen max-h-screen overflow-hidden bg-white grid grid-cols-1 md:grid-cols-[32%_68%] lg:grid-cols-[28%_72%] select-none font-sans">
      {/* LEFT PANEL: Branding & Stepper Progress */}
      <MerchantOnboardingSidebar currentStep={currentStep} />

      {/* RIGHT PANEL: Dynamic Form Content */}
      <div className="flex flex-col h-full overflow-hidden bg-slate-50/40 relative">
        {/* Soft Background Accent */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary-50 rounded-full opacity-40 blur-3xl pointer-events-none"></div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-6 py-4 bg-primary-900 text-white shadow-md z-10">
          <div className="flex items-center gap-2">
            <img
              src={appLogo}
              alt="Logo"
              className="h-6 w-auto brightness-0 invert"
            />
            <span className="font-extrabold text-sm tracking-wide">
              FoodUnity Onboarding
            </span>
          </div>
          <span className="text-[11px] bg-primary-800 text-primary-200 px-3 py-1 rounded-full font-bold">
            Step {currentStep} / 3
          </span>
        </div>

        {/* Progress Bar (Mobile) */}
        <div className="md:hidden h-1 bg-primary-950 w-full z-10">
          <div
            className="h-full bg-primary-400 transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>

        {/* Main Form */}
        <form
          onSubmit={handleFormSubmit}
          className="flex-1 flex flex-col h-full overflow-hidden"
        >
          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto px-6 py-8 md:px-16 md:py-12 max-w-4xl mx-auto w-full z-10">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <MerchantStepOne register={register} errors={errors} />
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <MerchantStepTwo
                    register={register}
                    errors={errors}
                    provinces={provinces}
                    regencies={regencies}
                    districts={districts}
                    villages={villages}
                    selectedProvince={selectedProvince}
                    handleProvinceChange={handleProvinceChange}
                    selectedRegency={selectedRegency}
                    handleRegencyChange={handleRegencyChange}
                    selectedDistrict={selectedDistrict}
                    handleDistrictChange={handleDistrictChange}
                    selectedVillage={selectedVillage}
                    setSelectedVillage={setSelectedVillage}
                    regionError={regionError}
                  />
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <MerchantStepThree
                    register={register}
                    errors={errors}
                    control={control}
                    isLoaded={isLoaded}
                    loadError={loadError}
                    coordinates={coordinates}
                    customCoordinates={customCoordinates}
                    onMapClick={onMapClick}
                    handleGetCurrentLocation={handleGetCurrentLocation}
                    isDetectingLocation={isDetectingLocation}
                    handleCoordChange={handleCoordChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sticky Bottom Actions Bar */}
          <MerchantOnboardingActions
            currentStep={currentStep}
            submitting={submitting}
            onBack={prevStep}
            onNext={nextStep}
            onSaveClick={() => { isIntentionalSubmit.current = true; }}
          />
        </form>
      </div>
    </div>
  );
}
