import { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { type Control, useController } from "react-hook-form";
import { type OnboardingValues } from "../constants/schemas";
import { cn } from "@/lib/utils";

const DAYS = [
  { id: "sen", label: "Mon" },
  { id: "sel", label: "Tue" },
  { id: "rab", label: "Wed" },
  { id: "kam", label: "Thu" },
  { id: "jum", label: "Fri" },
  { id: "sab", label: "Sat" },
  { id: "min", label: "Sun" },
];

const ALL_DAYS_LABEL = "Every Day";

function serializePickupHours(
  days: string[],
  startTime: string,
  endTime: string
): string {
  if (!days.length || !startTime || !endTime) return "";
  const dayLabel =
    days.length === 7
      ? ALL_DAYS_LABEL
      : days.map((d) => DAYS.find((x) => x.id === d)?.label ?? d).join(", ");
  return `${dayLabel}, ${startTime} - ${endTime}`;
}

function deserializePickupHours(pickupHoursString: string) {
  if (!pickupHoursString) return null;
  const lastCommaIndex = pickupHoursString.lastIndexOf(",");
  if (lastCommaIndex === -1) return null;
  
  const daysPart = pickupHoursString.substring(0, lastCommaIndex).trim();
  const timePart = pickupHoursString.substring(lastCommaIndex + 1).trim();
  
  let days: string[] = [];
  if (daysPart === ALL_DAYS_LABEL) {
    days = DAYS.map((d) => d.id);
  } else {
    const dayLabels = daysPart.split(",").map((d) => d.trim());
    days = dayLabels
      .map((label) => DAYS.find((d) => d.label.toLowerCase() === label.toLowerCase())?.id)
      .filter((id): id is string => !!id);
  }
  
  const times = timePart.split("-").map((t) => t.trim());
  let startTime = "17:00";
  let endTime = "20:00";
  if (times.length === 2) {
    if (/^\d{2}:\d{2}$/.test(times[0])) startTime = times[0];
    if (/^\d{2}:\d{2}$/.test(times[1])) endTime = times[1];
  }
  
  return { days, startTime, endTime };
}

interface MerchantOperationsSectionProps {
  control: Control<OnboardingValues>;
}

export function MerchantOperationsSection({
  control,
}: MerchantOperationsSectionProps) {
  const { field, fieldState } = useController({
    name: "pickupHours",
    control,
  });

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("17:00");
  const [endTime, setEndTime] = useState("20:00");
  const isMounted = useRef(false);
  const hasInitialized = useRef(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Sync state from React Hook Form when loaded (e.g. edit profile)
  useEffect(() => {
    if (field.value && !hasInitialized.current && !hasInteracted) {
      const parsed = deserializePickupHours(field.value);
      if (parsed) {
        setSelectedDays(parsed.days);
        setStartTime(parsed.startTime);
        setEndTime(parsed.endTime);
        hasInitialized.current = true;
      }
    }
  }, [field.value, hasInteracted]);

  // Sync to form field, but skip on first render to avoid premature validation
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    field.onChange(serializePickupHours(selectedDays, startTime, endTime));
  }, [selectedDays, startTime, endTime]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleDay = (dayId: string) => {
    setHasInteracted(true);
    setSelectedDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((d) => d !== dayId)
        : [...prev, dayId]
    );
  };

  const toggleAllDays = () => {
    setHasInteracted(true);
    setSelectedDays((prev) =>
      prev.length === 7 ? [] : DAYS.map((d) => d.id)
    );
  };

  const allSelected = selectedDays.length === 7;

  return (
    <div className="space-y-5 pt-5 border-t border-slate-100">
      <div className="space-y-3">
        <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-slate-400" />
          Routine Pickup Hours{" "}
          <span className="text-red-500">*</span>
        </Label>

        {/* Day Selector */}
        <div className="space-y-1.5">
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
            Weekly Operational Days
          </p>
          <div className="flex flex-wrap gap-2">
            {/* Setiap Hari toggle */}
            <button
              type="button"
              onClick={toggleAllDays}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150",
                allSelected
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white text-slate-500 border-slate-200 hover:border-primary-300 hover:text-primary-600"
              )}
            >
              Every Day
            </button>
            {/* Individual day toggles */}
            {DAYS.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => toggleDay(day.id)}
                className={cn(
                  "w-10 h-9 rounded-lg text-xs font-bold border transition-all duration-150",
                  selectedDays.includes(day.id)
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-white text-slate-500 border-slate-200 hover:border-primary-300 hover:text-primary-600"
                )}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Range */}
        <div className="space-y-1.5">
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
            Time Range
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-1">
              <label htmlFor="startTime" className="text-[11px] text-slate-500 font-medium">
                Start
              </label>
              <input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => { setHasInteracted(true); setStartTime(e.target.value); }}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
              />
            </div>
            <span className="text-slate-400 font-bold mt-5">—</span>
            <div className="flex-1 space-y-1">
              <label htmlFor="endTime" className="text-[11px] text-slate-500 font-medium">
                End
              </label>
              <input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => { setHasInteracted(true); setEndTime(e.target.value); }}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        {selectedDays.length > 0 && (
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-xs text-slate-600 font-medium">
            <span className="text-slate-400 mr-1.5">Summary:</span>
            {serializePickupHours(selectedDays, startTime, endTime)}
          </div>
        )}

        {/* Validation Error — only show after user has interacted, or on submit attempt */}
        {fieldState.error && (hasInteracted || fieldState.isDirty) && (
          <p className="text-xs text-red-500 font-medium pl-1">
            {fieldState.error.message}
          </p>
        )}
      </div>
    </div>
  );
}
