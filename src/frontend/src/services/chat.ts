import { backend } from "../../../declarations/backend";

export type ChatMessage =
  | { user: { content: string } }
  | { assistant: { content?: string; tool_calls: Array<any> } }
  | { system: { content: string } }
  | { tool: { content: string; tool_call_id: string } };

export async function sendChatMessage(message: string): Promise<string> {
  try {
    const response = await backend.chat([
      {
        user: {
          content: message,
        },
      },
    ]);
    return response;
  } catch (error) {
    console.error("Error in chat service:", error);
    throw error;
  }
}
