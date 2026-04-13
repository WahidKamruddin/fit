"use client"

import Navbar from "@/src/app/components/navbar";
import Footer from "@/src/app/components/footer";
import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    label: "Beta",
    price: { monthly: 0, annual: 0 },
    description: "Everything you need to get your wardrobe in order.",
    cta: "Get started",
    ctaHref: "/login",
    featured: false,
    features: [
      "Up to 50 wardrobe items",
      "Outfit builder",
      "Calendar planner",
      "Background removal on uploads",
      "Community support",
    ],
  },
  {
    name: "Premium",
    label: "Full access",
    price: { monthly: 12, annual: 99 },
    description: "The full FIT experience — unlimited wardrobe, AI styling, and priority features.",
    cta: "Join waitlist",
    ctaHref: "https://forms.gle/fedR43dq635K6jdH7",
    featured: true,
    features: [
      "Unlimited wardrobe items",
      "AI outfit generator",
      "Smart outfit suggestions",
      "Shop integrations",
      "Priority support",
      "Early access to new features",
      "Everything in Free",
    ],
  },
];

const featureRows = [
  { label: "Wardrobe items",         free: "Up to 50",    premium: "Unlimited" },
  { label: "Outfit builder",         free: true,           premium: true        },
  { label: "Calendar planner",       free: true,           premium: true        },
  { label: "Background removal",     free: true,           premium: true        },
  { label: "AI outfit generator",    free: false,          premium: true        },
  { label: "Smart suggestions",      free: false,          premium: true        },
  { label: "Shop integrations",      free: false,          premium: true        },
  { label: "Early access",           free: false,          premium: true        },
  { label: "Priority support",       free: false,          premium: true        },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-off-white-100">
      <Navbar />

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="pt-40 pb-20 px-8 sm:px-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <span className="text-[10px] text-mocha-400 tracking-[0.55em] uppercase">Plans</span>
          <div className="w-8 h-px bg-mocha-300" />
          <span className="text-[10px] text-mocha-400 tracking-[0.55em] uppercase">Pricing</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <h1
            className="font-cormorant font-light text-mocha-500 leading-[1.0] animate-fade-in-up"
            style={{ fontSize: 'clamp(3.5rem, 7vw, 12rem)', animationDelay: '0.12s' }}
          >
            Simple,<br />
            <span className="italic text-mocha-400">honest pricing.</span>
          </h1>

          {/* Billing toggle */}
          <div className="flex items-center gap-4 pb-2 animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <span className={`text-[10px] tracking-[0.4em] uppercase transition-colors duration-200 ${!annual ? 'text-mocha-500' : 'text-mocha-300'}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full border transition-all duration-300 ${annual ? 'bg-mocha-500 border-mocha-500' : 'bg-transparent border-mocha-300'}`}
              aria-label="Toggle annual billing"
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all duration-300 ${annual ? 'translate-x-6 bg-mocha-100' : 'translate-x-0 bg-mocha-400'}`} />
            </button>
            <span className={`text-[10px] tracking-[0.4em] uppercase transition-colors duration-200 ${annual ? 'text-mocha-500' : 'text-mocha-300'}`}>
              Annual
            </span>
            {annual && (
              <span className="text-[9px] tracking-[0.3em] uppercase text-mocha-100 bg-mocha-400 px-3 py-1 rounded-full">
                Save 31%
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 h-px bg-mocha-200 animate-fade-in" style={{ animationDelay: '0.3s' }} />
      </div>

      {/* ── Pricing cards ────────────────────────────────────────── */}
      <div className="pb-24 px-8 sm:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 sm:p-10 flex flex-col animate-fade-in-up ${
                plan.featured
                  ? 'bg-mocha-500 text-mocha-100'
                  : 'bg-white border border-mocha-200/60 text-mocha-500'
              }`}
              style={{ animationDelay: `${0.35 + i * 0.1}s` }}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 bg-mocha-400 text-mocha-100 text-[9px] tracking-[0.45em] uppercase rounded-full whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan name */}
              <div className="mb-8">
                <p className={`text-[10px] tracking-[0.5em] uppercase mb-3 ${plan.featured ? 'text-mocha-300' : 'text-mocha-400'}`}>
                  {plan.label}
                </p>
                <h2 className={`font-cormorant text-4xl font-light ${plan.featured ? 'text-mocha-100' : 'text-mocha-500'}`}>
                  {plan.name}
                </h2>
              </div>

              {/* Price */}
              <div className="mb-6">
                {plan.price.monthly === 0 ? (
                  <div className="flex items-baseline gap-2">
                    <span className={`font-cormorant text-5xl font-light ${plan.featured ? 'text-mocha-100' : 'text-mocha-500'}`}>
                      Free
                    </span>
                    <span className={`text-[10px] tracking-[0.3em] uppercase ${plan.featured ? 'text-mocha-300' : 'text-mocha-300'}`}>
                      during beta
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className={`font-cormorant text-5xl font-light ${plan.featured ? 'text-mocha-100' : 'text-mocha-500'}`}>
                      ${annual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className={`text-[10px] tracking-[0.3em] uppercase ${plan.featured ? 'text-mocha-300' : 'text-mocha-300'}`}>
                      / {annual ? 'year' : 'month'}
                    </span>
                  </div>
                )}
              </div>

              <p className={`text-sm leading-relaxed mb-8 ${plan.featured ? 'text-mocha-200/80' : 'text-mocha-400'}`}>
                {plan.description}
              </p>

              {/* CTA */}
              {plan.ctaHref.startsWith('http') ? (
                <a
                  href={plan.ctaHref}
                  target="_blank"
                  rel="noreferrer"
                  className={`mb-8 w-full py-3.5 rounded-full text-[10px] tracking-[0.4em] uppercase text-center transition-all duration-300 ${
                    plan.featured
                      ? 'bg-mocha-100 text-mocha-500 hover:bg-white'
                      : 'bg-mocha-500 text-mocha-100 hover:bg-mocha-400'
                  }`}
                >
                  {plan.cta}
                </a>
              ) : (
                <Link
                  href={plan.ctaHref}
                  className={`mb-8 w-full py-3.5 rounded-full text-[10px] tracking-[0.4em] uppercase text-center transition-all duration-300 ${
                    plan.featured
                      ? 'bg-mocha-100 text-mocha-500 hover:bg-white'
                      : 'bg-mocha-500 text-mocha-100 hover:bg-mocha-400'
                  }`}
                >
                  {plan.cta}
                </Link>
              )}

              {/* Divider */}
              <div className={`h-px mb-8 ${plan.featured ? 'bg-mocha-400' : 'bg-mocha-100'}`} />

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                      plan.featured ? 'bg-mocha-400' : 'bg-mocha-100'
                    }`}>
                      <Check size={9} className={plan.featured ? 'text-mocha-100' : 'text-mocha-500'} />
                    </span>
                    <span className={`text-sm leading-snug ${plan.featured ? 'text-mocha-200' : 'text-mocha-400'}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Feature comparison table ─────────────────────────────── */}
      <div className="pb-32 px-8 sm:px-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12 animate-fade-in">
          <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Compare</span>
          <div className="w-8 h-px bg-mocha-300" />
          <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">All features</span>
        </div>

        <div className="max-w-3xl border border-mocha-200/60 rounded-3xl overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-3 bg-mocha-100/50 border-b border-mocha-200/60">
            <div className="py-4 px-6" />
            <div className="py-4 px-6 text-center border-l border-mocha-200/60">
              <p className="text-[10px] tracking-[0.4em] uppercase text-mocha-400">Free</p>
            </div>
            <div className="py-4 px-6 text-center border-l border-mocha-200/60 bg-mocha-500/5">
              <p className="text-[10px] tracking-[0.4em] uppercase text-mocha-500">Premium</p>
            </div>
          </div>

          {featureRows.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-3 border-b border-mocha-200/60 last:border-b-0 ${i % 2 === 0 ? 'bg-white' : 'bg-mocha-100/20'}`}
            >
              <div className="py-4 px-6">
                <span className="text-sm text-mocha-500">{row.label}</span>
              </div>
              <div className="py-4 px-6 flex items-center justify-center border-l border-mocha-200/60">
                {typeof row.free === 'boolean' ? (
                  row.free
                    ? <Check size={14} className="text-mocha-400" />
                    : <span className="w-3 h-px bg-mocha-200 block" />
                ) : (
                  <span className="text-xs text-mocha-400 tracking-wide">{row.free}</span>
                )}
              </div>
              <div className="py-4 px-6 flex items-center justify-center border-l border-mocha-200/60 bg-mocha-500/5">
                {typeof row.premium === 'boolean' ? (
                  row.premium
                    ? <Check size={14} className="text-mocha-500" />
                    : <span className="w-3 h-px bg-mocha-200 block" />
                ) : (
                  <span className="text-xs text-mocha-500 tracking-wide font-medium">{row.premium}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
