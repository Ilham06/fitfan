"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";

function formatTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ChatInterface({ userName, phase, calorieTarget }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({ api: "/api/ai/chat" });

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <>
      {/* Chat Messages */}
      <div className="flex-1 space-y-8 pb-10 min-h-0">
        {isEmpty && (
          <div className="flex flex-col items-start max-w-[85%]">
            <div className="bg-surface-container-low px-6 py-5 rounded-[2rem] rounded-bl-none border border-stone-50">
              <p className="text-on-surface/90 leading-relaxed text-sm">
                Hi {userName}! 👋 I&apos;m your FitFan AI assistant. I know your{" "}
                <span className="font-bold text-primary">{phase}</span> phase goals and daily
                target of{" "}
                <span className="font-bold text-primary">
                  {calorieTarget?.toLocaleString() ?? "—"} kcal
                </span>
                .
                <br />
                <br />
                Ask me anything about your nutrition, meals, or training!
              </p>
            </div>
            <span className="text-[9px] font-bold text-stone-400 mt-3 ml-2 uppercase tracking-widest">
              Now
            </span>
          </div>
        )}

        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? "items-end max-w-[85%] ml-auto" : "items-start max-w-[90%]"}`}
            >
              <div
                className={
                  isUser
                    ? "bg-stone-900 text-white px-6 py-5 rounded-[2rem] rounded-br-none shadow-sm"
                    : "bg-surface-container-low px-6 py-5 rounded-[2rem] rounded-bl-none border border-stone-50 w-full"
                }
              >
                <p className="leading-relaxed text-sm whitespace-pre-wrap">{m.content}</p>
              </div>
              <span className="text-[9px] font-bold text-stone-400 mt-3 mx-2 uppercase tracking-widest">
                {formatTime(m.createdAt || new Date())}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex flex-col items-start max-w-[85%]">
            <div className="bg-surface-container-low px-6 py-5 rounded-[2rem] rounded-bl-none border border-stone-50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-lime-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-lime-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-lime-600 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-3 text-sm text-red-600">
            Error: {error.message || "Gagal menghubungi AI. Cek GOOGLE_GENERATIVE_AI_API_KEY."}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-28 left-0 w-full px-6 z-40">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-stone-50/90 backdrop-blur-2xl border border-stone-200/50 p-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex items-center gap-2"
        >
          <button
            type="button"
            className="w-10 h-10 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-medium py-2 px-2 placeholder:text-stone-400"
            placeholder="Type a message..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input?.trim()}
            className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center transition-all active:scale-90 shadow-md disabled:opacity-40"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              arrow_upward
            </span>
          </button>
        </form>
      </div>
    </>
  );
}
