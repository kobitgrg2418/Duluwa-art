"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Mail, Phone, MapPin, Clock } from "lucide-react";
import RevixNavbar from "@/components/revix-navbar";
import RevixFooter from "@/components/revix-footer";
import { toast } from "sonner";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Message sent! We'll reply shortly.");
    }, 800);
  };

  return (
    <div className="bg-[#fcfcfc] text-black min-h-screen">
      <RevixNavbar />

      {/* Hero Header */}
      <section className="rx-hero">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-12 border-b border-black/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-black/50 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ff2a2a]"></span>
              Get in Touch
            </div>
            <h1 className="rx-hero-title">
              Contact &amp;<br />
              Studio Visits
            </h1>
          </div>
          <div className="max-w-md">
            <p className="rx-hero-sub mb-6">
              Connect with our curators, inquire about available paintings, or schedule a personal
              viewing at our Thamel studio gallery.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#contact-form" className="rx-btn rx-btn-black">
                Send a Message <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <Link href="/commission" className="rx-btn rx-btn-outline">
                Commission Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Cards Info */}
      <section className="py-20 px-8 max-w-[1720px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="border-t border-black/10 pt-6">
            <span className="text-xs uppercase tracking-widest text-black/50 font-semibold block mb-2">
              Studio Location
            </span>
            <h4 className="text-xl font-bold mb-2">Thamel Gallery</h4>
            <p className="text-sm text-black/60 leading-relaxed">
              Thamel Marg, Kathmandu 44600, Nepal
            </p>
          </div>

          <div className="border-t border-black/10 pt-6">
            <span className="text-xs uppercase tracking-widest text-black/50 font-semibold block mb-2">
              Opening Hours
            </span>
            <h4 className="text-xl font-bold mb-2">Daily Viewing</h4>
            <p className="text-sm text-black/60 leading-relaxed">
              10:00 AM – 7:00 PM NPT<br />
              Open Monday through Sunday
            </p>
          </div>

          <div className="border-t border-black/10 pt-6">
            <span className="text-xs uppercase tracking-widest text-black/50 font-semibold block mb-2">
              Email Correspondence
            </span>
            <h4 className="text-xl font-bold mb-2">Direct Studio</h4>
            <p className="text-sm text-black/60 leading-relaxed">
              info@duluwaart.com<br />
              sales@duluwaart.com
            </p>
          </div>

          <div className="border-t border-black/10 pt-6">
            <span className="text-xs uppercase tracking-widest text-black/50 font-semibold block mb-2">
              Phone &amp; WhatsApp
            </span>
            <h4 className="text-xl font-bold mb-2">+977 1 4700000</h4>
            <p className="text-sm text-black/60 leading-relaxed">
              Direct artist inquiries &amp; appointments
            </p>
          </div>
        </div>
      </section>

      {/* Message Form & Map */}
      <section id="contact-form" className="py-16 px-8 max-w-[1720px] mx-auto border-t border-black/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <span className="text-xs uppercase tracking-widest text-black/50 font-semibold block mb-2">
              Inquiries
            </span>
            <h2 className="text-4xl font-bold tracking-tight mb-6">
              Send a Message
            </h2>
            <p className="text-black/70 leading-relaxed mb-8">
              Whether you are an international art collector, looking for collaboration opportunities,
              or requesting high-resolution catalog previews, we would love to hear from you.
            </p>

            {submitted ? (
              <div className="bg-black/5 p-8 rounded-2xl text-center">
                <CheckCircle2 className="w-12 h-12 text-black mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">Message Sent</h4>
                <p className="text-sm text-black/70 mb-6">
                  Thank you for reaching out. We will respond to your email as soon as possible.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="rx-btn rx-btn-black text-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-black/70 mb-2">
                    Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Your Full Name"
                    className="w-full px-4 py-3 border border-black/15 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-black/70 mb-2">
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="you@domain.com"
                    className="w-full px-4 py-3 border border-black/15 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-black/70 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we assist you?"
                    className="w-full px-4 py-3 border border-black/15 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rx-btn rx-btn-black w-full py-3.5"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-7 bg-black/5 rounded-2xl p-8 flex flex-col justify-between min-h-[450px]">
            <div>
              <span className="text-xs uppercase tracking-widest text-black/50 font-semibold block mb-2">
                Visiting Thamel
              </span>
              <h3 className="text-2xl font-bold mb-4">Location &amp; Access</h3>
              <p className="text-black/70 leading-relaxed text-sm mb-6 max-w-lg">
                Our gallery is situated in the heart of cultural Kathmandu. Walking distance from
                historic courtyards, cafes, and handicraft ateliers. Private collector viewings
                outside normal operating hours are available upon prior arrangement.
              </p>
            </div>

            <div className="border-t border-black/10 pt-6 flex flex-wrap justify-between items-center gap-4">
              <div className="text-xs uppercase tracking-widest text-black/50">
                Kathmandu Valley &bull; Nepal
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rx-btn rx-btn-outline text-xs"
              >
                Open in Google Maps <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <RevixFooter />
    </div>
  );
}
