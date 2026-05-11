"use client";

import React, { useState } from 'react';
import { Target, Trophy, Check } from 'lucide-react';
import useStore from '@/store/useStore';

export default function ChallengePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { feedback } = useStore();
  
  const targetCost = 500.00;
  const passed = feedback ? feedback.estimated_monthly_cost <= targetCost && feedback.score >= 80 : false;

  return (
    <div className="absolute right-6 bottom-6 z-40">
      {!isOpen ? (
        <button 
            onClick={() => setIsOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-4 shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all animate-bounce"
        >
            <Trophy size={24} />
        </button>
      ) : (
        <div className="w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-4 text-gray-200 relative animate-in slide-in-from-bottom-5">
            <button onClick={() => setIsOpen(false)} className="absolute top-2 right-3 text-gray-500 hover:text-white">x</button>
            <div className="flex items-center gap-2 mb-3 border-b border-gray-700 pb-2">
                <Target size={20} className="text-indigo-400" />
                <h2 className="font-bold text-sm">Scenario Challenge</h2>
            </div>
            
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 mb-3">
                <h3 className="font-bold text-md text-white">Design Netflix Cache</h3>
                <p className="text-[11px] text-gray-400 mt-1 leading-tight">Scale a read-heavy video metadata architecture under strict budget rules.</p>
                <div className="mt-3 flex flex-col gap-1 text-xs bg-gray-900 p-2 rounded">
                    <div className="flex justify-between uppercase font-bold tracking-wide">
                        <span className="text-gray-500">Max Budget:</span>
                        <span className="text-white font-mono">${targetCost}/mo</span>
                    </div>
                    <div className="flex justify-between uppercase font-bold tracking-wide">
                        <span className="text-gray-500">Min Score:</span>
                        <span className="text-white font-mono">80/100</span>
                    </div>
                </div>
            </div>

            {passed ? (
                <div className="bg-emerald-500/20 border border-emerald-500/50 p-2 rounded-lg flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <Check size={18} /> Challenge Complete!
                </div>
            ) : (
                <div className="bg-gray-800 p-2 rounded-lg text-center text-xs text-gray-500 italic">
                    Awaiting AI Analysis Validation...
                </div>
            )}
        </div>
      )}
    </div>
  );
}
