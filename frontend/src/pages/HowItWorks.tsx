import React from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  CalendarClock,
  Wallet,
  Navigation,
  ShieldCheck,
  Clock3,
  KeySquare,
  Sparkles,
  ClipboardCheck,
  Fuel,
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: 'Browse Vehicles',
      description:
        'Explore curated exotics with filters for seating, luggage, and performance. Each card shows real-time availability, delivery options, and concierge notes so you know what to expect before you click.',
      icon: Car,
      checklist: ['Live availability and blackout dates', 'Delivery or pickup options on every listing', 'Concierge notes for trim, charging, and luggage'],
      cta: 'View inventory',
      link: '/#inventory',
    },
    {
      title: 'Choose Dates',
      description:
        'Lock pickup and return windows with instant confirmation. We automatically add prep buffers for detailing, charging, or fueling so your car is spotless when you arrive.',
      icon: CalendarClock,
      checklist: ['Minute-by-minute time selection', 'Automatic buffers for prep and cleaning', 'SMS + email confirmations'],
      cta: 'Plan your trip',
      link: '/#inventory',
    },
    {
      title: 'Pay Deposit',
      description:
        'Secure your reservation with a transparent deposit breakdown. Insurance add-ons, holds, and cancellation windows are shown before you pay.',
      icon: Wallet,
      checklist: ['Upfront totals with taxes and fees', 'Insurance and add-ons itemized', 'Receipts sent instantly'],
      cta: 'Check rates',
      link: '/checkout',
    },
    {
      title: 'Pick Up',
      description:
        'Meet at the airport, hotel, or curbside. A specialist texts their photo and ETA, then walks you through a 5-minute digital checklist so you can drive off with confidence.',
      icon: KeySquare,
      checklist: ['Live driver location + photo', 'Digital condition photos and signatures', 'Performance modes and preferences set with you'],
      cta: 'See pickup options',
      link: '/vehicle/1',
    },
    {
      title: 'Return Policy',
      description:
        'Flexible return windows with self drop-off or concierge meetups. We handle refueling, light detailing, and quick condition review so you can make your next flight.',
      icon: ShieldCheck,
      checklist: ['Return reminders with directions', 'Optional fueling/charging add-on', 'Instant damage review and receipts'],
      cta: 'Review policy',
      link: '/checkout',
    },
  ];

  return (
    <div className="bg-black text-gray-100 min-h-screen">
      <section className="relative overflow-hidden border-b border-gray-900 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="reveal-on-scroll animate-fade-up">
            <p className="text-red-300 uppercase tracking-[0.3em] text-xs mb-3">How it works</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              From search to ignition, every step stays concierge-smooth.
            </h1>
            <p className="text-gray-400 max-w-3xl text-lg">
              Exotic Rentals pairs white-glove service with clear milestones so you always know what happens next. Follow the flow below or talk to the AI concierge any time for live assistance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/#inventory"
                className="bg-red-400 text-black px-6 py-3 rounded-full font-semibold shadow-lg transition transform hover:-translate-y-0.5 button-glow"
              >
                Browse the fleet
              </Link>
              <Link to="/checkout" className="px-6 py-3 rounded-full border border-gray-800 text-gray-100 hover:bg-gray-900 transition">
                Start a booking
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-on-scroll">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="bg-gray-950 border border-gray-900 rounded-2xl p-6 shadow-xl hover:-translate-y-1 transition transform duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-12 w-12 rounded-full bg-black border border-gray-800 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-red-300" />
                  </span>
                  <span className="text-xs uppercase tracking-wide text-gray-400">Step {index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{step.description}</p>
                <ul className="space-y-2 text-sm text-gray-300 mb-4">
                  {step.checklist.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-300 mt-2" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to={step.link} className="inline-flex items-center text-red-300 text-sm font-semibold hover:text-red-200">
                  {step.cta}
                  <span className="ml-2">→</span>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start reveal-on-scroll">
          <div className="bg-gradient-to-b from-gray-950 to-black border border-gray-900 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Your timeline at a glance</h2>
            <div className="space-y-6">
              {[{
                title: 'Concierge alignment',
                detail: 'Share flight numbers, hotel details, or event timing. We sync your booking with these milestones to adjust buffers automatically.',
                icon: Navigation,
              }, {
                title: 'Pre-trip check',
                detail: 'We verify insurance, licenses, and coverage choices. A digital pre-trip checklist is sent 24 hours before pickup.',
                icon: ShieldCheck,
              }, {
                title: 'Hand-off and return',
                detail: 'QR codes and condition photos make pickup swift. For returns, choose self drop-off or meet our specialist curbside.',
                icon: Clock3,
              }].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="h-11 w-11 rounded-xl bg-black border border-gray-800 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-red-300" />
                    </div>
                    <div>
                      <p className="text-sm text-red-200 font-semibold">{item.title}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-950 border border-gray-900 rounded-2xl p-8 shadow-2xl space-y-6">
            <h2 className="text-2xl font-bold text-white">What to expect on pickup day</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[{
                icon: ClipboardCheck,
                label: 'Digital checklist',
                copy: '5-minute walkthrough with photos, signatures, and copies sent to your email.',
              }, {
                icon: Sparkles,
                label: 'Detailed & ready',
                copy: 'Freshly detailed interiors, topped-off fuel/charge, and your preferences set.',
              }, {
                icon: Fuel,
                label: 'Add-ons on arrival',
                copy: 'Child seats, Wi‑Fi hotspots, and performance modes configured with you.',
              }, {
                icon: Navigation,
                label: 'Live arrival updates',
                copy: 'Specialist photo, ETA, and live location sharing for curbside handoffs.',
              }].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3 bg-black/40 border border-gray-900 rounded-xl p-4">
                    <div className="h-10 w-10 rounded-lg bg-gray-950 border border-gray-800 flex items-center justify-center mt-1">
                      <Icon className="h-5 w-5 text-red-300" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.copy}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-black/50 border border-gray-900 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-red-300 mt-1" />
              <p className="text-gray-300 text-sm leading-relaxed">
                Need to adjust timing? Use the dashboard to reschedule or message your concierge—buffers update automatically and you will always see the revised pickup ETA.
              </p>
            </div>
          </div>
        </div>

        <div className="reveal-on-scroll bg-gradient-to-r from-gray-950 via-black to-gray-950 border border-gray-900 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between gap-8 items-start">
            <div className="max-w-xl space-y-3">
              <p className="text-red-300 text-xs uppercase tracking-[0.25em]">Pro tips</p>
              <h3 className="text-2xl font-bold text-white">How to get the smoothest rental</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Share your flight, hotel, or event details and we align your drop-off with those milestones. You will also see live prep status (detailing, charging, fueling) inside your dashboard.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
              {[
                '24/7 concierge chat for changes',
                'Real-time rescheduling without fees inside the window',
                'Photo proof at pickup and return for peace of mind',
              ].map((tip) => (
                <div key={tip} className="bg-black/50 border border-gray-900 rounded-xl p-4 text-sm text-gray-300 leading-relaxed">
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
