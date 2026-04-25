import * as React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
}

export function TimePicker({ value, onChange, id, className }: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Generate time intervals every 30 minutes from 08:00 to 18:00
  const timeSlots = React.useMemo(() => {
    const slots: { value: string; label: string; isAfternoon: boolean }[] = [];
    for (let i = 8; i <= 18; i++) {
      for (const j of [0, 30]) {
        if (i === 18 && j > 0) continue; // End exactly at 18:00
        
        const hour24 = i.toString().padStart(2, "0");
        const minutes = j.toString().padStart(2, "0");
        const value24 = `${hour24}:${minutes}`;
        
        const period = i >= 12 ? "PM" : "AM";
        const hour12 = i % 12 || 12;
        const label = `${hour12}:${minutes} ${period}`;
        
        slots.push({ value: value24, label, isAfternoon: i >= 12 });
      }
    }
    return slots;
  }, []);

  const selectedSlot = timeSlots.find((slot) => slot.value === value);
  const selectedLabel = selectedSlot?.label || "Select a time";

  const morningSlots = timeSlots.filter((slot) => !slot.isAfternoon);
  const afternoonSlots = timeSlots.filter((slot) => slot.isAfternoon);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {selectedLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-4" align="start">
        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground leading-none">Morning</h4>
            <div className="grid grid-cols-4 gap-2">
              {morningSlots.map((slot) => (
                <Button
                  key={slot.value}
                  variant={value === slot.value ? "default" : "outline"}
                  className="w-full text-xs px-0"
                  onClick={() => {
                    onChange(slot.value);
                    setIsOpen(false);
                  }}
                >
                  {slot.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground leading-none">Afternoon</h4>
            <div className="grid grid-cols-4 gap-2">
              {afternoonSlots.map((slot) => (
                <Button
                  key={slot.value}
                  variant={value === slot.value ? "default" : "outline"}
                  className="w-full text-xs px-0"
                  onClick={() => {
                    onChange(slot.value);
                    setIsOpen(false);
                  }}
                >
                  {slot.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
