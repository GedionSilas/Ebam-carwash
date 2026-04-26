import { type FormEvent, useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/TimePicker";
import { cn } from "@/lib/utils";

import type { BusinessHour } from "@/lib/content";

const carTypes = ["Sedan", "Minivan", "Truck", "SUV", "Other"] as const;
const serviceTypes = ["Exterior Wash", "Full Wash", "Engine Cleaning", "Detailing"] as const;

interface BookingButtonProps extends ButtonProps {
  label?: string;
  businessHours?: BusinessHour[];
}

export const BookingButton = ({ label = "Book Now", businessHours = [], ...props }: BookingButtonProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState<{
    fullName: string;
    phoneNumber: string;
    address: string;
    carType: string;
    serviceType: string;
    bookingDate: Date | undefined;
    bookingStartTime: string;
  }>({
    fullName: "",
    phoneNumber: "",
    address: "",
    carType: "Sedan",
    serviceType: "Exterior Wash",
    bookingDate: undefined,
    bookingStartTime: "",
  });

  const isFormValid = useMemo(
    () =>
      Boolean(
        formData.fullName.trim() &&
          formData.phoneNumber.trim() &&
          formData.address.trim() &&
          formData.carType &&
          formData.serviceType &&
          formData.bookingDate &&
          formData.bookingStartTime
      ),
    [formData],
  );

  const resetForm = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      address: "",
      carType: "Sedan",
      serviceType: "Exterior Wash",
      bookingDate: undefined,
      bookingStartTime: "",
    });
    setErrorMessage("");
  };

  const activeDayHours = useMemo(() => {
    if (!formData.bookingDate || !businessHours?.length) return null;
    const dayIndex = formData.bookingDate.getDay().toString();
    return businessHours.find((h) => h.day === dayIndex);
  }, [formData.bookingDate, businessHours]);

  const minTime = useMemo(() => {
    let lowerBound = activeDayHours?.openTime || "00:00";
    if (formData.bookingDate) {
      const today = new Date();
      if (
        formData.bookingDate.getFullYear() === today.getFullYear() &&
        formData.bookingDate.getMonth() === today.getMonth() &&
        formData.bookingDate.getDate() === today.getDate()
      ) {
        const currentHour = today.getHours().toString().padStart(2, "0");
        const currentMinute = today.getMinutes().toString().padStart(2, "0");
        const currentTime = `${currentHour}:${currentMinute}`;
        lowerBound = currentTime > lowerBound ? currentTime : lowerBound;
      }
    }
    return lowerBound;
  }, [activeDayHours, formData.bookingDate]);

  const maxTime = activeDayHours?.closeTime || undefined;

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isFormValid) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payloadData = {
        ...formData,
        bookingDate: formData.bookingDate ? format(formData.bookingDate, "yyyy-MM-dd") : "",
      };

      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadData),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string; message?: string };

      if (!response.ok) {
        setErrorMessage(payload.error || "Could not submit your booking. Please try again.");
        return;
      }

      setSuccessMessage(payload.message || "Booking received. We will contact you shortly.");
      resetForm();
      setTimeout(() => {
        setOpen(false);
      }, 1300);
    } catch {
      setErrorMessage("Could not submit your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button {...props}>{label}</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Your Wash</DialogTitle>
          <DialogDescription>Fill in your details and we will confirm your booking shortly.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={(event) => setFormData((prev) => ({ ...prev, fullName: event.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={(event) => setFormData((prev) => ({ ...prev, phoneNumber: event.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={(event) => setFormData((prev) => ({ ...prev, address: event.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carType">Car Type</Label>
            <select
              title="Car type"
              id="carType"
              name="carType"
              value={formData.carType}
              onChange={(event) => setFormData((prev) => ({ ...prev, carType: event.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              {carTypes.map((carType) => (
                <option key={carType} value={carType}>
                  {carType}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceType">Service Type</Label>
            <select
              title="Service type"
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={(event) => setFormData((prev) => ({ ...prev, serviceType: event.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              {serviceTypes.map((serviceType) => (
                <option key={serviceType} value={serviceType}>
                  {serviceType}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.bookingDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.bookingDate ? format(formData.bookingDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.bookingDate}
                  onSelect={(date) => setFormData((prev) => ({ ...prev, bookingDate: date }))}
                  initialFocus
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (date < today) return true;
                    
                    if (businessHours && businessHours.length > 0) {
                      const dayIndex = date.getDay().toString();
                      const dayHours = businessHours.find((h) => h.day === dayIndex);
                      
                      // Disable if no hours defined or explicitly closed
                      if (!dayHours || dayHours.isClosed) {
                        return true;
                      }

                      // If it's today, check if we're past the closing time
                      if (date.getTime() === today.getTime() && dayHours.closeTime) {
                        const now = new Date();
                        const currentHour = now.getHours().toString().padStart(2, "0");
                        const currentMinute = now.getMinutes().toString().padStart(2, "0");
                        const currentTime = `${currentHour}:${currentMinute}`;
                        if (currentTime >= dayHours.closeTime) {
                          return true; // We are past the closing time today
                        }
                      }
                    }
                    
                    return false;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bookingStartTime">Start Time</Label>
            <TimePicker
              id="bookingStartTime"
              value={formData.bookingStartTime}
              onChange={(value) => setFormData((prev) => ({ ...prev, bookingStartTime: value }))}
              minTime={minTime}
              maxTime={maxTime}
            />
            {activeDayHours && !activeDayHours.isClosed && (
              <p className="text-xs text-muted-foreground">
                Available hours: {activeDayHours.openTime || "08:00"} - {activeDayHours.closeTime || "18:00"}
              </p>
            )}
            {activeDayHours?.isClosed && (
              <p className="text-xs text-destructive">
                We are closed on this day.
              </p>
            )}
          </div>

          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
          {successMessage && <p className="text-sm text-primary">{successMessage}</p>}

          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting || !isFormValid}>
              {isSubmitting ? "Submitting..." : "Submit Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
