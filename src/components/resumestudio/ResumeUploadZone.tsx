import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  FileCheck,
  Check,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { parseResumeDocumentWithGemini } from '../../services/aiService';
import { extractDocumentContent } from '../../services/documentExtractor';
import { ResumeVersion, UserResumeRecord } from '../../types/resume';
import { ParsedResumeData, UserProfile } from '../../types';
import { ResumeVerificationModal } from '../common/ResumeVerificationModal';

interface ResumeUploadZoneProps {
  userId?: string;
  onUploadSuccess: (
    parsedVersion: ResumeVersion,
    rawText: string,
    newProfile: UserProfile,
    record: UserResumeRecord
  ) => void;
  currentResumeName?: string;
  lastUpdated?: string;
  hasUploadedResume?: boolean;
}

export const ResumeUploadZone: React.FC<ResumeUploadZoneProps> = ({
  userId = 'usr_guest',
  onUploadSuccess,
  currentResumeName,
  lastUpdated = 'Recently updated',
  hasUploadedResume = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verification modal state
  const [verificationData, setVerificationData] = useState<{
    fileName: string;
    rawText: string;
    fileType: 'pdf' | 'docx' | 'txt';
    parsed: ParsedResumeData;
  } | null>(null);

  const processingStepsList = [
    'Document Parsing & Section Detection...',
    'Extracting Experience, Projects & Skills...',
    'Skill Normalization & Canonical Mapping...',
    'Evidence Grounding & CareerTwin Alignment...'
  ];

  const handleProcessFile = async (file: File) => {
    setErrorMessage(null);
    setSuccessInfo(null);
    setIsProcessing(true);

    const validExtensions = ['.pdf', '.docx', '.txt'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setIsProcessing(false);
      setErrorMessage('Unsupported format. Please upload a PDF, DOCX, or TXT document.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setIsProcessing(false);
      setErrorMessage('File size exceeds 8MB limit. Please upload a smaller document.');
      return;
    }

    try {
      setProcessingStep('Extracting document contents...');
      const extractedDoc = await extractDocumentContent(file);

      // Processing pipeline step simulation
      for (let i = 0; i < processingStepsList.length; i++) {
        setProcessingStep(processingStepsList[i]);
        await new Promise((r) => setTimeout(r, 250));
      }

      setProcessingStep('Extracting structured career data with AI...');
      const parsed = await parseResumeDocumentWithGemini({
        base64: extractedDoc.base64,
        text: extractedDoc.text,
        mimeType: extractedDoc.mimeType,
        fileName: file.name
      });

      setIsProcessing(false);

      // Open verification step
      setVerificationData({
        fileName: file.name,
        rawText: extractedDoc.text,
        fileType: extractedDoc.fileType,
        parsed
      });
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Failed to parse resume document. Please try again.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmVerification = (newProfile: UserProfile, record: UserResumeRecord) => {
    const activeV = record.versions.find((v) => v.id === record.activeVersionId) || record.versions[0];
    setSuccessInfo(`Your resume "${record.fileName}" has been imported successfully.`);
    onUploadSuccess(activeV, record.rawText, newProfile, record);
    setVerificationData(null);
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">Current Resume:</span>
                {hasUploadedResume && currentResumeName ? (
                  <span className="text-xs font-mono font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    {currentResumeName}
                  </span>
                ) : (
                  <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                    No resume uploaded yet
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                {hasUploadedResume ? `Active source · ${lastUpdated}` : 'Upload your resume to build your CareerTwin'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>{hasUploadedResume ? 'Replace Resume' : 'Upload Resume'}</span>
            </button>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleProcessFile(e.target.files[0]);
            }
          }}
        />

        {/* Drag & Drop Upload Container */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 transition-all text-center cursor-pointer ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
              : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50'
          }`}
        >
          {isProcessing ? (
            <div className="space-y-3 py-2">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900">{processingStep}</p>
                <p className="text-[11px] text-slate-500">
                  Parsing actual document without inventing fake candidate information...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Click to browse or drag & drop your real resume
                </p>
                <p className="text-[11px] text-slate-500">
                  Supports PDF, DOCX, and TXT (up to 8MB). Automatically parses content into CareerTwin.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">PDF</span>
                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">DOCX</span>
                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">TXT</span>
              </div>
            </div>
          )}
        </div>

        {/* Feedback Notifications */}
        {errorMessage && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {successInfo && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <div className="flex-1 font-medium">{successInfo}</div>
          </div>
        )}
      </div>

      {/* Verification Modal for Review before syncing */}
      {verificationData && (
        <ResumeVerificationModal
          isOpen={Boolean(verificationData)}
          onClose={() => setVerificationData(null)}
          fileName={verificationData.fileName}
          rawText={verificationData.rawText}
          fileType={verificationData.fileType}
          userId={userId}
          initialParsed={verificationData.parsed}
          onConfirmSuccess={handleConfirmVerification}
        />
      )}
    </>
  );
};
