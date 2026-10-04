"use client";

import React, { useState } from "react";
import { useI18n } from "@/i18n/client";
import { CONTACT_DATA } from "@/data/portfolioData";
import { GlobeCanvas } from "./GlobeCanvas";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface ContactSectionProps {
  className?: string;
  isStandalone?: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  className = "",
  isStandalone = false,
}) => {
  const { locale, t, isRTL } = useI18n();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    }, 1000);
  };

  return (
    <section
      id="contact"
      className={`relative ${isStandalone ? "py-4 sm:py-6" : "py-24 sm:py-32"} ${className}`}
    >
      <div className="portfolio-container">
        {/* Contact Container Box */}
        <div className="relative border border-[var(--border)] rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--surface)] via-[var(--surface-2)] to-[var(--surface)] p-8 sm:p-12 lg:p-14 shadow-2xl">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary)]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch relative z-10">
            {/* Left Column: Info & Details (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between text-start">
              <div>
                <div className="mb-3">
                  <Badge variant="primarySubtle" className="px-3 py-1 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                    <span>{t("contact.label")}</span>
                  </Badge>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text-bright)] tracking-tight mb-4">
                  {t("contact.title")}
                </h2>

                <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed mb-8">
                  {t("contact.description")}
                </p>
              </div>

              {/* Contact Items */}
              <div className="space-y-5 pt-6 border-t border-[var(--border)]/50 mt-auto">
                <a
                  href={`mailto:${CONTACT_DATA.email}`}
                  className="flex items-center gap-4 text-sm sm:text-base text-[var(--text)] hover:text-[var(--primary-light)] transition-colors group"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary-light)] group-hover:scale-105 transition-transform shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm">
                    {CONTACT_DATA.email}
                  </span>
                </a>

                <a
                  href={`tel:${CONTACT_DATA.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-4 text-sm sm:text-base text-[var(--text)] hover:text-[var(--primary-light)] transition-colors group"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary-light)] group-hover:scale-105 transition-transform shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm" dir="ltr">
                    {CONTACT_DATA.phone}
                  </span>
                </a>

                <div className="flex items-center gap-4 text-sm sm:text-base text-[var(--text)]">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary-light)] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span>{CONTACT_DATA.location[locale]}</span>
                </div>
              </div>
            </div>

            {/* Middle Column: Interactive Form (5 cols) */}
            <div className="lg:col-span-5 text-start flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder={t("contact.namePlaceholder")}
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder={t("contact.emailPlaceholder")}
                    />
                  </div>
                </div>

                <div>
                  <Textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder={t("contact.messagePlaceholder")}
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-xl animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{t("contact.errorMsg")}</span>
                  </div>
                )}

                {status === "success" && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl animate-in fade-in">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{t("contact.successMsg")}</span>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    variant="outline"
                    type="submit"
                    size="lg"
                    disabled={status === "submitting"}
                    className="w-full sm:w-auto h-12 px-8 text-sm sm:text-base font-bold rounded-xl"
                  >
                    <span>
                      {status === "submitting"
                        ? t("contact.sending")
                        : t("contact.submitBtn")}
                    </span>
                    <Send
                      className={`w-4 h-4 ${isRTL ? "scale-x-[-1]" : ""}`}
                    />
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Column: Dot-Matrix Globe & Quote (3 cols) */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center text-center pt-2">
              <GlobeCanvas />
              <div className="mt-4 text-center max-w-[260px]">
                <p className="text-xs sm:text-sm font-medium text-[var(--muted)] italic leading-relaxed">
                  &ldquo;{t("contact.quote")}&rdquo;
                </p>
                <div className="w-16 h-[1.5px] bg-[var(--primary)]/60 mx-auto mt-3 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
