import { backend } from "../../../declarations/backend";
import type { Presentation, Slide } from "../types/presentation";
import { withTimeout, withRetry } from "../utils/retry";

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_TOPIC_LENGTH = 200;

export class PresentationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PresentationError";
  }
}

function sanitizeUserInput(text: string): string {
  return text.trim().slice(0, MAX_TOPIC_LENGTH);
}

function formatPrompt(topic: string): string {
  return `Create a clear and concise presentation about: ${topic}. Focus on the main points only.`;
}

function validateSlides(slides: string[]): string[] {
  return slides.filter(
    (slide) =>
      slide &&
      slide.trim().length > 0 &&
      !slide.toLowerCase().includes("error") &&
      !slide.toLowerCase().includes("failed"),
  );
}

export const presentationService = {
  createPresentation: async (title: string): Promise<Presentation> => {
    try {
      const sanitizedTitle = sanitizeUserInput(title);
      return await withRetry(() => backend.create_presentation(sanitizedTitle));
    } catch (error) {
      console.error("Failed to create presentation:", error);
      throw new PresentationError(
        "Could not create presentation. Please try again.",
      );
    }
  },

  getPresentation: async (id: string): Promise<Presentation | undefined> => {
    try {
      const result = await withRetry(() => backend.get_presentation(id));
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error("Failed to get presentation:", error);
      throw new PresentationError(
        "Could not load presentation. Please try again.",
      );
    }
  },

  updatePresentation: async (
    id: string,
    slides: Slide[],
  ): Promise<Presentation | undefined> => {
    try {
      const result = await withRetry(() =>
        backend.update_presentation(id, slides),
      );
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error("Failed to update presentation:", error);
      throw new PresentationError(
        "Could not save presentation. Please try again.",
      );
    }
  },

  generateSlideSuggestions: async (topic: string): Promise<string[]> => {
    if (!topic.trim()) {
      throw new PresentationError(
        "Please enter a topic for your presentation.",
      );
    }

    try {
      // Single attempt with a clear prompt
      const formattedPrompt = formatPrompt(sanitizeUserInput(topic));

      const result = await withTimeout(
        () =>
          withRetry(() => backend.generate_slide_suggestions(formattedPrompt)),
        DEFAULT_TIMEOUT,
      );

      const validSlides = validateSlides(result);

      if (validSlides.length === 0) {
        throw new PresentationError(
          "Could not generate meaningful slides. Please try a different topic or rephrase your request.",
        );
      }

      return validSlides;
    } catch (error) {
      console.error("Failed to generate slides:", error);

      if (error instanceof Error && error.message.includes("timed out")) {
        throw new PresentationError(
          "The AI is taking too long. Please try a simpler topic or try again in a moment.",
        );
      }

      throw new PresentationError(
        "Could not generate slides. Please try rephrasing your topic.",
      );
    }
  },
};
