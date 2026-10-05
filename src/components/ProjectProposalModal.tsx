"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MessageSquare,
  X,
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  Trash2,
  Send,
  Mail,
  AlertCircle,
} from "lucide-react";
import { useI18n } from "@/i18n/useI18n";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { toPersianDigits } from "@/lib/numbers";

const CATEGORIES = ["frontend", "backend", "ai", "seo", "dataAnalyst"] as const;
type CategoryType = (typeof CATEGORIES)[number];

interface AttachmentData {
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  isPdf: boolean;
}

export function ProjectProposalModal() {
  const { locale, t, isRTL } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [attachment, setAttachment] = useState<AttachmentData | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Dynamic Zod Schema using localized or default error messages
  const proposalSchema = z.object({
    category: z.enum(CATEGORIES),
    email: z
      .string()
      .min(1, t("proposal.emailRequired", "Email address is required"))
      .email(t("proposal.emailInvalid", "Please enter a valid email address")),
    description: z
      .string()
      .min(
        10,
        t(
          "proposal.descriptionRequired",
          "Please enter your project details (min 10 characters)",
        ),
      )
      .max(2000, "Maximum 2000 characters allowed"),
  });

  type ProposalFormData = z.infer<typeof proposalSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      category: "frontend",
      email: "",
      description: "",
    },
    mode: "onTouched",
  });

  const selectedCategory = watch("category");
  const descriptionValue = watch("description") || "";

  const categoryList: { id: CategoryType; label: string }[] = [
    { id: "frontend", label: t("proposal.categories.frontend", "Frontend") },
    { id: "backend", label: t("proposal.categories.backend", "Backend") },
    { id: "ai", label: t("proposal.categories.ai", "AI") },
    { id: "seo", label: t("proposal.categories.seo", "SEO") },
    {
      id: "dataAnalyst",
      label: t("proposal.categories.dataAnalyst", "Data Analyst"),
    },
  ];

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Handle clipboard paste for images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!isOpen) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isOpen]);

  // Process file upload (PDF or Image)
  const processFile = (file: File) => {
    setFileError(null);

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    const isImage = file.type.startsWith("image/");

    if (!isPdf && !isImage) {
      setFileError(
        "Only PDF or Image files (PNG, JPG, WEBP, GIF) are accepted.",
      );
      return;
    }

    // Limit to 10MB
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setFileError("File size must be under 10MB.");
      return;
    }

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachment({
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          previewUrl: event.target?.result as string,
          isPdf: false,
        });
      };
      reader.readAsDataURL(file);
    } else {
      // PDF File
      setAttachment({
        file,
        name: file.name,
        size: file.size,
        type: file.type || "application/pdf",
        isPdf: true,
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = "";
  };

  const removeAttachment = () => {
    setAttachment(null);
    setFileError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const onSubmit = async (data: ProposalFormData) => {
    try {
      const messageContent = attachment
        ? `${data.description}\n\n[Attachment: ${attachment.name} (${formatFileSize(attachment.size)})]`
        : data.description;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Proposal [${data.category.toUpperCase()}]`,
          email: data.email,
          message: messageContent,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit proposal");
      }

      setSubmitSuccess(true);
      toast.success(t("proposal.successMsg", "Your project proposal has been received!"));
      setTimeout(() => {
        setIsOpen(false);
        setSubmitSuccess(false);
        reset();
        setAttachment(null);
        setFileError(null);
      }, 2500);
    } catch (err: any) {
      const errorMsg = err.message || "Failed to send proposal. Please try again.";
      setFileError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) on Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <motion.button
          type="button"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.4,
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#1683ff] to-[#005cd8] text-white shadow-[0_8px_25px_rgba(22,131,255,0.45)] hover:shadow-[0_12px_35px_rgba(22,131,255,0.65)] transition-all duration-300 border border-white/25 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          aria-label={t("proposal.fabTooltip", "Send Project Proposal")}
          title={t("proposal.fabTooltip", "Send Project Proposal")}
        >
          {/* Subtle Activity Pulse Dot */}
          <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 border-2 border-white shadow-sm" />
          </span>

          <MessageSquare className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />

          {/* Desktop Hover Tooltip */}
          <span className="pointer-events-none absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-bright)] text-xs font-medium shadow-xl whitespace-nowrap opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 hidden sm:block">
            {t("proposal.fabTooltip", "Send Project Proposal")}
          </span>
        </motion.button>
      </div>

      {/* Modal Dialog with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.92, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 18 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[480px] bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 overflow-hidden z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4">
                <h2 className="text-xl font-bold tracking-tight text-[var(--text-bright)]">
                  {t("proposal.title", "Send Project Proposal")}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--text-bright)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitSuccess ? (
                /* Success State */
                <div className="py-8 flex flex-col items-center text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-[var(--text-bright)]">
                      {t("proposal.submitted", "Proposal Sent Successfully!")}
                    </h3>
                    <p className="text-sm text-[var(--muted)] max-w-xs leading-relaxed">
                      {t(
                        "proposal.successMessage",
                        "Thank you! Your proposal has been received. I'll get back to you via your email soon.",
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                /* React Hook Form with Zod */
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2.5">
                      {t("proposal.category", "Category")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categoryList.map((item) => {
                        const isSelected = selectedCategory === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                              setValue("category", item.id, {
                                shouldValidate: false,
                              })
                            }
                            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-colors duration-150 cursor-pointer select-none ${
                              isSelected
                                ? "bg-[var(--text-bright)] text-[var(--bg)] border-[var(--text-bright)] shadow-sm"
                                : "bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--muted)] hover:text-[var(--text-bright)] border-[var(--border)]"
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Email Field (Required) */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                      {t("proposal.emailLabel", "Email (Required)")}
                      <span className="text-rose-500 ml-1">*</span>
                    </label>
                    <div
                      className={`relative rounded-xl bg-[var(--surface-2)] border px-3.5 py-2.5 flex items-center gap-2.5 transition-colors ${
                        errors.email
                          ? "border-rose-500 ring-1 ring-rose-500/20"
                          : "border-[var(--border)] focus-within:border-[var(--primary)]"
                      }`}
                    >
                      <Mail className="w-4 h-4 text-[var(--muted)] shrink-0" />
                      <input
                        type="email"
                        {...register("email")}
                        placeholder={t(
                          "proposal.emailPlaceholder",
                          "your.email@example.com",
                        )}
                        className="w-full bg-transparent text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted-2)] outline-none"
                      />
                    </div>
                    {errors.email && (
                      <p className="flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-400 mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Textarea Container with 0/2000 Counter */}
                  <div>
                    <div
                      className={`relative rounded-2xl bg-[var(--surface-2)] border p-3.5 transition-colors ${
                        errors.description
                          ? "border-rose-500 ring-1 ring-rose-500/20"
                          : "border-[var(--border)] focus-within:border-[var(--primary)]"
                      }`}
                    >
                      <textarea
                        rows={4}
                        maxLength={2000}
                        {...register("description")}
                        placeholder={t(
                          "proposal.feedbackPlaceholder",
                          "Describe your project proposal, objectives, or scope...",
                        )}
                        className="w-full bg-transparent text-sm text-[var(--text)] placeholder-[var(--muted-2)] outline-none resize-none leading-relaxed"
                      />
                      <div className="flex items-center justify-end pt-2">
                        <span className="text-xs text-[var(--muted-2)] select-none">
                          {locale === "fa"
                            ? `${toPersianDigits(descriptionValue.length)} / ${toPersianDigits(2000)}`
                            : `${descriptionValue.length}/2000`}
                        </span>
                      </div>
                    </div>
                    {errors.description && (
                      <p className="flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-400 mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.description.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white hover:brightness-110 shadow-lg shadow-[var(--glow)] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>
                          {t("proposal.submitting", "Submitting Proposal...")}
                        </span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>
                          {t("proposal.submitBtn", "Submit Proposal")}
                        </span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
