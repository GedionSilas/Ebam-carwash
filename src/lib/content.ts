import { sanityClient } from "@/lib/sanity";
import type { SanityImageInput } from "@/lib/sanity";

export type Service = {
  _id: string;
  title: string;
  description: string;
  price: string;
  duration?: string;
  isPopular?: boolean;
};

export type Testimonial = {
  _id: string;
  name: string;
  message: string;
  role?: string;
};

export type PricingPlan = {
  _id: string;
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
};

export type SiteSettings = {
  heroTitle: string;
  heroSubtitle: string;
  logoImage?: SanityImageInput;
  heroImage?: SanityImageInput;
  heroCTA: string;
  videos?: {
    title?: string;
    subtitle?: string;
    videoUrl: string;
    posterImage?: SanityImageInput;
  }[];
  servicesHeading?: string;
  servicesSubtitle?: string;
  pricingHeading?: string;
  pricingSubtitle?: string;
  pricingBulletPoints?: string[];
  testimonialsHeading?: string;
  footerDescription?: string;
  bookingHeading?: string;
  bookingSubtitle?: string;
};

export type Footer = {
  address: string;
  phone: string;
  email: string;
};

export type SiteContent = {
  siteSettings: SiteSettings | null;
  services: Service[];
  testimonials: Testimonial[];
  pricingPlans: PricingPlan[];
  footer: Footer | null;
};

const siteContentQuery = `{
  "siteSettings": *[_type == "siteSettings"][0]{
    ...,
    videos[]{
      title,
      subtitle,
      videoUrl,
      posterImage
    }
  },
  "services": *[_type == "service"] | order(order asc){
    _id,
    title,
    description,
    "price": coalesce(string(price), ""),
    duration,
    isPopular
  },
  "testimonials": *[_type == "testimonial"] | order(order asc){
    _id,
    name,
    message,
    role
  },
  "pricingPlans": *[_type == "pricingPlan"] | order(order asc){
    _id,
    title,
    "price": coalesce(string(price), ""),
    features,
    isPopular
  },
  "footer": *[_type == "footer"][0]{
    address,
    phone,
    email
  }
}`;

export const fetchSiteContent = async (): Promise<SiteContent> =>
  sanityClient.fetch(siteContentQuery);
