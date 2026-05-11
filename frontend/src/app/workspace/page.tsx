"use client";

import { useCallback } from 'react';
import { toPng } from 'html-to-image';
import Canvas from '@/components/Canvas';
import AiPrompt from '@/components/AiPrompt';
import FeedbackPanel from '@/components/FeedbackPanel';
import NodePalette from '@/components/NodePalette';
import NodeDetailPanel from '@/components/NodeDetailPanel';
import DataFlowPanel from '@/components/DataFlowPanel';
import ChallengePanel from '@/components/ChallengePanel';
import useStore from '@/store/useStore';
import { Activity, CloudUpload, Download, ArrowLeft, Network, Square } from 'lucide-react';
import Link from 'next/link';

export default function WorkspacePage() {
    const { isSimulating, toggleSimulation, selectedNodeId, nodes, edges } = useStore();

    /* ── Save ──────────────────────────────────────── */
    const handleSave = async () => {
        try {
            await fetch('http://localhost:8000/api/v1/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Archflow Canvas', graph: { nodes, edges } }),
            });
            alert('Saved to database!');
        } catch {
            alert('Failed to save.');
        }
    };

    /* ── Export PNG ────────────────────────────────── */
    const handleExport = useCallback(async () => {
        const el = document.querySelector('.react-flow') as HTMLElement;
        if (!el) return;
        try {
            const dataUrl = await toPng(el, {
                backgroundColor: '#030712',
                pixelRatio: 2,
                filter: (node) => {
                    // exclude minimap, controls, and panel overlays from export
                    if (node.classList?.contains('react-flow__minimap')) return false;
                    if (node.classList?.contains('react-flow__controls')) return false;
                    return true;
                },
            });
            const a = document.createElement('a');
            a.download = 'archflow-diagram.png';
            a.href = dataUrl;
            a.click();
        } catch (e) {
            console.error('Export failed', e);
            alert('Export failed. Try zooming out first.');
        }
    }, []);

    return (
        <main className="flex h-screen flex-col bg-[#030712] text-white overflow-hidden">

            {/* ── Header ──────────────────────────────────── */}
            <header className="flex items-center justify-between px-5 py-2.5 border-b border-white/5 bg-[#030712]/90 backdrop-blur-md z-50 flex-shrink-0">
                {/* Left: brand + back */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-white/6 transition-all"
                        title="Back to home"
                    >
                        <ArrowLeft size={16} />
                    </Link>

                    <div className="w-px h-5 bg-white/8" />

                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                            <Network size={14} className="text-white" />
                        </div>
                        <div>
                            <span className="text-sm font-bold tracking-tight">Arch<span className="text-blue-400">flow</span></span>
                            <span className="text-xs text-gray-600 ml-2">Canvas</span>
                        </div>
                    </div>
                </div>

                {/* Center: canvas name */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/4 border border-white/6 text-xs text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Untitled Architecture
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2">
                    {/* Export PNG */}
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 text-xs font-medium text-gray-300 hover:text-white transition-all"
                        title="Export as PNG"
                    >
                        <Download size={13} />
                        Export
                    </button>

                    {/* Save */}
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 text-xs font-medium text-gray-300 hover:text-white transition-all"
                        title="Save to database"
                    >
                        <CloudUpload size={13} />
                        Save
                    </button>

                    <div className="w-px h-5 bg-white/8" />

                    {/* Simulate / Stop */}
                    <button
                        onClick={toggleSimulation}
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all overflow-hidden ${
                            isSimulating
                                ? 'bg-red-600/90 hover:bg-red-500 border border-red-500/50 shadow-lg shadow-red-600/20'
                                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-500/30 shadow-lg shadow-emerald-600/20'
                        }`}
                    >
                        {isSimulating ? (
                            <>
                                <Square size={11} className="fill-white" />
                                Stop Simulation
                                {/* live pulse ring */}
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-60" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-200" />
                                </span>
                            </>
                        ) : (
                            <>
                                <Activity size={13} />
                                Run Simulation
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* ── 3-panel body ────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden min-h-0">

                {/* Left sidebar */}
                <aside className="w-72 flex-shrink-0 bg-gray-900/30 border-r border-white/5 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 min-h-0">
                        <FeedbackPanel />
                        <div className="border-t border-white/5" />
                        <NodePalette />
                    </div>
                </aside>

                {/* Canvas */}
                <div className="flex-1 relative overflow-hidden">
                    <AiPrompt />
                    <Canvas />
                </div>

                {/* Right sidebar — node detail */}
                {selectedNodeId && (
                    <aside className="w-80 flex-shrink-0 bg-gray-900/30 border-l border-white/5 overflow-hidden flex flex-col">
                        <NodeDetailPanel />
                    </aside>
                )}
            </div>

            {/* Data Flow Log */}
            <DataFlowPanel />

            {/* Challenge floating button */}
            <ChallengePanel />
        </main>
    );
}
