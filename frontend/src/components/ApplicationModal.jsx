import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import api from "@/api/axiosClient";
import { Upload, FileText, X, CheckCircle } from "lucide-react";

export default function ApplicationModal({ open, onOpenChange, job }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setError("Only PDF files up to 5 MB are accepted");
      return;
    }
    const f = acceptedFiles[0];
    if (!f) return;
    setError("");
    setFile(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 5 * 1024 * 1024, // 5 MB
  });

  const removeFile = () => {
    setFile(null);
    setError("");
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a resume file");
      return;
    }
    setSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("jobId", job._id || job.id);
    formData.append("resume", file);

    try {
      await api.post("/api/applications", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        // Reset state for next open
        setFile(null);
        setSuccess(false);
      }, 1500);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Failed to submit application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = (val) => {
    if (!submitting) {
      onOpenChange(val);
      setFile(null);
      setError("");
      setSuccess(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Apply for{" "}
            <span className="text-indigo-600">{job?.title ?? "this job"}</span>
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center py-8 gap-3 text-green-600">
            <CheckCircle size={48} />
            <p className="font-medium text-lg">Application Submitted!</p>
          </div>
        ) : (
          <>
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700/50"
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText size={24} className="text-indigo-600" />
                  <span className="font-medium text-sm">{file.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <Upload size={32} className="text-indigo-400" />
                  <p className="text-sm font-medium">
                    {isDragActive
                      ? "Drop your PDF here…"
                      : "Drag & drop your resume, or click to browse"}
                  </p>
                  <p className="text-xs text-gray-400">PDF only, max 5 MB</p>
                </div>
              )}
            </div>

            {error && (
              <p className="text-red-600 text-sm mt-2" role="alert">
                {error}
              </p>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => handleClose(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Submitting…
                  </span>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
