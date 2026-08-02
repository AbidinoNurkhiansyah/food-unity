import { useState } from "react";
import { useMerchantOnboardingForm } from "../hooks/useMerchantOnboardingForm";
import { MerchantOnboardingSidebar } from "./MerchantOnboardingSidebar";
import { MerchantOnboardingActions } from "./MerchantOnboardingActions";
import { MerchantStepOne } from "./MerchantStepOne";
import { MerchantStepTwo } from "./MerchantStepTwo";
import { MerchantStepThree } from "./MerchantStepThree";
import { toast } from "sonner";
import appLogo from "@/assets/logo.svg";
import { motion, AnimatePresence } from "framer-motion";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    logoImageUrl,
    bannerImageUrl,
    isUploadingLogo,
    isUploadingBanner,
    handleImageUpload,
  } = useMerchantOnboardingForm();

  const [currentStep, setCurrentStep] = useState(1);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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
    if (currentStep !== 3) return;
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsConfirmModalOpen(false);
    await handleSubmit(onSubmit, () => {
      toast.error("Please complete all required fields.");
    })();
  };

  return (
    <>
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
            <div className="flex-1 overflow-y-auto px-6 py-8 md:px-16 md:py-6 max-w-4xl mx-auto w-full z-10">
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
                    <MerchantStepOne
                      register={register}
                      errors={errors}
                      logoImageUrl={logoImageUrl}
                      bannerImageUrl={bannerImageUrl}
                      isUploadingLogo={isUploadingLogo}
                      isUploadingBanner={isUploadingBanner}
                      handleImageUpload={handleImageUpload}
                    />
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

            <MerchantOnboardingActions
              currentStep={currentStep}
              submitting={submitting}
              onBack={prevStep}
              onNext={nextStep}
              onSaveClick={() => setIsConfirmModalOpen(true)}
            />
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 md:p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mb-6">
                  <Store className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Confirm Submission
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  Are you sure you want to finish setting up your business
                  profile? Please make sure all details, including address and
                  map location, are correct.
                </p>
                <div className="flex gap-3 w-full mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-xl h-12 font-bold text-slate-600 hover:text-slate-900"
                    onClick={() => setIsConfirmModalOpen(false)}
                  >
                    Check Again
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 rounded-xl h-12 font-bold bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                    onClick={handleConfirmSubmit}
                  >
                    Yes, Submit
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
