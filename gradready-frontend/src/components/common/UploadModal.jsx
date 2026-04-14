import React, { useState, useRef, useCallback } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg'];
const MAX_SIZE_MB = 25;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function UploadModal({ department, requirement, onClose, onUpload }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = useCallback((file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only PDF and JPEG files are accepted.';
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `File size must be under ${MAX_SIZE_MB}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file) => {
      setError(null);
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setSelectedFile(file);
    },
    [validateFile]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setUploading(true);
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onUpload(department.id, requirement.id, selectedFile);
    setUploading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div
        className="modal-content animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div>
            <h3 className="text-xl font-heading text-white tracking-wider">
              Upload Document
            </h3>
            <p className="text-xs font-body text-white/40 mt-0.5">
              {department.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            id="close-upload-modal"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Requirement Info */}
        <div className="px-5 pt-4">
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
            <p className="text-sm font-body text-white/80 font-medium">
              {requirement.description}
            </p>
            {requirement.dueDate && (
              <p className="text-xs font-body text-white/30 mt-1">
                Due: {new Date(requirement.dueDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>

          {/* Revision Note */}
          {requirement.status === 'needs_revision' && requirement.revisionNote && (
            <div className="mt-3 bg-status-revision/10 border border-status-revision/20 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-status-revision flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-body font-semibold text-status-revision">
                    Revision Required
                  </p>
                  <p className="text-xs font-body text-status-revision/70 mt-0.5">
                    {requirement.revisionNote}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upload Zone */}
        <div className="p-5">
          <div
            className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg"
              onChange={handleInputChange}
              className="hidden"
              id="file-upload-input"
            />
            <Upload className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-sm font-body text-white/60 font-medium">
              Drag & drop your file here
            </p>
            <p className="text-xs font-body text-white/30 mt-1">
              or click to browse
            </p>
            <p className="text-[11px] font-body text-white/20 mt-3">
              PDF or JPEG • Max {MAX_SIZE_MB}MB
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-3 flex items-center gap-2 text-status-missing text-xs font-body animate-fade-in">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Selected File Preview */}
          {selectedFile && (
            <div className="mt-4 bg-white/[0.03] rounded-xl p-4 border border-white/5 flex items-center gap-3 animate-slide-up">
              <div className="w-10 h-10 rounded-lg bg-usa-maroon/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-usa-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body text-white/80 truncate font-medium">
                  {selectedFile.name}
                </p>
                <p className="text-xs font-body text-white/30">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-status-cleared flex-shrink-0" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm font-body font-medium hover:bg-white/5 transition-colors"
            id="cancel-upload-btn"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || uploading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-body font-semibold transition-all duration-300 ${
              selectedFile && !uploading
                ? 'bg-gradient-to-r from-usa-maroon to-usa-maroon-light text-white hover:shadow-lg hover:shadow-usa-maroon/30 hover:-translate-y-0.5'
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
            id="submit-upload-btn"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Uploading...
              </span>
            ) : (
              'Submit Document'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
