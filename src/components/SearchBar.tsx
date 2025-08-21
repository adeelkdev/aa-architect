/// <reference types="vite/client" />

import { useState, useRef, useEffect } from 'react'
import { Search, Mic, Image, FileText, Send, X, Bot, User } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  isSearchActive: boolean
  setIsSearchActive: (active: boolean) => void
}

interface AIResponse {
  id: string
  query: string
  response: string
  timestamp: Date
}

/* ---------------- Databricks Genie config ----------------
   In .env.local (never commit secrets):
   VITE_DATABRICKS_HOST="https://<your-workspace-host>"
   VITE_DATABRICKS_TOKEN="dapiXXXXXXXXXXXX"
   VITE_DATABRICKS_ASSISTANT_ID="<optional>"
   (Optional if you deploy a serverless proxy to fix CORS)
   VITE_GENIE_PROXY_URL="https://<your-proxy>/api/genie"
---------------------------------------------------------- */
const DATABRICKS_HOST = import.meta.env.VITE_DATABRICKS_HOST as string | undefined;
const DATABRICKS_TOKEN = import.meta.env.VITE_DATABRICKS_TOKEN as string | undefined;
const DATABRICKS_ASSISTANT_ID = import.meta.env.VITE_DATABRICKS_ASSISTANT_ID as string | undefined;
const GENIE_PROXY_URL = import.meta.env.VITE_GENIE_PROXY_URL as string | undefined;

const hasDirectGenie = Boolean(DATABRICKS_HOST && DATABRICKS_TOKEN);
const hasProxy = Boolean(GENIE_PROXY_URL);

function apiBase() {
  // Prefer proxy if set (solves CORS & hides token on server)
  return hasProxy ? GENIE_PROXY_URL! : `${DATABRICKS_HOST!.replace(/\/$/, '')}`;
}

async function genieCreateConversation(title: string) {
  if (!hasDirectGenie && !hasProxy) throw new Error("Databricks Genie env not configured");

  if (hasProxy) {
    // Proxy expects { path, body } and adds Authorization server-side
    const resp = await fetch(GENIE_PROXY_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "/api/2.0/genie/conversations",
        body: { title, assistant_id: DATABRICKS_ASSISTANT_ID || undefined },
      }),
    });
    if (!resp.ok) throw new Error(`create conversation failed: ${resp.status}`);
    const data = await resp.json();
    return data.id ?? data.conversation_id;
  } else {
    const resp = await fetch(`${apiBase()}/api/2.0/genie/conversations`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DATABRICKS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        assistant_id: DATABRICKS_ASSISTANT_ID,
      }),
      // Note: direct browser calls may be blocked by CORS unless Databricks allows your origin
    });
    if (!resp.ok) throw new Error("Failed to create conversation");
    const data = await resp.json();
    return data.id ?? data.conversation_id;
  }
}

