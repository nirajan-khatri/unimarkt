// components/WeekdayDatePicker.tsx
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  selected: Date | undefined;
  onSelect: (date: Date) => void;
  allowedWeekday: string; // e.g., "Tuesday"
};

export function WeekdayDatePicker({
  selected,
  onSelect,
  allowedWeekday,
}: Props) {
  const allowedIndex = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ].indexOf(allowedWeekday);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => date && onSelect(date)}
          disabled={(date) =>
            date.getDay() !== allowedIndex || date < new Date()
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
