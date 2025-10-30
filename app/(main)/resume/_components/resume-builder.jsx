"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Pencil,
  Save,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveResume } from "@/app/actions/resume";
import { improveWithAI } from "@/app/actions/resume";
import { EntryForm } from "./entry-form";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";
import dynamic from "next/dynamic";

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState("preview");

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab]);

  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user.fullName}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary — enhanced with AI\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedSummary,
    error: improveError,
  } = useFetch(improveWithAI);

  useEffect(() => {
    if (improvedSummary && !isImproving) {
      setValue("summary", improvedSummary);
      setPreviewContent(getCombinedContent());
      toast.success("Professional summary enhanced successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve summary");
    }
  }, [improvedSummary, improveError, isImproving, setValue]);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById("resume-pdf");
      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      // Dynamically import html2pdf only on the client side
      const html2pdf = (await import("html2pdf.js/dist/html2pdf.min.js")).default;
      await html2pdf().set(opt).from(element).save();
      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formattedContent = previewContent
        .replace(/\n/g, "\n")
        .replace(/\n\s*\n/g, "\n\n")
        .trim();

      await saveResumeFn(previewContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div data-color-mode="light" className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-slate-800 to-slate-900/50 p-4 rounded-lg">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">Resume Status</p>
          <p className="text-sm text-gray-100">
            {previewContent ? "Draft saved" : "No content yet"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20 transition-all duration-300 ease-in-out hover:scale-105"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Resume
              </>
            )}
          </Button>
          <Button
            onClick={generatePDF}
            disabled={isGenerating}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/20 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-white/10"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger
            value="edit"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <div className="flex items-center">
              <Pencil className="h-4 w-4 mr-2" />
              Resume Form
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <div className="flex items-center">
              <Monitor className="h-4 w-4 mr-2" />
              Preview & Edit
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <div className="space-y-8 bg-card/30 border border-white/10 backdrop-blur-sm rounded-lg p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-background/50 border border-white/10">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <Input
                      {...register("contactInfo.email")}
                      type="email"
                      className="bg-transparent border-white/20"
                      placeholder="your@email.com"
                      error={errors.contactInfo?.email}
                    />
                    {errors.contactInfo?.email && (
                      <p className="text-sm text-red-500">
                        {errors.contactInfo.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Mobile Number
                    </label>
                    <Input
                      {...register("contactInfo.mobile")}
                      type="tel"
                      className="bg-transparent border-white/20"
                      placeholder="+1 234 567 8900"
                    />
                    {errors.contactInfo?.mobile && (
                      <p className="text-sm text-red-500">
                        {errors.contactInfo.mobile.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      LinkedIn URL
                    </label>
                    <Input
                      {...register("contactInfo.linkedin")}
                      type="url"
                      className="bg-transparent border-white/20"
                      placeholder="https://linkedin.com/in/your-profile"
                    />
                    {errors.contactInfo?.linkedin && (
                      <p className="text-sm text-red-500">
                        {errors.contactInfo.linkedin.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Twitter/X Profile
                    </label>
                    <Input
                      {...register("contactInfo.twitter")}
                      type="url"
                      className="bg-transparent border-white/20"
                      placeholder="https://twitter.com/your-handle"
                    />
                    {errors.contactInfo?.twitter && (
                      <p className="text-sm text-red-500">
                        {errors.contactInfo.twitter.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
                  Professional Summary — enhanced with AI
                </h3>
                <Controller
                  name="summary"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="h-32 bg-transparent border-white/20"
                      placeholder="Write a compelling professional summary (enhanced with AI)..."
                      error={errors.summary}
                    />
                  )}
                />
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const current = watch("summary");
                      if (!current) {
                        toast.error("Please enter a summary first");
                        return;
                      }
                      await improveWithAIFn({ current, type: "summary" });
                    }}
                    disabled={isImproving || !watch("summary")}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20 transition-all duration-300 ease-in-out hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isImproving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enhancing summary...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                        Enhance with AI
                      </>
                    )}
                  </Button>
                </div>
                {errors.summary && (
                  <p className="text-sm text-red-500">{errors.summary.message}</p>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
                  Skills
                </h3>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="h-32 bg-transparent border-white/20"
                      placeholder="List your key skills..."
                      error={errors.skills}
                    />
                  )}
                />
                {errors.skills && (
                  <p className="text-sm text-red-500">{errors.skills.message}</p>
                )}
              </div>

              {/* Experience */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
                  Work Experience
                </h3>
                <Controller
                  name="experience"
                  control={control}
                  render={({ field }) => (
                    <EntryForm
                      type="Experience"
                      entries={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.experience && (
                  <p className="text-sm text-red-500">
                    {errors.experience.message}
                  </p>
                )}
              </div>

              {/* Education */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
                  Education
                </h3>
                <Controller
                  name="education"
                  control={control}
                  render={({ field }) => (
                    <EntryForm
                      type="Education"
                      entries={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.education && (
                  <p className="text-sm text-red-500">
                    {errors.education.message}
                  </p>
                )}
              </div>

              {/* Projects */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
                  Projects
                </h3>
                <Controller
                  name="projects"
                  control={control}
                  render={({ field }) => (
                    <EntryForm
                      type="Project"
                      entries={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.projects && (
                  <p className="text-sm text-red-500">
                    {errors.projects.message}
                  </p>
                )}
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          {activeTab === "preview" && (
            <Button
              variant="outline"
              type="button"
              className="mb-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20 transition-all duration-300 ease-in-out hover:scale-105"
              onClick={() =>
                setResumeMode(resumeMode === "preview" ? "edit" : "preview")
              }
            >
              {resumeMode === "preview" ? (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Resume
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4 mr-2" />
                  Show Preview
                </>
              )}
            </Button>
          )}

          {activeTab === "preview" && resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center bg-yellow-950/50 border border-yellow-600/50 text-yellow-600 rounded-lg mb-4">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You will lose edited markdown if you update the form data.
              </span>
            </div>
          )}
          <div className="border border-white/10 rounded-lg shadow-sm bg-background/50">
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
              className="bg-background"
              previewOptions={{
                className: "prose prose-slate max-w-none p-8 bg-background",
              }}
            />
          </div>
          <div className="hidden">
            <div id="resume-pdf">
              <MDEditor.Markdown
                source={previewContent}
                style={{
                  background: "white",
                  color: "black",
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}