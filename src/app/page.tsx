"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Clock, Mail, MapPin, Phone, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BookingButton } from "@/components/BookingButton";
import heroCar from "@/assets/hero-car.jpg";
import washVideo from "../../public/videos/wash.mp4.asset.json";
import washPoster from "@/assets/wash-frame.jpg";
import { fetchSiteContent, type SiteContent } from "@/lib/content";
import { isSanityConfigured, urlFor } from "@/lib/sanity";

const fallbackServices = [
  { title: "Express Wash", description: "Quick exterior wash, hand-dry, tire shine.", price: "$25", duration: "20 min" },
  { title: "Full Detail", description: "Interior vacuum, dashboard, windows, exterior wash.", price: "$65", duration: "60 min", isPopular: true },
  { title: "Premium Detail", description: "Clay bar, wax, deep interior, leather conditioning.", price: "$149", duration: "2 hr" },
];
const steps = [
  { n: "01", title: "Choose a service", desc: "Pick the wash that fits your car." },
  { n: "02", title: "Share your details", desc: "Submit your booking form in seconds." },
  { n: "03", title: "Get a clean car", desc: "Sit back. We handle the rest." },
];

const fallbackTestimonials = [
  { message: "Best wash in the city. Booking took 30 seconds.", name: "Maya R.", role: "Tesla Model 3" },
  { message: "Showed up on time and my car has never looked better.", name: "Daniel K.", role: "Range Rover" },
  { message: "Honest pricing, premium results. Highly recommend.", name: "Sara L.", role: "BMW X5" },
];

const fallbackPricingPlans = [
  {
    title: "Express Wash",
    price: "$89",
    features: ["Pre-wash", "Exterior wash", "Wheel & tire wash", "Bug removal"],
    isPopular: false,
  },
  {
    title: "Full Detailing",
    price: "$125",
    features: [
      "Pre-wash",
      "Wheel & tire wash",
      "Bug removal",
      "Engine wash",
      "Tire shine",
      "Interior vacuum (wet & dry)",
    ],
    isPopular: true,
  },
];

