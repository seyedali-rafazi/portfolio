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
  const { t, isRTL } = useI18n();
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
      .min(10, t("proposal.descriptionRequired", "Please enter your project details (min 10 characters)"))
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
    { id: "dataAnalyst", label: t("proposal.categories.dataAnalyst", "Data Analyst") },
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

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isImage = file.type.startsWith("image/");

    if (!isPdf && !isImage) {
      setFileError("Only PDF or Image files (PNG, JPG, WEBP, GIF) are accepted.");
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
    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setSubmitSuccess(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitSuccess(false);
      reset();
      setAttachment(null);
      setFileError(null);
    }, 2500);
  };

  return (
    <>
      {/* Floating Action Button (FAB) on Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#1683ff] to-[#005cd8] text-white shadow-[0_8px_25px_rgba(22,131,255,0.45)] hover:shadow-[0_12px_35px_rgba(22,131,255,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 border border-white/25 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/30"
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
          <span className="pointer-events-none absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-zinc-900/95 border border-white/10 text-white text-xs font-medium shadow-xl whitespace-nowrap opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 hidden sm:block">
            {t("proposal.fabTooltip", "Send Project Proposal")}
          </span>
        </button>
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-[480px] bg-[#141824] text-white border border-[#232a3b] rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] p-5 sm:p-6 animate-in zoom-in-95 duration-200 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-xl font-bold tracking-tight text-white">
                {t("proposal.title", "Send Project Proposal")}
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              /* Success State */
              <div className="py-8 flex flex-col items-center text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white">
                    {t("proposal.submitted", "Proposal Sent Successfully!")}
                  </h3>
                  <p className="text-sm text-zinc-400 max-w-xs leading-relaxed">
                    {t(
                      "proposal.successMessage",
                      "Thank you! Your proposal has been received. I'll get back to you via your email soon."
                    )}
                  </p>
                </div>
              </div>
            ) : (
              /* React Hook Form with Zod */
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
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
                            setValue("category", item.id, { shouldValidate: false })
                          }
                          className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-colors duration-150 cursor-pointer select-none ${
                            isSelected
                              ? "bg-white text-zinc-950 border-white shadow-sm"
                              : "bg-[#1f2636] hover:bg-[#293245] text-zinc-300 hover:text-white border-white/10"
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
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    {t("proposal.emailLabel", "Email (Required)")}
                    <span className="text-rose-400 ml-1">*</span>
                  </label>
                  <div
                    className={`relative rounded-xl bg-[#0d1017] border px-3.5 py-2.5 flex items-center gap-2.5 transition-colors ${
                      errors.email
                        ? "border-rose-500/80 focus-within:border-rose-500 ring-1 ring-rose-500/20"
                        : "border-[#232b3d] focus-within:border-blue-500/70"
                    }`}
                  >
                    <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                    <input
                      type="email"
                      {...register("email")}
                      placeholder={t("proposal.emailPlaceholder", "your.email@example.com")}
                      className="w-full bg-transparent text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none"
                    />
                  </div>
                  {errors.email && (
                    <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email.message}</span>
                    </p>
                  )}
                </div>

                {/* Textarea Container with 0/2000 Counter */}
                <div>
                  <div
                    className={`relative rounded-2xl bg-[#0d1017] border p-3.5 transition-colors ${
                      errors.description
                        ? "border-rose-500/80 focus-within:border-rose-500 ring-1 ring-rose-500/20"
                        : "border-[#232b3d] focus-within:border-blue-500/70"
                    }`}
                  >
                    <textarea
                      rows={4}
                      maxLength={2000}
                      {...register("description")}
                      placeholder={t(
                        "proposal.feedbackPlaceholder",
                        "Describe your project proposal, objectives, or scope..."
                      )}
                      className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none resize-none leading-relaxed"
                    />
                    <div className="flex items-center justify-end pt-2">
                      <span className="text-xs text-zinc-500 font-mono select-none">
                        {descriptionValue.length}/2000
                      </span>
                    </div>
                  </div>
                  {errors.description && (
                    <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.description.message}</span>
                    </p>
                  )}
                </div>

                {/* Attachments (PDF or Image only) */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
                    {t("proposal.attachmentsLabel", "Attachment (optional - PDF or Image)")}
                  </label>

                  {/* Upload Button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-[#1f2636] hover:bg-[#2a3347] text-zinc-200 border border-white/10 transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-blue-400" />
                      <span>{t("proposal.uploadFile", "Upload File (PDF / Image)")}</span>
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf,image/*"
                      className="hidden"
                      onChange={handleFileInputChange}
                    />
                  </div>

                  {/* File Error */}
                  {fileError && (
                    <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fileError}</span>
                    </p>
                  )}

                  {/* Attachment Preview (PDF or Image) */}
                  {attachment && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-[#0d1017] border border-blue-500/30 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {attachment.isPdf ? (
                          <div className="w-10 h-10 rounded-lg bg-rose-500/15 border border-rose-500/30 flex flex-col items-center justify-center text-rose-400 shrink-0">
                            <FileText className="w-5 h-5" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">PDF</span>
                          </div>
                        ) : (
                          <img
                            src={attachment.previewUrl}
                            alt="Attachment preview"
                            className="w-10 h-10 object-cover rounded-lg border border-white/10 shrink-0"
                          />
                        )}
                        <div className="truncate text-xs">
                          <p className="text-zinc-200 font-medium truncate">{attachment.name}</p>
                          <p className="text-zinc-500">{formatFileSize(attachment.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeAttachment}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/5 transition-colors shrink-0"
                        title={t("proposal.removeFile", "Remove file")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Note */}
                  <p className="text-[11px] sm:text-xs text-zinc-400 mt-2 leading-relaxed">
                    {t(
                      "proposal.pasteNote",
                      "Supports PDF or Images (PNG, JPG, WEBP). You can also paste an image from your clipboard."
                    )}
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer bg-gradient-to-r from-[#1683ff] to-[#005cd8] text-white hover:brightness-110 shadow-lg shadow-blue-500/25 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t("proposal.submitting", "Submitting Proposal...")}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t("proposal.submitBtn", "Submit Proposal")}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
