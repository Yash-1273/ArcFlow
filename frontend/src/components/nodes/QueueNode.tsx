"use client";

import { Handle, Position } from 'reactflow';
import { Layers } from 'lucide-react';
import useStore from '@/store/useStore';

export default function QueueNode({ id, data }: { id: string; data: any }) {
    const selectedNodeId = useStore(state => state.selectedNodeId);
    const isExpanded = selectedNodeId === id;

    const statusColor =
        data.status === 'bottleneck' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]' :
        data.status === 'warning'    ? 'bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.7)]' :
                                       'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]';

    return (
        <div className={`px-4 py-3 shadow-xl rounded-lg bg-gray-800 border-2 text-gray-100 flex flex-col gap-2 transition-all duration-200 ${
            isExpanded ? 'border-amber-500 min-w-[260px]' : 'border-gray-700 min-w-[200px]'
        }`}>
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-amber-400 border-none" />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Layers size={20} className="text-amber-400" />
                    <div className="font-bold text-sm tracking-wide">{data.label}</div>
                </div>
                <div className={`rounded-full w-3 h-3 ${statusColor}`} />
            </div>

            <div className="text-xs text-gray-400 flex justify-between bg-gray-900 px-2 py-1 rounded">
                <span>Queue Delay:</span>
                <span className="text-amber-300 font-mono">{data.latency ?? 0}ms</span>
            </div>

            {isExpanded && (
                <div className="border-t border-gray-700 pt-2 flex flex-col gap-2">
                    {data.description && (
                        <p className="text-xs text-gray-400 leading-relaxed">{data.description}</p>
                    )}
                    {data.data_steps?.length > 0 && (
                        <div className="flex flex-col gap-1">
                            {data.data_steps.map((step: string, i: number) => (
                                <div key={i} className="flex gap-1.5 items-start text-xs">
                                    <span className="text-amber-400 font-mono mt-0.5 flex-shrink-0">{i + 1}.</span>
                                    <span className="text-gray-300 leading-tight">{step}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {data.utilization !== undefined && (
                        <div className="flex justify-between text-xs bg-gray-900 px-2 py-1 rounded">
                            <span className="text-gray-500">Utilization:</span>
                            <span className="text-white font-mono">{((data.utilization ?? 0) * 100).toFixed(0)}%</span>
                        </div>
                    )}
                </div>
            )}

            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-amber-400 border-none" />
        </div>
    );
}
