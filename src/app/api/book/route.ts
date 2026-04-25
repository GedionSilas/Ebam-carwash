import { NextResponse } from "next/server";
import { google } from "googleapis";
import { z } from "zod";
import { createClient } from "@sanity/client";

const bookingSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  phoneNumber: z.string().trim().min(1, "Phone number is required"),
  address: z.string().trim().min(1, "Address is required"),
  carType: z.string().trim().min(1, "Car type is required"),
  serviceType: z.string().trim().min(1, "Service type is required"),
  bookingDate: z.string().trim().min(1, "Booking date is required"),
  bookingStartTime: z.string().trim().min(1, "Start time is required"),
});

const getGoogleCalendarClient = () => {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    return null;
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  return google.calendar({ version: "v3", auth });
};

const maybeSaveBookingToSanity = async (data: z.infer<typeof bookingSchema>) => {
  const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !token) {
    return;
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-01-01",
    token,
    useCdn: false,
  });

  await client.create({
    _type: "booking",
    name: data.fullName,
    phone: data.phoneNumber,
    address: data.address,
    carType: data.carType,
    serviceType: data.serviceType,
    bookingDate: data.bookingDate,
    bookingStartTime: data.bookingStartTime,
    createdAt: new Date().toISOString(),
  });
};

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = bookingSchema.safeParse(payload);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid booking payload" },
        { status: 400 },
      );
    }

    const booking = result.data;

    const calendar = getGoogleCalendarClient();
    if (!calendar) {
      return NextResponse.json(
        { error: "Google Calendar credentials are missing. Please configure server environment variables." },
        { status: 500 },
      );
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
    const timeZone = process.env.GOOGLE_CALENDAR_TIMEZONE || "UTC";

    const startDateTime = new Date(`${booking.bookingDate}T${booking.bookingStartTime}:00`);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);

    await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `Car Wash Booking - ${booking.fullName}`,
        description: [
          `Name: ${booking.fullName}`,
          `Phone: ${booking.phoneNumber}`,
          `Address: ${booking.address}`,
          `Car Type: ${booking.carType}`,
          `Service Type: ${booking.serviceType}`,
        ].join("\n"),
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone,
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone,
        },
      },
    });

    try {
      await maybeSaveBookingToSanity(booking);
    } catch (error) {
      console.error("Sanity booking save failed", error);
    }

    return NextResponse.json({ ok: true, message: "Booking received. We will contact you shortly." });
  } catch (error) {
    console.error("Booking API failed", error);
    return NextResponse.json({ error: "Unable to process booking request right now." }, { status: 500 });
  }
}
