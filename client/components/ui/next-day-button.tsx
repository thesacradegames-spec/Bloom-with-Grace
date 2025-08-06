import { Calendar, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { addDaysToDateString } from "@/lib/date-utils";

interface NextDayButtonProps {
  currentDate: string;
  onNextDay: () => void;
  disabled?: boolean;
}

export function NextDayButton({ currentDate, onNextDay, disabled = false }: NextDayButtonProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00'); // Prevent timezone conversion
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getNextDate = (dateString: string) => {
    const nextDateString = addDaysToDateString(dateString, 1);
    return formatDate(nextDateString);
  };

  return (
    <Button
      onClick={onNextDay}
      disabled={disabled}
      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
    >
      <Calendar className="w-5 h-5" />
      <div className="flex flex-col items-start">
        <span className="text-xs opacity-90">Next Day</span>
        <span className="text-sm font-semibold">
          {formatDate(currentDate)} → {getNextDate(currentDate)}
        </span>
      </div>
      <ChevronRight className="w-4 h-4" />
    </Button>
  );
}
