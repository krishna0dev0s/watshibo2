"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically load the markdown editor on the client to avoid shipping
// its large bundle on initial page load (improves Largest Contentful Paint).
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="py-4 text-center text-sm text-muted-foreground">Loading editor...</div>
  ),
});

const CoverLetterPreview = ({ content }) => {
  return (
    <div className="py-4">
      <MDEditor value={content} preview="preview" height={700} />
    </div>
  );
};

export default CoverLetterPreview;
