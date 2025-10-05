"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";

export default function UploadResume() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please select a valid PDF file");
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !file) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("file", file);

      const res = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      router.push(`/resume/${data.resumeId}`);
    } catch (err: any) {
      alert("Error uploading resume: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 md:px-20 py-8 bg-[#F9FAFB]">
      <div className="max-w-2xl mx-auto my-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] bg-clip-text text-transparent">
          Upload Your Resume
        </h1>
        <p className="text-[#6B7280] text-center mb-8 leading-relaxed">
          Share your resume and start chatting with AI for personalized insights
        </p>

        <Card className="p-6 md:p-8 bg-white rounded-xl shadow-md hover:shadow-lg hover:border hover:border-[#3B82F6] transition">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="name"
                className="text-[#111827] font-medium mb-2 block"
              >
                Your Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="border-[#E5E7EB] rounded-xl focus:border-[#3B82F6] focus:ring-[#3B82F6]"
              />
            </div>

            <div>
              <Label
                htmlFor="resume"
                className="text-[#111827] font-medium mb-2 block"
              >
                Resume (PDF only)
              </Label>
              <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center hover:border-[#3B82F6] transition-colors group">
                <Upload className="w-12 h-12 text-[#6B7280] mx-auto mb-4 group-hover:text-[#3B82F6]" />
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                  className="hidden"
                />
                <Label
                  htmlFor="resume"
                  className="cursor-pointer text-[#6B7280] hover:text-[#111827]"
                >
                  {file ? (
                    <span className="text-[#111827] font-medium">
                      {file.name}
                    </span>
                  ) : (
                    <>
                      <span className="text-[#111827] font-medium">
                        Click to upload
                      </span>
                      <span className="text-[#6B7280]"> or drag and drop</span>
                    </>
                  )}
                </Label>
                <p className="text-sm text-[#6B7280] mt-2">PDF files only</p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3B82F6] hover:bg-[#1E3A8A] text-white py-6 rounded-xl text-base font-medium"
            >
              {isSubmitting ? "Processing..." : "Continue"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}