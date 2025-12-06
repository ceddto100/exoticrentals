import React from 'react';
import { Car, CalendarClock, Wallet, Navigation, ShieldCheck, Clock3, KeySquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: 'Browse Vehicles',
      description: 'Filter by style, seating, luggage, and performance to find the perfect fit. Every listing includes real-time availability and concierge notes.',
      icon: Car,
      cta: 'View inventory',
      link: '/#inventory',
    },
    {
      title: 'Choose Dates',
      description: 'Lock in your pickup and return windows with instant confirmation. We keep buffers for detailing, charging, or fueling before handoff.',
      icon: CalendarClock,
      cta: 'Plan your trip',
      link: '/#inventory',
    },
    {
      title: 'Pay Deposit',
      description: 'Secure your reservation with a transparent deposit. Receipts, insurance add-ons, and hold amounts are shown before you pay.',
      icon: Wallet,
      cta: 'Check rates',
      link: '/checkout',
    },
    {
      title: 'Pick Up',
      description: 'Meet at the airport, hotel, or curbside. Digital checklists and photos are captured so you can drive off with confidence.',
      icon: KeySquare,
      cta: 'See pickup options',
      link: '/vehicle/1',
    },
    {
      title: 'Return Policy',
      description: 'Simple returns with flexible windows. We handle refueling, cleaning, and light detailing if you are rushing to your next stop.',
      icon: ShieldCheck,
      cta: 'Review policy',
      link: '/checkout',
    },
  ];

  return (
    <div className="bg-black text-gray-100 min-h-screen">
      <section className="relative overflow-hidden border-b border-gray-900 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="reveal-on-scroll animate-fade-up">
            <p className="text-amber-300 uppercase tracking-[0.3em] text-xs mb-3">How it works</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              From search to ignition, every step stays concierge-smooth.
            </h1>
            <p className="text-gray-400 max-w-3xl text-lg">
              Exotic Rentals pairs white-glove service with clear milestones so you always know what happens next. Follow the flow below or talk to the AI concierge any time for live assistance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/#inventory" className="bg-amber-400 text-black px-6 py-3 rounded-full font-semibold shadow-lg transition transform hover:-translate-y-0.5 button-glow">
                Browse the fleet
              </Link>
              <Link to="/checkout" className="px-6 py-3 rounded-full border border-gray-800 text-gray-100 hover:bg-gray-900 transition">
                Start a booking
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-on-scroll">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="bg-gray-950 border border-gray-900 rounded-2xl p-6 shadow-xl hover:-translate-y-1 transition transform duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-12 w-12 rounded-full bg-black border border-gray-800 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-amber-300" />
                  </span>
                  <span className="text-xs uppercase tracking-wide text-gray-400">Step {index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{step.description}</p>
                <Link to={step.link} className="inline-flex items-center text-amber-300 text-sm font-semibold hover:text-amber-200">
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
                icon: Navigation
              }, {
                title: 'Pre-trip check',
                detail: 'We verify insurance, licenses, and coverage choices. A digital pre-trip checklist is sent 24 hours before pickup.',
                icon: ShieldCheck
              }, {
                title: 'Hand-off and return',
                detail: 'QR codes and condition photos make pickup swift. For returns, choose self drop-off or meet our specialist curbside.',
                icon: Clock3
              }].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="h-11 w-11 rounded-xl bg-black border border-gray-800 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-amber-300" />
                    </div>
                    <div>
                      <p className="text-sm text-amber-200 font-semibold">{item.title}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-950 border border-gray-900 rounded-2xl p-8 shadow-2xl space-y-6">
            <h2 className="text-2xl font-bold text-white">What to expect on pickup day</h2>
            <div className="space-y-5">
              {["Arrival text with specialist photo and ETA", "Live location sharing for airport or hotel drop-offs", "5-minute vehicle tour plus digital signatures", "Optional add-ons: performance modes, child seats, Wi‑Fi hotspots", "Return reminders and quick damage review with your concierge"].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-300 mt-2" />
                  <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
