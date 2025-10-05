import { useState, useCallback } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FileDropzone({
  file,
  setFile,
}: {
  file: File | null;
  setFile: (file: File | null) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        alert("Please select a valid PDF file");
      }
    },
    [setFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please select a valid PDF file");
      e.target.value = "";
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors
        ${
          isDragging
            ? "border-[#3B82F6] bg-blue-50"
            : "border-[#E5E7EB] bg-white"
        }
        hover:border-[#3B82F6]`}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={handleDrop}
    >
      <Upload
        className={`w-12 h-12 mx-auto mb-4 transition-colors ${
          isDragging
            ? "text-[#1E3A8A]"
            : "text-[#6B7280] group-hover:text-[#3B82F6]"
        }`}
      />
      <Input
        id="resume"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />
      <Label
        htmlFor="resume"
        className="cursor-pointer text-[#6B7280] hover:text-[#111827]"
      >
        {file ? (
          <span className="text-[#111827] font-medium">{file.name}</span>
        ) : (
          <>
            <span className="text-[#111827] font-medium">Click to upload</span>
            <span className="text-[#6B7280]"> or drag and drop</span>
          </>
        )}
      </Label>
      <p className="text-sm text-[#6B7280] mt-2">PDF files only</p>
    </div>
  );
}