async function genieSendMessage(conversationId: string, userText: string) {
  if (!hasDirectGenie && !hasProxy) throw new Error("Databricks Genie env not configured");

  if (hasProxy) {
    const resp = await fetch(GENIE_PROXY_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: `/api/2.0/genie/conversations/${conversationId}/messages`,
        body: { text: userText },
      }),
    });
    if (!resp.ok) throw new Error(`send message failed: ${resp.status}`);
    return resp.json();
  } else {
    const resp = await fetch(
      `${apiBase()}/api/2.0/genie/conversations/${conversationId}/messages`,
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
}

// One-shot ask (create + send)
async function genieAskOnce(prompt: string): Promise<string> {
  const convId = await genieCreateConversation("SearchBar session");
  const msg = await genieSendMessage(convId, prompt);

  // Try common shapes: { response: [{ text }] } or { messages: [...] } or plain { text }
  const fromResponseArray = msg?.response?.[0]?.text;
  if (typeof fromResponseArray === 'string') return fromResponseArray;

  const messages = msg?.messages || msg?.data;
  if (Array.isArray(messages)) {
    const assistant = messages.find((m: any) => (m.role || m.author) === 'assistant' || m.role === 'bot');
    if (assistant?.content && typeof assistant.content === 'string') return assistant.content;
  }

  if (typeof msg?.text === 'string') return msg.text;
  if (typeof msg?.reply === 'string') return msg.reply;

  // Fallback: stringify so user sees *something* real from API
  return JSON.stringify(msg);
}

/* ---------------- Local fallback (only used if API fails) ---------------- */
const generateAIResponse = (query: string): string => {
  const responses: Record<string, string[]> = {
    architecture: [
      "I can help you with architectural design patterns, structural analysis, and building codes. What specific aspect interests you?",
      "Architecture involves balancing functionality, aesthetics, and sustainability. Would you like to explore any particular architectural style?",
      "From residential to commercial projects, I can assist with design principles, materials selection, and spatial planning."
    ],
    design: [
      "Design is about solving problems creatively. I can help with UI/UX, graphic design, or architectural design principles.",
      "Good design balances form and function. What type of design project are you working on?",
      "I can assist with design systems, color theory, typography, and layout principles. What would you like to explore?"
    ],
    data: [
      "Data analysis and visualization are crucial for informed decision-making. What kind of data are you working with?",
      "I can help with data modeling, analytics, visualization techniques, and database design. What's your specific need?",
      "From data collection to insights generation, I'm here to assist with your data-related questions."
    ],
    default: [
      "I'm here to help with architecture, design, and data questions. Could you be more specific about what you'd like to know?",
      "I can assist with architectural planning, design principles, data analysis, and more. What interests you most?",
      "Feel free to ask about building design, data visualization, architectural software, or upload relevant files for analysis."
    ]
  }

  const lowerQuery = query.toLowerCase()
  let category = 'default'
  if (lowerQuery.includes('architect') || lowerQuery.includes('building') || lowerQuery.includes('structure')) {
    category = 'architecture'
  } else if (lowerQuery.includes('design') || lowerQuery.includes('ui') || lowerQuery.includes('ux')) {
    category = 'design'
  } else if (lowerQuery.includes('data') || lowerQuery.includes('analytic') || lowerQuery.includes('chart')) {
    category = 'data'
  }

  const categoryResponses = responses[category]
  return categoryResponses[Math.floor(Math.random() * categoryResponses.length)]
}

/* ========================== Component ========================== */
export default function SearchBar({ isSearchActive, setIsSearchActive }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [promptValue, setPromptValue] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [aiResponses, setAiResponses] = useState<AIResponse[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus input when search becomes active
  useEffect(() => {
    if (isSearchActive && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSearchActive])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, _type: 'document' | 'image') => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files])
      if (!isSearchActive) setIsSearchActive(true)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleFocus = () => {
    setIsFocused(true)
    setIsSearchActive(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!promptValue.trim() && uploadedFiles.length === 0) return

    const query = promptValue.trim() || `Uploaded ${uploadedFiles.length} file(s)`
    setIsGenerating(true)

    try {
      // Try Genie (proxy first if set), otherwise fallback
      let answer: string
      try {
        answer = await genieAskOnce(query)
      } catch (apiErr: any) {
        // If direct browser call fails (likely CORS), show an error but still fallback so UI keeps working.
        setError(apiErr?.message || 'Databricks request failed (possibly CORS). Using local fallback.')
        answer = generateAIResponse(query)
      }

      const response: AIResponse = {
        id: Date.now().toString(),
        query,
        response: answer,
        timestamp: new Date()
      }

      setAiResponses(prev => [response, ...prev])
      setPromptValue('')
      setUploadedFiles([])
    } finally {
      setIsGenerating(false)
    }
  }

  const clearAll = () => {
    setAiResponses([])
    setPromptValue('')
    setUploadedFiles([])
    setIsSearchActive(false)
    setError(null)
  }

  return (
    <motion.div
      className="relative w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.5 }}
    >
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.rtf"
        multiple
        onChange={(e) => handleFileUpload(e, 'document')}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileUpload(e, 'image')}
        className="hidden"
      />

      {/* Connection badge */}
      <div className="mb-2 flex justify-center">
        <span
          title={
            hasProxy
              ? `Using proxy: ${GENIE_PROXY_URL}`
              : hasDirectGenie
                ? `Direct to Databricks: ${DATABRICKS_HOST}`
                : 'Not configured'
          }
          className={
            `inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${
              hasProxy || hasDirectGenie ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`
          }
        >
          <svg width="8" height="8" viewBox="0 0 8 8" className={(hasProxy || hasDirectGenie) ? 'fill-green-500' : 'fill-gray-400'}>
            <circle cx="4" cy="4" r="4" />
          </svg>
          {hasProxy
            ? 'Databricks Genie: Connected via proxy'
            : hasDirectGenie
              ? 'Databricks Genie: Direct (may hit CORS)'
              : 'Databricks Genie: Not configured'}
        </span>
      </div>

      {/* Error banner (e.g., CORS) */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* AI Responses */}
      <AnimatePresence>
        {isSearchActive && aiResponses.length > 0 && (
          <motion.div
            className="mb-6 space-y-4 max-h-80 overflow-y-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {aiResponses.map((response, index) => (
              <motion.div
                key={response.id}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200/50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {/* User Query */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{response.query}</p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                      {response.response}
                    </p>
                    <span className="text-xs text-gray-500 mt-2 block">
                      {response.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Clear All Button */}
            <motion.button
              onClick={clearAll}
              className="w-full text-center py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Clear conversation
            </motion.button>
          </motion.div>
        )}

        {/* Generating Response */}
        {isGenerating && (
          <motion.div
            className="mb-6 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200/50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-black" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-grayx-400 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded files preview */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            className="mb-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2 text-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  {file.type.startsWith('image/') ? (
                    <Image className="w-4 h-4 text-blue-600" />
                  ) : (
                    <FileText className="w-4 h-4 text-green-600" />
                  )}
                  <span className="text-gray-700 max-w-32 truncate">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main prompt panel */}
      <form onSubmit={handleSubmit}>
        <motion.div
          className={`relative flex items-center bg-white rounded-full p-2 shadow-2xl border-2 transition-all duration-300 ${
            isSearchActive ? 'z-50' : ''
          }`}
          animate={{
            borderColor: isFocused || isSearchActive ? 'rgba(255, 193, 7, 0.6)' : 'rgba(229, 231, 235, 1)',
            boxShadow: isFocused || isSearchActive
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              : '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
            scale: isSearchActive ? 1.02 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Left side - Upload buttons */}
          <div className="flex items-center gap-2 px-2 flex-shrink-0">
            <motion.button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image className="w-5 h-5" />
            </motion.button>

            <motion.button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-gray-200 mx-1 flex-shrink-0" />

          {/* Center - Text input */}
          <div className="flex-1 px-3 py-2 min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              onFocus={handleFocus}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                  e.currentTarget.select()
                }
              }}
              placeholder="Ask me anything about data, architecture, design or upload your files…"
              className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-500 text-base leading-relaxed h-6 overflow-hidden text-ellipsis whitespace-nowrap select-text"
              style={{
                paddingRight: '8px',
                userSelect: 'text',
                WebkitUserSelect: 'text',
                MozUserSelect: 'text'
              }}
            />
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-2 px-2 flex-shrink-0">
            <motion.button
              type="button"
              className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mic className="w-5 h-5" />
            </motion.button>

            <motion.button
              type="submit"
              disabled={!promptValue.trim() && uploadedFiles.length === 0}
              className="flex items-center justify-center w-10 h-10 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 disabled:text-gray-400 text-black rounded-full transition-colors"
              whileHover={{ scale: promptValue.trim() || uploadedFiles.length > 0 ? 1.05 : 1 }}
              whileTap={{ scale: promptValue.trim() || uploadedFiles.length > 0 ? 0.95 : 1 }}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Listening indicator */}
          <AnimatePresence>
            {(isFocused || isSearchActive) && (
              <>
                <motion.div
                  className="absolute inset-0 border-2 border-yellow-400 rounded-full pointer-events-none"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{
                    opacity: [0.6, 1, 0.6],
                    scale: 1
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
                <motion.div
                  className="absolute inset-0 border-2 border-yellow-400/40 rounded-full pointer-events-none"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{
                    opacity: [0, 0.4, 0],
                    scale: [1, 1.05, 1]
                  }}
                  exit={{ opacity: 0, scale: 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </form>

      {/* Helper text */}
      <AnimatePresence>
        {!isSearchActive && (
          <motion.div
            className="mt-3 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 2 }}
          >
            <p className="text-gray-600 text-sm">
              Upload images, documents, or simply type your architectural questions
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}