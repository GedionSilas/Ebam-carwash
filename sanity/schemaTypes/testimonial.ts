import { defineField, defineType } from "sanity";

export const testimonialType = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "message", title: "Message", type: "text" }),
    defineField({ name: "role", title: "Role / Vehicle", type: "string" }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
});
