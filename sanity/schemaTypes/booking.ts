import { defineField, defineType } from "sanity";

export const bookingType = defineType({
  name: "booking",
  title: "Booking",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "phone", title: "Phone", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "address", title: "Address", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "carType", title: "Car Type", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "serviceType", title: "Service Type", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "createdAt", title: "Created At", type: "datetime", validation: (rule) => rule.required() }),
  ],
});
