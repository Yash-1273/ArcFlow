"use client";

import React from 'react';
import useStore from '@/store/useStore';
import { Settings2 } from 'lucide-react';

export default function PropertiesSidebar() {
  const { nodes, updateNodeData } = useStore();
  
  const selectedNode = nodes.find(n => n.selected);

  if (!selectedNode) return null;

  return (
    <div className="absolute right-6 top-6 w-80 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] p-4 z-40 text-gray-200 transition-all">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
        <Settings2 size={18} className="text-blue-400" />
        <h2 className="font-semibold text-sm tracking-wide">{selectedNode.data?.label || 'Node'} Settings</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase font-bold tracking-wider">Max Throughput (TPS)</label>
          <input 
            type="number" 
            value={selectedNode.data.max_tps ?? 1000}
            onChange={(e) => updateNodeData(selectedNode.id, { max_tps: parseInt(e.target.value) || 0 })}
            className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-sm focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase font-bold tracking-wider">Base Latency (ms)</label>
          <input 
            type="number" 
            value={selectedNode.data.latency ?? 20}
            onChange={(e) => updateNodeData(selectedNode.id, { latency: parseInt(e.target.value) || 0 })}
            className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-sm focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
          />
        </div>
        
        <div className="mt-2 p-3 bg-gray-950 border border-gray-800 rounded-lg text-xs flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 uppercase font-bold">Health</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                selectedNode.data.status === 'bottleneck' ? 'bg-red-500/20 text-red-400' :
                selectedNode.data.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-emerald-500/20 text-emerald-400'
            }`}>{selectedNode.data.status || 'healthy'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 uppercase font-bold">Utilization</span>
            <span className="text-white font-mono">{((selectedNode.data.utilization ?? 0) * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 uppercase font-bold">Live Traffic</span>
            <span className="text-white font-mono">{selectedNode.data.traffic ?? 0} req/s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
