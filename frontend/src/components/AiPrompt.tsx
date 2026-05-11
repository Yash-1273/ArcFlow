"use client";

import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import useStore from '@/store/useStore';

export default function AiPrompt() {
  const [prompt, setPrompt] = useState('');
  const { setGraph, isGenerating, setIsGenerating } = useStore();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const isGithub = prompt.trim().startsWith('https://github.com');
      const endpoint = isGithub ? 'http://localhost:8000/api/v1/from-github' : 'http://localhost:8000/api/v1/generate';
      const payload = isGithub ? { repo_url: prompt.trim() } : { prompt };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.nodes && data.edges) {
        setGraph(data.nodes, data.edges);
      } else {
        alert(data.detail || "Error generating architecture. Is GROQ_API_KEY set?");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend engine. Ensure FastAPI is running on port 8000.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <form 
        onSubmit={handleGenerate}
        className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-full shadow-2xl p-2 relative overflow-hidden"
      >
        {isGenerating && (
          <div className="absolute inset-0 bg-blue-500/10 animate-pulse pointer-events-none" />
        )}
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe a system (e.g., 'Netflix architecture') OR paste a GitHub Repo URL" 
          className="flex-1 bg-transparent border-none text-white px-4 py-2 focus:outline-none placeholder-gray-500"
          disabled={isGenerating}
        />
        <button 
          type="submit" 
          disabled={isGenerating || !prompt.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-full p-3 transition-colors flex items-center justify-center min-w-[48px]"
        >
          {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
}
