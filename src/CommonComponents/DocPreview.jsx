import { FileText } from "lucide-react";
import { BASE_URL } from "../config/BaseUrl"; // adjust path to your actual config file

// Robust PDF detector — checks extension in URL, or an explicit mime/type field
const isPdfFile = (fileUrl, mimeType) => {
  if (mimeType) return mimeType.toLowerCase().includes("pdf");
  if (!fileUrl) return false;
  return /\.pdf(\?|#|$)/i.test(fileUrl);
};

/**
 * Common preview component for documents/images.
 * Shows a centered PDF icon for PDF files, otherwise an image thumbnail.
 * Clicking always opens the file in a new tab.
 */
const DocPreview = ({ fileUrl, alt, mimeType }) => {
  if (!fileUrl) return null;

  const isAbsolute = /^https?:\/\//i.test(fileUrl);
  const fullUrl = isAbsolute ? fileUrl : `${BASE_URL}${fileUrl}`;
  const isPdf = isPdfFile(fileUrl, mimeType);

  return (
    <div
      className="h-40 w-64 rounded-md border border-gray-300 cursor-pointer hover:scale-105 transition-transform overflow-hidden bg-gray-100 flex flex-col items-center justify-center gap-2"
      onClick={() => window.open(fullUrl, "_blank")}
    >
      {isPdf ? (
        <>
          <FileText className="h-14 w-14 text-red-500" />
          <span className="text-xs font-semibold text-gray-600">View PDF</span>
        </>
      ) : (
        <img src={fullUrl} alt={alt} className="h-full w-full object-cover" />
      )}
    </div>
  );
};

export default DocPreview;
