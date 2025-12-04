"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

const highlights = [
  {
    title: "Hand-Rolled Craft",
    copy: "Small-batch dough rested overnight, rolled by hand, and baked throughout the day for that perfect chew.",
  },
  {
    title: "Local & Seasonal",
    copy: "We partner with nearby mills and farms to keep our bagels honest, flavorful, and rooted in the community.",
  },
  {
    title: "Baked With Heart",
    copy: "From the crackle of the crust to the warmth at pickup, we obsess over every detail so you taste the care.",
  },
];

const stats = [
  { label: "Fresh batches daily", value: "12" },
  { label: "Ingredients sourced locally", value: "90%" },
  { label: "Neighborhoods served", value: "5" },
  { label: "Bagels shared last year", value: "62k" },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLElement | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.from(heroRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      sectionRefs.current.forEach((section, index) => {
        if (!section) return;
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
          y: 60,
          opacity: 0,
          duration: 0.9,
          delay: index * 0.05,
          ease: "power2.out",
        });
      });
    }, heroRef);

    return () => context.revert();
  }, []);

  return (
    <div className="space-y-16">
      <section
        ref={heroRef}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 via-white to-orange-100 px-8 py-14 shadow-lg"
      >
        <div className="absolute inset-0">
          <div className="absolute right-6 top-6 h-32 w-32 rounded-full bg-amber-300/40 blur-3xl" />
          <div className="absolute left-12 bottom-10 h-40 w-40 rounded-full bg-orange-200/50 blur-3xl" />
        </div>
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-800">
              Our Story
            </p>
            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              Modern bagels with{" "}
              <span className="main-color">old-school warmth</span>.
            </h1>
            <p className="text-lg text-gray-700">
              My Bagel started as a tiny kitchen experiment and grew into a
              neighborhood ritual. We chase the balance between crisp crust,
              chewy center, and bright flavors—always fresh, always welcoming.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-amber-700 hover:shadow-lg"
              >
                Taste the menu
              </Link>
              <Link
                href="/checkout"
                className="rounded-full border border-amber-400 px-6 py-3 text-sm font-semibold text-amber-800 transition hover:-translate-y-0.5 hover:border-amber-600 hover:text-amber-900"
              >
                Order a dozen
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/40 backdrop-blur-xl" />
            <div className="absolute -right-8 bottom-4 h-20 w-20 rounded-full bg-amber-500/30 blur-xl" />
            <div className="relative h-full rounded-2xl border border-amber-200/70 bg-white/80 p-6 shadow-2xl backdrop-blur">
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                  className="rounded-xl border border-amber-100/70 bg-amber-50/80 px-4 py-5 text-center shadow-sm"
                  ref={(el) => {
                    sectionRefs.current[index] = el;
                  }}
                  >
                    <div className="text-2xl font-bold text-amber-800">
                      {stat.value}
                    </div>
                    <div className="text-sm text-amber-900/80">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 px-5 py-4 text-white shadow-lg">
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Sunrise bake
                </p>
                <p className="text-base">
                  We proof at 3 a.m., bake at dawn, and keep batches rolling so
                  your bagel is warm when you arrive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"
        ref={(el) => {
          sectionRefs.current[stats.length] = el;
        }}
      >
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-800">
            Why We Bake
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            A ritual of warmth, a table for everyone.
          </h2>
          <p className="text-lg text-gray-700">
            The bagel isn&apos;t just a bite for us—it&apos;s a way to say
            hello, to check in, to celebrate the morning. Each batch is proofed
            slow, boiled hot, and baked until the crust crackles and the crumb
            sings. We keep our recipes simple, our standards high, and our doors
            open to everyone.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-amber-100/80 bg-white px-5 py-4 shadow-sm">
              <p className="text-sm font-semibold text-amber-800">
                Early riser energy
              </p>
              <p className="text-sm text-gray-700">
                Dough mixed the night before, hand-rolled at dawn, and baked in
                waves so freshness never takes a break.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-100/80 bg-white px-5 py-4 shadow-sm">
              <p className="text-sm font-semibold text-amber-800">
                Community first
              </p>
              <p className="text-sm text-gray-700">
                We donate unsold bakes daily and host monthly coffee mornings to
                keep the neighborhood connected.
              </p>
            </div>
          </div>
        </div>
        <div className="relative rounded-3xl border border-amber-100 bg-gradient-to-b from-white to-amber-50 p-6 shadow-lg">
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_30%_30%,rgba(248,196,113,0.25),transparent_40%)]" />
          <div className="relative space-y-4">
            <h3 className="text-lg font-semibold text-amber-900">Timeline</h3>
            <ul className="space-y-4">
              {[
                {
                  title: "The first boil",
                  detail: "A single kettle batch in a tiny home kitchen.",
                },
                {
                  title: "Doors opened",
                  detail:
                    "We launched our first shop with a line that wrapped the block.",
                },
                {
                  title: "Flavors grew",
                  detail:
                    "Seasonal specials, vegan schmears, and whole-grain experiments joined the classics.",
                },
                {
                  title: "Today",
                  detail:
                    "Five neighborhoods, one team, and countless morning smiles later—we're just getting started.",
                },
              ].map((item, index) => (
                <li key={item.title} className="flex gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full bg-amber-600" />
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-700">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        ref={(el) => {
          sectionRefs.current[stats.length + 1] = el;
        }}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-800">
          What drives us
        </p>
        <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
          Crafted with curiosity, shared with joy.
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, index) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-white p-6 shadow-md transition"
              ref={(el) => {
                sectionRefs.current[stats.length + 2 + index] = el;
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100/0 via-amber-100/40 to-orange-100/0 opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="relative space-y-3">
                <div className="h-10 w-10 rounded-full bg-amber-600/15" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-700">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 px-8 py-10 text-white shadow-xl"
        ref={(el) => {
          sectionRefs.current[stats.length + highlights.length + 2] = el;
        }}
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]">
              Visit us
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Stop by for a warm dozen or linger for coffee.
            </h2>
            <p className="text-base text-amber-50">
              Our shops are designed for slow mornings and quick pickups alike.
              We keep the ovens humming and the playlists mellow so you can find
              a moment of calm with every visit.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur">
              <p className="text-sm font-semibold">Hours</p>
              <p className="text-sm text-amber-100">Mon–Sun: 7:00a — 3:00p</p>
            </div>
            <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur">
              <p className="text-sm font-semibold">Locations</p>
              <p className="text-sm text-amber-100">
                Downtown · Westside · Riverside · Oak Park · Lakeshore
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
