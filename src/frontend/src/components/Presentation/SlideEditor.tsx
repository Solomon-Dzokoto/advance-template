import React from "react";
import type { Slide } from "../../types/presentation";

interface SlideEditorProps {
  slide: Slide;
  onChange: (updatedSlide: Slide) => void;
}

export const SlideEditor: React.FC<SlideEditorProps> = ({
  slide,
  onChange,
}) => {
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...slide,
      content: e.target.value,
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...slide,
      notes: e.target.value,
    });
  };

  return (
    <div className="w-full rounded-xl border-2 border-gray-100 bg-white p-6 shadow-md transition-all hover:shadow-lg">
      <div className="space-y-6">
        <div>
          <label className="mb-2 block items-center space-x-2 text-sm font-semibold text-gray-700">
            <svg
              className="h-4 w-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Slide Content</span>
          </label>
          <textarea
            value={slide.content}
            onChange={handleContentChange}
            className="h-40 w-full resize-none rounded-lg border-2 border-gray-200 p-4 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="Enter your slide content here..."
          />
        </div>
        <div>
          <label className="mb-2 block items-center space-x-2 text-sm font-semibold text-gray-700">
            <svg
              className="h-4 w-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <span>Speaker Notes</span>
          </label>
          <textarea
            value={slide.notes}
            onChange={handleNotesChange}
            className="h-32 w-full resize-none rounded-lg border-2 border-gray-200 bg-gray-50 p-4 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="Add your speaker notes here..."
          />
        </div>
      </div>
    </div>
  );
};
