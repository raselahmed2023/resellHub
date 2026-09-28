"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Loader2,
  MessageCircle,
  Send,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import axiosSecure from "@/lib/axiosSecure";

const QUICK_PROMPTS = [
  "5000 টাকার মধ্যে products দেখাও",
  "Show me used electronics",
  "Like New products দেখাও",
  "How do I sell a product?",
];

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I’m ReSell Guide 👋 I can help you find products or guide you through buying and selling on ReSellHub.",
  products: [],
};

function ProductCard({ product, closeChat }) {
  return (
    <Link
      href={product.href || `/products/${product._id}`}
      onClick={closeChat}
      className="flex gap-3 p-3 rounded-xl border border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm transition"
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ShoppingBag size={22} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 line-clamp-1">
          {product.title}
        </p>

        <div className="flex items-center gap-2 mt-1">
          {product.condition && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              {product.condition}
            </span>
          )}

          {product.category && (
            <span className="text-[10px] text-gray-400 truncate">
              {product.category}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-black text-orange-500">
            ৳{Number(product.price || 0).toLocaleString()}
          </span>

          <span className="text-[10px] font-bold text-emerald-600">
            View Product
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ReSellGuide() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [nudge, setNudge] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [open]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!open) {
        setNudge(true);

        setTimeout(() => {
          setNudge(false);
        }, 1200);
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [open]);

  const sendMessage = async (text) => {
    const message = text.trim();

    if (!message || loading) return;

    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: message,
      products: [],
    };

    const previousMessages = messages;

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const history = previousMessages
        .filter((item) => item.id !== "welcome")
        .slice(-6)
        .map((item) => ({
          role: item.role,
          content: item.content,
        }));

      const res = await axiosSecure.post("/api/ai/chat", {
        message,
        history,
      });

      const assistantMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content:
          res.data?.reply ||
          "I’m sorry, I couldn’t generate a response.",
        products: Array.isArray(res.data?.products)
          ? res.data.products
          : [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage = {
        id: `${Date.now()}-error`,
        role: "assistant",
        content:
          error?.response?.data?.message ||
          "ReSell Guide is temporarily unavailable. Please try again.",
        products: [],
        error: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const closeChat = () => {
    setOpen(false);
  };

  const hasUserMessages = messages.some(
    (message) => message.role === "user"
  );

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            transition={{
              duration: 0.2,
            }}
            className="fixed z-[100] bottom-24 right-3 sm:right-6 w-[calc(100vw-24px)] sm:w-[390px] h-[620px] max-h-[75vh] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
          >
            <div className="bg-[#1a2332] px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                  <Bot size={21} />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-white">
                      ReSell Guide
                    </h3>
                    <Sparkles
                      size={13}
                      className="text-emerald-400"
                    />
                  </div>

                  <p className="text-[11px] text-gray-400 mt-0.5">
                    AI shopping & selling assistant
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeChat}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition"
                aria-label="Close ReSell Guide"
              >
                <X size={19} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-4">
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={
                        message.role === "user"
                          ? "max-w-[82%]"
                          : "max-w-[92%]"
                      }
                    >
                      <div
                        className={`text-sm leading-6 px-4 py-3 ${
                          message.role === "user"
                            ? "bg-emerald-600 text-white rounded-2xl rounded-br-md"
                            : message.error
                            ? "bg-red-50 text-red-600 border border-red-100 rounded-2xl rounded-bl-md"
                            : "bg-white text-gray-700 border border-gray-200 rounded-2xl rounded-bl-md shadow-sm"
                        }`}
                      >
                        {message.content}
                      </div>

                      {message.products?.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2">
                          {message.products.map((product) => (
                            <ProductCard
                              key={product._id}
                              product={product}
                              closeChat={closeChat}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex items-center gap-2">
                      <Loader2
                        size={15}
                        className="animate-spin text-emerald-500"
                      />
                      <span className="text-xs text-gray-500">
                        ReSell Guide is thinking...
                      </span>
                    </div>
                  </div>
                )}

                {!hasUserMessages && (
                  <div className="pt-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Try asking
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {QUICK_PROMPTS.map((prompt) => (
                        <button
                          type="button"
                          key={prompt}
                          onClick={() => sendMessage(prompt)}
                          disabled={loading}
                          className="text-left text-[11px] font-semibold text-gray-600 bg-white border border-gray-200 px-3 py-2 rounded-xl hover:border-emerald-300 hover:text-emerald-700 transition disabled:opacity-50"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white border-t border-gray-100"
            >
              <div className="flex items-end gap-2 bg-slate-50 border border-gray-200 rounded-2xl p-2 focus-within:border-emerald-400 transition">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask ReSell Guide..."
                  className="flex-1 resize-none bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 px-2 py-2 max-h-24"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white flex items-center justify-center transition flex-shrink-0"
                  aria-label="Send message"
                >
                  {loading ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Send size={17} />
                  )}
                </button>
              </div>

              <p className="text-[9px] text-center text-gray-400 mt-2">
                Product recommendations are based on available ReSellHub listings.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        animate={
          nudge && !open
            ? {
                y: [0, -10, 0, -5, 0],
                rotate: [0, -4, 4, -2, 0],
              }
            : {
                y: 0,
                rotate: 0,
              }
        }
        transition={{
          duration: 0.9,
        }}
        className="fixed z-[100] bottom-5 right-3 sm:right-6 flex items-center gap-3 bg-[#1a2332] text-white rounded-full shadow-2xl hover:bg-emerald-700 transition p-2 pr-4"
        aria-label="Open ReSell Guide"
      >
        <div className="w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center">
          {open ? (
            <X size={21} />
          ) : (
            <MessageCircle size={21} />
          )}
        </div>

        <div className="hidden sm:block text-left">
          <p className="text-[10px] text-emerald-300 font-semibold">
            Need help?
          </p>
          <p className="text-xs font-bold">
            Ask ReSell Guide
          </p>
        </div>
      </motion.button>
    </>
  );
}