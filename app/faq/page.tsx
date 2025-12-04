"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

type FaqItem = {
  question: string;
  answer: string;
  category: string;
};

const faqs: FaqItem[] = [
  {
    question: "How fresh are your bagels?",
    answer:
      "We mix and proof dough overnight, hand-roll at dawn, boil, and bake through the morning so each batch hits the shelf warm.",
    category: "Ordering",
  },
  {
    question: "Do you offer gluten-free options?",
    answer:
      "We are experimenting with gluten-friendly recipes, but to avoid cross-contamination we don't currently serve gluten-free bagels in-store.",
    category: "Menu",
  },
  {
    question: "Can I pre-order for events?",
    answer:
      "Yes. For dozens or catering trays, place your order 24 hours ahead so we can proof enough dough for your pickup time.",
    category: "Ordering",
  },
  {
    question: "Do you ship nationwide?",
    answer:
      "Right now we focus on local freshness and do not ship. Same-day pickup and limited bike delivery are available in select neighborhoods.",
    category: "Shipping",
  },
  {
    question: "What time should I arrive for the best selection?",
    answer:
      "Early! We bake all day, but signature flavors like everything, sesame, and cinnamon maple move fastest before 11 a.m.",
    category: "Visiting",
  },
  {
    question: "Are there vegan or dairy-free options?",
    answer:
      "Yes. Our classic dough is dairy-free, and we rotate vegan schmears and plant-based specials every week.",
    category: "Menu",
  },
  {
    question: "Can I customize a flavor?",
    answer:
      "For large orders (3+ dozen), we can schedule custom toppings or finishes. Email us with your ideas and timing.",
    category: "Ordering",
  },
  {
    question: "What happens to leftovers?",
    answer:
      "We donate unsold bakes daily to local partners and community fridges, keeping waste low and neighbors fed.",
    category: "Community",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const heroRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.05,
          ease: "power2.out",
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-14">
      <section
        ref={heroRef}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 via-white to-orange-100 px-8 py-14 shadow-lg"
      >
        <div className="absolute inset-0">
          <div className="absolute -left-10 top-6 h-32 w-32 rounded-full bg-orange-200/60 blur-3xl" />
          <div className="absolute right-4 bottom-4 h-28 w-28 rounded-full bg-amber-300/50 blur-3xl" />
        </div>
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-800">
              FAQ
            </p>
            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              Answers baked fresh for{" "}
              <span className="main-color">bagel lovers</span>.
            </h1>
            <p className="text-lg text-gray-700">
              Quick details on freshness, ordering, and how we care for the
              community. If you do not see your question, drop by or send us a
              note—we are always happy to chat.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Ordering", "Menu", "Visiting", "Community"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-amber-300/70 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-900 shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="relative rounded-2xl border border-amber-100/80 bg-white/80 p-6 shadow-xl backdrop-blur">
            <div className="absolute -right-4 -top-6 h-24 w-24 rounded-full bg-amber-500/20 blur-2xl" />
            <div className="absolute left-4 bottom-4 h-20 w-20 rounded-full bg-orange-300/20 blur-2xl" />
            <div className="relative space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
                Need it fast?
              </h3>
              <div className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4 text-white shadow-lg">
                <p className="text-base font-semibold">Same-day pickup</p>
                <p className="text-sm text-amber-50">
                  Order online before 10 a.m. for noon pickup. Fresh batches hit
                  the racks every hour.
                </p>
              </div>
              <div className="rounded-xl border border-amber-200/60 bg-amber-50/60 px-5 py-4 text-amber-900">
                <p className="text-base font-semibold">Talk to a human</p>
                <p className="text-sm">
                  Email mybage1123@mybagel.com or call (647) 616-4699 for catering or
                  custom flavors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-800">
            Common questions
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            We keep it simple, warm, and clear.
          </h2>
          <p className="text-lg text-gray-700">
            Tap a question to reveal the details. Everything from bake schedules
            to custom orders is here, with real answers from the team that rolls
            the dough.
          </p>
        </div>
        <div className="grid gap-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <button
                  className="flex w-full items-center justify-between gap-3 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                      {item.category}
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {item.question}
                    </p>
                  </div>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-amber-800 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0">
                    <p className="pt-3 text-sm text-gray-700">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section
        className="overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 px-8 py-10 text-white shadow-xl"
        ref={(el) => {
          cardsRef.current[faqs.length] = el;
        }}
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]">
              Still curious?
            </p>
            <h3 className="text-3xl font-bold sm:text-4xl">
              Stop in, call us, or send a note.
            </h3>
            <p className="text-base text-amber-50">
              We are real people who love talking bagels. Whether it is a custom
              order, allergen question, or a flavor idea, reach out and we will
              bake a plan together.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur">
              <p className="text-sm font-semibold">Email</p>
              <p className="text-sm text-amber-100">mybage1123@mybagel.com</p>
            </div>
            <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur">
              <p className="text-sm font-semibold">Phone</p>
              <p className="text-sm text-amber-100">(647) 616-4699</p>
            </div>
            {/* <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur">
              <p className="text-sm font-semibold">Visit</p>
              <p className="text-sm text-amber-100">Downtown · Westside · Riverside</p>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
}
