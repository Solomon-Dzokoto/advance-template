import { useState, useRef, useEffect } from "react";
import { backend } from "../../../declarations/backend";
import { Logo } from "../components/Logo";
import { TypewriterText } from "../components/TypewriterText";

interface Message {
  content: string;
  role: "user" | "assistant";
  timestamp: number;
  id: string;
  isTyping?: boolean;
  error?: boolean;
  retryable?: boolean;
}

export function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationTitle, setConversationTitle] = useState("New Chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<string>("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleNewChat = () => {
    setMessages([]);
    setConversationTitle("New Chat");
    setInput("");
  };

  const handleRetry = async (originalMessage: string) => {
    // Remove the last error message
    setMessages((prev) => prev.slice(0, -1));
    // Retry the message
    await sendMessage(originalMessage);
  };

  const sendMessage = async (messageText: string) => {
    const tempAssistantMessage: Message = {
      content: "",
      role: "assistant",
      timestamp: Date.now(),
      id: generateUniqueId(),
      isTyping: true,
    };

    setMessages((prev) => [...prev, tempAssistantMessage]);
    setLoading(true);

    try {
      // Timeout wrapper for the API call (2 minutes)
      const timeoutDuration = 120000;
      const timeoutPromise = new Promise<string>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                "Request timed out after 2 minutes. The LLM might be busy, please try again.",
              ),
            ),
          timeoutDuration,
        ),
      );

      // Race between the actual API call and the timeout
      const response = await Promise.race([
        backend.chat_with_llm(messageText),
        timeoutPromise,
      ]);

      // Error detection patterns
      const errorPatterns = {
        timeout: /(timeout|timed out|time limit exceeded)/i,
        busy: /(busy|overloaded|too many requests)/i,
        error: /(error|exception|failed)/i,
      };

      if (
        errorPatterns.timeout.test(response) ||
        errorPatterns.busy.test(response)
      ) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempAssistantMessage.id
              ? {
                  ...msg,
                  content:
                    "The request timed out. The LLM might be busy processing other requests. Click 'Retry' to try again, or wait a few moments before sending a new message.",
                  isTyping: false,
                  error: true,
                  retryable: true,
                }
              : msg,
          ),
        );
      } else if (errorPatterns.error.test(response)) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempAssistantMessage.id
              ? {
                  ...msg,
                  content:
                    "Sorry, there was an error processing your message. This might be temporary - please try again.",
                  isTyping: false,
                  error: true,
                  retryable: true,
                }
              : msg,
          ),
        );
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempAssistantMessage.id
              ? { ...msg, content: response, isTyping: false }
              : msg,
          ),
        );

        // Update conversation title if it's the first message
        if (messages.length === 1) {
          setConversationTitle(
            messageText.slice(0, 30) + (messageText.length > 30 ? "..." : ""),
          );
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.message ||
        error.error_message ||
        "Sorry, I encountered an error processing your message. Please try again.";

      const isTimeout = /timeout|timed out|time limit exceeded/i.test(
        errorMessage,
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempAssistantMessage.id
            ? {
                ...msg,
                content: isTimeout
                  ? "The request timed out. The LLM might be busy processing other requests. Click 'Retry' to try again, or wait a few moments before sending a new message."
                  : errorMessage,
                isTyping: false,
                error: true,
                retryable: true,
              }
            : msg,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageText = input.trim();
    lastMessageRef.current = messageText;

    const userMessage: Message = {
      content: messageText,
      role: "user",
      timestamp: Date.now(),
      id: generateUniqueId(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    await sendMessage(messageText);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="glass-effect hidden flex-col border-r border-white/20 md:flex md:w-64">
        <Logo />
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/90 transition-all duration-300 hover:bg-white/20 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Chat
          </button>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {/* Chat history could go here */}
          <div className="px-4 py-2 text-sm text-white/80">
            {conversationTitle}
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <div className="glass-effect border-b border-white/20 p-4 md:hidden">
          <Logo />
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-message-appear`}
            >
              <div
                className={`flex max-w-[85%] gap-3 md:max-w-[75%] ${message.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full shadow-lg ${
                    message.role === "user"
                      ? "animate-pulse-soft bg-gradient-to-br from-indigo-500 to-purple-500"
                      : message.error
                        ? "bg-gradient-to-br from-red-500 to-orange-500"
                        : "animate-pulse-soft bg-gradient-to-br from-pink-500 to-rose-500"
                  }`}
                >
                  {message.role === "user" ? "U" : "A"}
                </div>

                {/* Message bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                      : message.error
                        ? "border border-red-500/20 bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-lg"
                        : "glass-effect text-white/90"
                  }`}
                >
                  {message.isTyping ? (
                    <TypewriterText content={message.content || ""} />
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      {message.error && message.retryable && (
                        <button
                          onClick={() => handleRetry(lastMessageRef.current)}
                          className="mt-2 flex items-center gap-2 text-sm text-red-400 transition-colors hover:text-red-300"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Retry
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && !messages[messages.length - 1]?.isTyping && (
            <div className="animate-message-appear flex justify-start">
              <div className="flex gap-3">
                <div className="animate-pulse-soft flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                  A
                </div>
                <div className="glass-effect flex items-center space-x-2 rounded-2xl bg-white p-2 shadow-lg" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="glass-effect border-t border-white/20 p-4">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-4xl gap-4"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message AI..."
                className="w-full rounded-xl border border-white/10 bg-white/10 p-4 pr-12 text-white shadow-lg backdrop-blur-lg transition-all duration-300 placeholder:text-white/50 focus:border-white/20 focus:ring-2 focus:ring-white/20"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute top-1/2 right-2 -translate-y-1/2 p-2 text-white/80 transition-all duration-300 hover:text-white disabled:text-white/40"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