const getGroupedBusinessHours = (hours: { day: string; isClosed: boolean; openTime?: string; closeTime?: string }[]) => {
  const sorted = [...hours].sort((a, b) => {
    const da = parseInt(a.day) === 0 ? 7 : parseInt(a.day);
    const db = parseInt(b.day) === 0 ? 7 : parseInt(b.day);
    return da - db;
  });

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "";
    const [hStr, mStr] = timeStr.split(":");
    const h = parseInt(hStr, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${mStr}${ampm}`;
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const groups: { startDay: string; endDay: string; hoursStr: string }[] = [];

  for (const h of sorted) {
    const dayName = days[parseInt(h.day)];
    const hoursStr = h.isClosed ? "Closed" : `${formatTime(h.openTime)} - ${formatTime(h.closeTime)}`;

    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.hoursStr === hoursStr) {
      lastGroup.endDay = dayName;
    } else {
      groups.push({ startDay: dayName, endDay: dayName, hoursStr });
    }
  }

  return groups;
};

export default function HomePage() {
  const [isDark, setIsDark] = useState(true);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ebam-theme");
    const dark = stored ? stored === "dark" : true;
    document.documentElement.classList.toggle("dark", dark);
    setIsDark(dark);
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark")));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isSanityConfigured) return;

    const loadContent = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const data = await fetchSiteContent();
        setContent(data);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const siteSettings = content?.siteSettings;
  const services = content?.services?.length ? content.services : fallbackServices;
  const testimonials = content?.testimonials?.length ? content.testimonials : fallbackTestimonials;
  const pricingPlans = content?.pricingPlans?.length ? content.pricingPlans : fallbackPricingPlans;

  const heroImageUrl = siteSettings?.heroImage ? urlFor(siteSettings.heroImage).width(1920).height(1080).fit("crop").url() : heroCar.src;
  const logoImageUrl = siteSettings?.logoImage ? urlFor(siteSettings.logoImage).width(256).height(256).fit("crop").url() : null;
  const cmsVideos = siteSettings?.videos?.filter((video) => video.videoUrl) || [];
  const primaryVideo = cmsVideos[0];
  const secondaryVideo = cmsVideos[1];
  const primaryVideoUrl = primaryVideo?.videoUrl || washVideo.url;
  const primaryVideoPoster = primaryVideo?.posterImage ? urlFor(primaryVideo.posterImage).width(1600).height(900).fit("crop").url() : washPoster.src;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container-tight flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
            {logoImageUrl ? (
              <img src={logoImageUrl} alt="EBAM logo" className="h-8 w-8 rounded-md object-cover" />
            ) : (
              <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">E</span>
            )}
            EBAM
          </a>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#services" className="transition-colors hover:text-foreground">Services</a>
            <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
            <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
            <a href="#book" className="transition-colors hover:text-foreground">Book</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <BookingButton size="sm" label="Book Now" className="hidden sm:inline-flex" businessHours={siteSettings?.businessHours} />
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="container-tight grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              Premium detailing, simple booking
            </span>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              {siteSettings?.heroTitle || "Fast & Reliable Car Wash by EBAM."}
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              {siteSettings?.heroSubtitle || "Book a professional wash or full detail in under a minute. No phone calls, no waiting rooms."}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <BookingButton size="xl" label={siteSettings?.heroCTA || "Book Now"} businessHours={siteSettings?.businessHours} />
              <Button variant="outline" size="xl" asChild>
                <a href="#services">View Services <ArrowRight className="ml-1 h-4 w-4" /></a>
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
                <span className="ml-1 font-medium text-foreground">4.9</span>
              </div>
              <span>500+ happy customers</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 rounded-3xl bg-primary/10 blur-3xl" aria-hidden />
            <img
              src={heroImageUrl}
              alt="Glossy black car after EBAM detailing"
              width={1920}
              height={1080}
              className="relative aspect-[4/3] w-full rounded-2xl object-cover shadow-soft"
            />
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-10 md:px-8 md:py-16">
        <div className="relative mx-auto w-full overflow-hidden rounded-3xl shadow-soft">
          <video
            src={primaryVideoUrl}
            poster={primaryVideoPoster}
            autoPlay
            muted
            loop
            playsInline
            className="block aspect-video w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
              {primaryVideo?.title || "Detailing in motion."}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/80 md:text-base">
              {primaryVideo?.subtitle || "Real care, real results — every wash performed by trained pros."}
            </p>
          </div>
        </div>
      </section>
      {secondaryVideo && (
        <section className="w-full px-4 pb-10 md:px-8 md:pb-16">
          <div className="relative mx-auto w-full overflow-hidden rounded-3xl shadow-soft">
            <video
              src={secondaryVideo.videoUrl}
              poster={secondaryVideo.posterImage ? urlFor(secondaryVideo.posterImage).width(1600).height(900).fit("crop").url() : washPoster.src}
              autoPlay
              muted
              loop
              playsInline
              className="block aspect-video w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
                {secondaryVideo.title || "More of our work."}
              </h2>
              <p className="mt-2 max-w-xl text-sm text-white/80 md:text-base">
                {secondaryVideo.subtitle || "Showcasing consistency and quality in every detail."}
              </p>
            </div>
          </div>
        </section>
      )}


      <section id="how" className="py-20 md:py-28">
        <div className="container-tight">
          <div className="mb-12 max-w-2xl">
            <h2 className="font-display text-4xl font-bold md:text-5xl">How it works.</h2>
            <p className="mt-3 text-muted-foreground">Three steps. Zero friction.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="relative">
                <div className="font-display text-5xl font-bold text-primary/20">{step.n}</div>
                <h3 className="mt-3 font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-y border-border/60 bg-[hsl(var(--surface))]/40 py-20 md:py-28">
        <div className="container-tight">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8">
              <h2 className="font-display text-4xl font-bold md:text-5xl">{siteSettings?.pricingHeading || "Pricing by vehicle size."}</h2>
              <p className="mt-3 text-muted-foreground">
                {siteSettings?.pricingSubtitle || "Select your vehicle to see seat-based pricing. Prices vary by vehicle size."}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {pricingPlans.map((plan) => (
                <div
                  key={plan._id || plan.title}
                  className={`rounded-2xl border bg-card p-6 shadow-soft ${
                    plan.isPopular ? "border-primary/40" : "border-border"
                  }`}
                >
                  <p className="text-sm text-muted-foreground">{plan.isPopular ? "Most Popular" : "Service Plan"}</p>
                  <h3 className="mt-1 font-display text-2xl font-semibold">{plan.title}</h3>
                  <div className="mt-5 flex items-baseline gap-2 transition-all duration-300">
                    <span className="font-display text-4xl font-bold">{plan.price || "$0"}</span>
                    <span className="text-sm text-muted-foreground">/ visit</span>
                  </div>
                  <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                    {(plan.features || []).map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <BookingButton className="mt-6 w-full" label="Book Now" businessHours={siteSettings?.businessHours} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-tight">
          <h2 className="mb-12 max-w-2xl font-display text-4xl font-bold md:text-5xl">
            {siteSettings?.testimonialsHeading || "Trusted by drivers across the city."}
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t._id || t.name} className="rounded-2xl border border-border bg-card p-7">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="mt-4 text-base leading-relaxed">"{t.message}"</blockquote>
                <figcaption className="mt-5 text-sm">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-muted-foreground">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="book" className="border-t border-border/60 bg-[hsl(var(--surface))]/40 py-20 md:py-28">
        <div className="container-tight">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-display text-4xl font-bold md:text-5xl">{siteSettings?.bookingHeading || "Book your wash."}</h2>
            <p className="mt-3 text-muted-foreground">{siteSettings?.bookingSubtitle || "Tell us your details and we will confirm your appointment quickly."}</p>
          </div>
          {isLoading && isSanityConfigured && <p className="mb-4 text-sm text-muted-foreground">Loading CMS content...</p>}
          {isError && isSanityConfigured && <p className="mb-4 text-sm text-destructive">Could not load CMS content. Showing fallback copy.</p>}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
            <p className="max-w-xl text-sm text-muted-foreground">
              Need a quick refresh or a full detailing service? Open the booking form and share your location, vehicle type,
              and service preference.
            </p>
            <BookingButton className="mt-6" size="lg" label="Book Now" businessHours={siteSettings?.businessHours} />
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 bg-background py-14">
        <div className="container-tight grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-display text-xl font-bold">
              {logoImageUrl ? (
                <img src={logoImageUrl} alt="EBAM logo" className="h-8 w-8 rounded-md object-cover" />
              ) : (
                <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">E</span>
              )}
              EBAM
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              {siteSettings?.footerDescription || "Premium car wash & detailing. Booking made simple."}
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="font-medium">Hours</div>
            {siteSettings?.businessHours && siteSettings.businessHours.length > 0 ? (
              getGroupedBusinessHours(siteSettings.businessHours).map((g, i) => (
                <div key={i} className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>
                    {g.startDay === g.endDay ? g.startDay : `${g.startDay} - ${g.endDay}`} · {g.hoursStr}
                  </span>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> Mon-Sat · 8:00AM - 7:00PM</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> Sun · 9:00AM - 5:00PM</div>
              </>
            )}
          </div>
          <div className="space-y-2 text-sm">
            <div className="font-medium">Contact</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {content?.footer?.phone || "(555) 123-4567"}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> {content?.footer?.address || "123 Main St, Suite 4"}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> {content?.footer?.email || "hello@ebamwash.com"}</div>
          </div>
        </div>
        <div className="container-tight mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} EBAM Car Wash & Detailing. All rights reserved.</div>
          <div>Crafted with care.</div>
        </div>
      </footer>
    </div>
  );
}
