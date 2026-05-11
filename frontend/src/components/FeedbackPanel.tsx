"use client";

import useStore from '@/store/useStore';
import { Sparkles, DollarSign, Award, Loader2, Lightbulb } from 'lucide-react';

export default function FeedbackPanel() {
    const { feedback, isAnalyzing, analyzeSystem } = useStore();

    return (
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 text-gray-200">
            <div className="flex items-center justify-between mb-3 border-b border-gray-700/60 pb-2">
                <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-yellow-400" />
                    <h2 className="font-semibold text-sm">AI Architect</h2>
                </div>
                <button
                    onClick={analyzeSystem}
                    disabled={isAnalyzing}
                    className="text-xs font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-2.5 py-1.5 rounded flex items-center gap-1 transition-colors"
                >
                    {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : 'Analyze'}
                </button>
            </div>

            {feedback ? (
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-800 p-2.5 rounded-lg border border-gray-700 flex flex-col items-center">
                            <Award size={16} className="text-yellow-500 mb-1" />
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Score</span>
                            <span className="text-xl font-black text-white">
                                {feedback.score}<span className="text-xs text-gray-500 font-normal">/100</span>
                            </span>
                        </div>
                        <div className="bg-gray-800 p-2.5 rounded-lg border border-gray-700 flex flex-col items-center">
                            <DollarSign size={16} className="text-emerald-500 mb-1" />
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Cost</span>
                            <span className="text-xl font-black text-white">
                                ${feedback.estimated_monthly_cost}<span className="text-xs text-gray-500 font-normal">/mo</span>
                            </span>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                        <h3 className="text-[10px] text-gray-400 uppercase font-bold mb-2 flex items-center gap-1 tracking-wider">
                            <Lightbulb size={12} className="text-yellow-400" />
                            Suggestions
                        </h3>
                        <ul className="text-xs flex flex-col gap-2">
                            {feedback.suggestions.map((s, i) => (
                                <li key={i} className="flex gap-2 items-start">
                                    <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                                    <span className="text-gray-300 leading-relaxed">{s}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <p className="text-xs text-gray-500 italic text-center py-4">
                    Click Analyze to get AI feedback on your architecture.
                </p>
            )}
        </div>
    );
}
