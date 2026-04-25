import { defineField, defineType } from "sanity";

export const serviceType = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "price", title: "Price", type: "string" }),
    defineField({ name: "duration", title: "Duration", type: "string" }),
    defineField({ name: "isPopular", title: "Mark as Popular", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
});
