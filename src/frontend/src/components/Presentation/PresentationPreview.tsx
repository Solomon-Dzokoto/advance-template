import React, { useState, useEffect, useCallback } from 'react';
import type { Slide } from '../../types/presentation';

interface PresentationPreviewProps {
    slides: Slide[];
    onClose: () => void;
}

export const PresentationPreview: React.FC<PresentationPreviewProps> = ({ slides, onClose }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleNextSlide = useCallback(() => {
        if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
        }
    }, [currentSlideIndex, slides.length]);

    const handlePreviousSlide = useCallback(() => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
        }
    }, [currentSlideIndex]);

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowRight':
            case 'Space':
                handleNextSlide();
                break;
            case 'ArrowLeft':
                handlePreviousSlide();
                break;
            case 'Escape':
                onClose();
                break;
            default:
                break;
        }
    }, [handleNextSlide, handlePreviousSlide, onClose]);

    const toggleFullscreen = async () => {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            await document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    if (slides.length === 0) return null;

    const currentSlide = slides[currentSlideIndex];

    return (
        <div className="fixed inset-0 bg-black text-white z-50">
            <div className="h-full flex flex-col">
                {/* Header controls */}
                <div className="p-4 flex justify-between items-center bg-gradient-to-b from-gray-900 to-transparent">
                    <div className="text-sm">
                        Slide {currentSlideIndex + 1} of {slides.length}
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isFullscreen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5-5-5m5 5v-4m0 4h-4" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5-5-5m5 5v-4m0 4h-4" />
                                )}
                            </svg>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            title="Exit presentation"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Slide content */}
                <div className="flex-1 flex items-center justify-center p-16">
                    <div className="w-full max-w-4xl bg-white text-black rounded-xl shadow-2xl p-12">
                        <div className="prose prose-lg mx-auto">
                            {currentSlide.content.split('\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer controls */}
                <div className="p-4 flex justify-between items-center bg-gradient-to-t from-gray-900 to-transparent">
                    <button
                        onClick={handlePreviousSlide}
                        disabled={currentSlideIndex === 0}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {currentSlide.notes && (
                        <div className="max-w-lg text-sm text-gray-300 bg-gray-800 p-3 rounded-lg">
                            <strong>Speaker Notes:</strong> {currentSlide.notes}
                        </div>
                    )}

                    <button
                        onClick={handleNextSlide}
                        disabled={currentSlideIndex === slides.length - 1}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
