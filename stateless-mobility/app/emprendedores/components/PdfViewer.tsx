"use client";

interface PdfViewerProps {
  src: string;
  title: string;
}

export default function PdfViewer({ src, title }: PdfViewerProps) {
  return (
    <div className="w-full h-full">
      <iframe src={src} title={title} width="100%" height="100%" />
    </div>
  );
}
