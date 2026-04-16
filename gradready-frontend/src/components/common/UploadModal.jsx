import React, { useState, useRef, useCallback } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg'];
const MAX_SIZE_MB = 25;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function UploadModal({ department, requirement, onClose, onUpload, uploading }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
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
    onUpload(department.id, requirement.id, selectedFile);
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
        <div className="flex items-center justify-between p-5 border-b border-[#27272a]">
          <div>
            <h3 className="text-base font-semibold text-white">
              Upload Document
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {department.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-[#27272a] hover:bg-[#3f3f46] flex items-center justify-center transition-colors"
            id="close-upload-modal"
          >
            <X className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>

        {/* Requirement Info */}
        <div className="px-5 pt-4">
          <div className="bg-[#111114] rounded-lg p-3.5 border border-[#27272a]">
            <p className="text-sm text-zinc-300 font-medium">
              {requirement.description}
            </p>
            {requirement.dueDate && (
              <p className="text-xs text-zinc-500 mt-1">
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
            <div className="mt-3 bg-status-revision/8 border border-status-revision/15 rounded-lg p-3.5">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-status-revision flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-status-revision">
                    Revision Required
                  </p>
                  <p className="text-xs text-status-revision/70 mt-0.5">
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
            <Upload className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-400 font-medium">
              Drag & drop your file here
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              or click to browse
            </p>
            <p className="text-[11px] text-zinc-700 mt-3">
              PDF or JPEG • Max {MAX_SIZE_MB}MB
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-3 flex items-center gap-2 text-status-missing text-xs animate-fade-in">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Selected File Preview */}
          {selectedFile && (
            <div className="mt-3 bg-[#111114] rounded-lg p-3.5 border border-[#27272a] flex items-center gap-3 animate-fade-in">
              <div className="w-9 h-9 rounded-lg bg-maroon/20 flex items-center justify-center">
                <FileText className="w-4 h-4 text-maroon-light" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-300 truncate font-medium">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-status-cleared flex-shrink-0" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-[#27272a] text-zinc-400 text-sm font-medium hover:bg-[#1c1c1f] transition-colors"
            id="cancel-upload-btn"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || uploading}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              selectedFile && !uploading
                ? 'bg-maroon text-white hover:bg-maroon-light'
                : 'bg-[#27272a] text-zinc-600 cursor-not-allowed'
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
