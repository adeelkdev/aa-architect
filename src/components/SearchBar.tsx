/// <reference types="vite/client" />

import { useState, useRef, useEffect } from 'react'
import { Mic, Image, FileText, Send, X, Bot, User } from 'lucide-react'
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

// API base URL from env (e.g. https://api.example.com/ask)
const API_URL = import.meta.env.VITE_API_URL as string | undefined

export default function SearchBar({ isSearchActive, setIsSearchActive }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [promptValue, setPromptValue] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [aiResponses, setAiResponses] = useState<AIResponse[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchActive && inputRef.current) inputRef.current.focus()
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

  async function callApi(query: string): Promise<string> {
    if (!API_URL) throw new Error('API URL not configured')

    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)

    const ct = resp.headers.get('content-type') || ''
    if (ct.includes('application/json')) {
      const data = await resp.json()
      // Show whatever came back (entire JSON), per your requirement
      return typeof data === 'string' ? data : JSON.stringify(data)
    } else {
      return await resp.text()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!promptValue.trim() && uploadedFiles.length === 0) return

    const query = promptValue.trim() || `Uploaded ${uploadedFiles.length} file(s)`
    setIsGenerating(true)

    try {
      const answer = await callApi(query)
      const response: AIResponse = {
        id: Date.now().toString(),
        query,
        response: answer || 'Service not available',
        timestamp: new Date()
      }
      setAiResponses(prev => [response, ...prev])
      setPromptValue('')
      setUploadedFiles([])
    } catch {
      const response: AIResponse = {
        id: Date.now().toString(),
        query,
        response: 'Service not available',
        timestamp: new Date()
      }
      setAiResponses(prev => [response, ...prev])
    } finally {
      setIsGenerating(false)
    }
  }

  const clearAll = () => {
    setAiResponses([])
    setPromptValue('')
    setUploadedFiles([])
    setIsSearchActive(false)
  }

  return (
    <motion.div
      className="relative w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.5 }}
    >
      {/* File upload inputs */}
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

                {/* API Response */}
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
                        className="w-2 h-2 bg-gray-400 rounded-full"
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

          {/* Listening indicator - stroke animation around the search bar */}
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
                  transition={{
                    duration: 2, repeat: Infinity, ease: "easeInOut",
                    delay: 0.5
                  }}
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