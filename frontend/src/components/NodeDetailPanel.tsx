"use client";

import { useState, useEffect } from 'react';
import useStore from '@/store/useStore';
import { X, Server, Database, Zap, Layers, Scale, Box } from 'lucide-react';

const NODE_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
    api:          { icon: Server,   color: 'text-purple-400', label: 'API / Service'     },
    database:     { icon: Database, color: 'text-blue-400',   label: 'Database'          },
    cache:        { icon: Zap,      color: 'text-teal-400',   label: 'Cache'             },
    queue:        { icon: Layers,   color: 'text-amber-400',  label: 'Message Queue'     },
    loadbalancer: { icon: Scale,    color: 'text-green-400',  label: 'Load Balancer'     },
    custom:       { icon: Box,      color: 'text-gray-400',   label: 'Custom Component'  },
};

const STATUS_BADGE: Record<string, string> = {
    bottleneck: 'bg-red-500/20 text-red-400',
    warning:    'bg-yellow-500/20 text-yellow-400',
    healthy:    'bg-emerald-500/20 text-emerald-400',
};

export default function NodeDetailPanel() {
    const { nodes, selectedNodeId, setSelectedNodeId, updateNodeData } = useStore();
    const node = nodes.find(n => n.id === selectedNodeId);

    const [stepsText, setStepsText] = useState('');
    const [editingSteps, setEditingSteps] = useState(false);

    // Reset steps editor when node changes
    useEffect(() => {
        setEditingSteps(false);
    }, [selectedNodeId]);

    if (!node) return null;

    const cfg = NODE_CONFIG[node.type ?? ''] ?? NODE_CONFIG.custom;
    const Icon = cfg.icon;
    const data = node.data;
    const statusBadge = STATUS_BADGE[data.status as string] ?? STATUS_BADGE.healthy;

    const saveSteps = () => {
        const steps = stepsText.split('\n').map((s: string) => s.trim()).filter(Boolean);
        updateNodeData(node.id, { data_steps: steps });
        setEditingSteps(false);
    };

    return (
        <div className="h-full flex flex-col text-gray-200 text-sm overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                    <Icon size={18} className={cfg.color + ' flex-shrink-0'} />
                    <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">{data.label}</div>
                        <div className="text-xs text-gray-500">{cfg.label}</div>
                    </div>
                </div>
                <button
                    onClick={() => setSelectedNodeId(null)}
                    className="text-gray-600 hover:text-white transition-colors flex-shrink-0 ml-2"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 min-h-0">

                {/* Label */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">Label</label>
                    <input
                        type="text"
                        value={data.label}
                        onChange={e => updateNodeData(node.id, { label: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">Description</label>
                    <textarea
                        value={data.description ?? ''}
                        onChange={e => updateNodeData(node.id, { description: e.target.value })}
                        placeholder="Describe what this component does..."
                        rows={3}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500 resize-none text-gray-300 leading-relaxed transition-colors"
                    />
                </div>

                {/* Data Flow Steps */}
                <div>
                    <label className="block text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">Data Flow Steps</label>
                    {!editingSteps && data.data_steps?.length > 0 && (
                        <div className="flex flex-col gap-1 mb-2">
                            {data.data_steps.map((step: string, i: number) => (
                                <div key={i} className="flex gap-1.5 items-start text-xs">
                                    <span className={`${cfg.color} font-mono mt-0.5 flex-shrink-0`}>{i + 1}.</span>
                                    <span className="text-gray-300 leading-tight">{step}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {editingSteps ? (
                        <div>
                            <textarea
                                value={stepsText}
                                onChange={e => setStepsText(e.target.value)}
                                placeholder="One step per line..."
                                rows={5}
                                className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500 resize-none text-gray-300 transition-colors"
                            />
                            <div className="flex gap-2 mt-1.5">
                                <button onClick={saveSteps} className="text-xs bg-blue-600 hover:bg-blue-500 px-2.5 py-1 rounded transition-colors">
                                    Save
                                </button>
                                <button onClick={() => setEditingSteps(false)} className="text-xs bg-gray-700 hover:bg-gray-600 px-2.5 py-1 rounded transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => { setStepsText((data.data_steps ?? []).join('\n')); setEditingSteps(true); }}
                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            {data.data_steps?.length > 0 ? 'Edit steps' : '+ Add data flow steps'}
                        </button>
                    )}
                </div>

                {/* Live Metrics */}
                <div>
                    <label className="block text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">Live Metrics</label>
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 flex flex-col gap-2 text-xs">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Status</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusBadge}`}>
                                {data.status || 'healthy'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Utilization</span>
                            <span className="font-mono">{((data.utilization ?? 0) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Live Traffic</span>
                            <span className="font-mono">{data.traffic ?? 0} req/s</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Latency</span>
                            <span className="font-mono">{data.latency ?? 0}ms</span>
                        </div>
                    </div>
                </div>

                {/* Configuration */}
                <div>
                    <label className="block text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">Configuration</label>
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Max Throughput (TPS)</label>
                            <input
                                type="number"
                                value={data.max_tps ?? 1000}
                                onChange={e => updateNodeData(node.id, { max_tps: parseInt(e.target.value) || 0 })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Base Latency (ms)</label>
                            <input
                                type="number"
                                value={data.latency ?? 20}
                                onChange={e => updateNodeData(node.id, { latency: parseInt(e.target.value) || 0 })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
