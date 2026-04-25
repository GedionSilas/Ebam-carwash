import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Hero Title", type: "string" }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "text" }),
    defineField({ name: "logoImage", title: "Logo Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroCTA", title: "Hero CTA Label", type: "string" }),
    defineField({
      name: "videos",
      title: "Showcase Videos (max 2)",
      type: "array",
      validation: (rule) => rule.max(2),
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Video Title", type: "string" }),
            defineField({ name: "subtitle", title: "Video Subtitle", type: "text" }),
            defineField({ name: "videoUrl", title: "Video URL", type: "url" }),
            defineField({ name: "posterImage", title: "Poster Image", type: "image", options: { hotspot: true } }),
          ],
        },
      ],
    }),
    defineField({ name: "servicesHeading", title: "Services Heading", type: "string" }),
    defineField({ name: "servicesSubtitle", title: "Services Subtitle", type: "text" }),
    defineField({ name: "pricingHeading", title: "Pricing Heading", type: "string" }),
    defineField({ name: "pricingSubtitle", title: "Pricing Subtitle", type: "text" }),
    defineField({
      name: "pricingBulletPoints",
      title: "Pricing Bullet Points",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "testimonialsHeading", title: "Testimonials Heading", type: "string" }),
    defineField({ name: "bookingHeading", title: "Booking Heading", type: "string" }),
    defineField({ name: "bookingSubtitle", title: "Booking Subtitle", type: "text" }),
    defineField({ name: "footerDescription", title: "Footer Description", type: "text" }),
  ],
});
