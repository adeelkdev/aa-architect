// src/components/SearchBar.tsx
import React, { useState } from "react";

// env vars from Vite
const DATABRICKS_HOST = import.meta.env.VITE_DATABRICKS_HOST;
const DATABRICKS_TOKEN = import.meta.env.VITE_DATABRICKS_TOKEN;
const DATABRICKS_ASSISTANT_ID = import.meta.env.VITE_DATABRICKS_ASSISTANT_ID;

// ----- Databricks Genie helpers -----
async function genieCreateConversation(title: string) {
  const resp = await fetch(`${DATABRICKS_HOST}/api/2.0/genie/conversations`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${DATABRICKS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      assistant_id: DATABRICKS_ASSISTANT_ID,
    }),
  });
  if (!resp.ok) throw new Error("Failed to create conversation");
  return resp.json();
}

async function genieSendMessage(conversationId: string, userText: string) {
  const resp = await fetch(
    `${DATABRICKS_HOST}/api/2.0/genie/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DATABRICKS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: userText }),
    }
  );
  if (!resp.ok) throw new Error("Failed to send message");
  return resp.json();
}

// One-shot ask (create + message)
async function genieAskOnce(prompt: string) {
  if (!DATABRICKS_HOST || !DATABRICKS_TOKEN) return null;
  try {
    const conv = await genieCreateConversation("SearchBar session");
    const msg = await genieSendMessage(conv.id, prompt);
    return msg?.response?.[0]?.text ?? "No response";
  } catch (err) {
    console.error("Genie error", err);
    return null;
  }
}

// ----- fallback generator (your existing one) -----
async function generateAIResponse(prompt: string): Promise<string> {
  // Placeholder – hook your old AI logic here
  return `Fallback AI says: ${prompt}`;
}

// ----- SearchBar component -----
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnswer("");

    // Try Genie first, fallback if not configured or error
    let response = await genieAskOnce(query);
    if (!response) {
      response = await generateAIResponse(query);
    }

    setAnswer(response);
    setLoading(false);
  };

  return (
    <div className="searchbar-container">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Ask something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "..." : "Ask"}
        </button>
      </form>

      {/* Connection badge */}
      <div className="mt-2 text-xs text-gray-500">
        {DATABRICKS_HOST && DATABRICKS_TOKEN ? (
          <span className="text-green-600">Databricks Genie: Connected</span>
        ) : (
          <span className="text-gray-400">Databricks Genie: Not configured</span>
        )}
      </div>

      {answer && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}