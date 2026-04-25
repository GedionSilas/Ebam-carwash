import { defineField, defineType } from "sanity";

export const pricingPlanType = defineType({
  name: "pricingPlan",
  title: "Pricing Plan",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "price", title: "Price", type: "string" }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "isPopular", title: "Mark as Popular", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
});
