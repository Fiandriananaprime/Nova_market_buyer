import { useState } from "react";
import type { Page, Product } from "../data";
import { products } from "../data";

interface AIAssistantProps {
  onNavigate: (page: Page, payload?: unknown) => void;
}

interface Message {
  role: "user" | "assistant";
  text: string;
  products?: Product[];
}

const suggestions = [
  "Best laptop under $1000 for programming",
  "Black wireless headphones under $300",
  "Gift for a photographer",
  "Noise cancelling headphones comparison",
];

const respond = (query: string): { text: string; products: Product[] } => {
  const q = query.toLowerCase();
  let matched = products;
  let text = "Here are some products you might like:";

  if (q.includes("headphone") || q.includes("audio")) {
    matched = products.filter(p => p.subcategory === "Headphones" || p.subcategory === "Speakers");
    text = "Here are the top headphones available right now:";
  } else if (q.includes("laptop") || q.includes("computer")) {
    matched = products.filter(p => p.subcategory === "Laptops");
    text = "Great laptop options for your needs:";
  } else if (q.includes("phone") || q.includes("smartphone")) {
    matched = products.filter(p => p.subcategory === "Smartphones");
    text = "Top smartphones available in our marketplace:";
  } else if (q.includes("under $") || q.includes("budget")) {
    const budget = parseInt(q.match(/\d+/)?.[0] || "500");
    matched = products.filter(p => p.price < budget);
    text = `Products within your $${budget} budget:`;
  } else if (q.includes("compare")) {
    matched = products.slice(0, 3);
    text = "Here are some products worth comparing:";
  }

  return { text, products: matched.slice(0, 3) };
};

export default function AIAssistant({ onNavigate }: AIAssistantProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! I'm your AI Shopping Assistant. Ask me anything — product recommendations, comparisons, or help finding the best deal." },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text };
    const { text: responseText, products: responseProducts } = respond(text);
    const assistantMsg: Message = { role: "assistant", text: responseText, products: responseProducts };
    setMessages(m => [...m, userMsg, assistantMsg]);
    setInput("");
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2 transition-all group"
        style={{ boxShadow: "0 8px 32px rgba(29, 78, 216, 0.35)" }}
      >
        <span className="text-lg">🤖</span>
        <span className="text-sm font-600 hidden sm:block">AI Assistant</span>
        {!open && <span className="w-2 h-2 rounded-full bg-green-400 absolute top-2 right-2"/>}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden" style={{ height: 480 }}>
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <p className="font-700 text-sm">Shopping Assistant</p>
                <p className="text-[10px] text-blue-200">Powered by AI</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors text-lg">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[90%] ${msg.role === "user" ? "bg-blue-600 text-white rounded-2xl rounded-br-sm" : "bg-slate-100 text-slate-900 rounded-2xl rounded-bl-sm"} px-3 py-2`}>
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {msg.products.map(p => (
                        <button
                          key={p.id}
                          onClick={() => { onNavigate("product", p); setOpen(false); }}
                          className="w-full flex items-center gap-2 bg-white rounded-xl p-2 text-left hover:shadow-md transition-shadow border border-slate-200"
                        >
                          <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0"/>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-600 text-slate-900 line-clamp-1">{p.name}</p>
                            <p className="text-[10px] text-slate-400">{p.brand} • ★{p.rating}</p>
                            <p className="text-xs font-700 text-blue-600">${p.price.toFixed(2)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Suggestions (only at start) */}
            {messages.length === 1 && (
              <div className="space-y-1.5">
                <p className="text-[10px] text-slate-400 font-600 uppercase tracking-wider">Try asking:</p>
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="w-full text-left text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-colors border border-blue-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-slate-100 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send(input)}
              placeholder="Ask me anything..."
              className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400"
            />
            <button
              onClick={() => send(input)}
              className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors flex-shrink-0"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
