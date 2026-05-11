"use client";

import { Server, Database, Zap, Layers, Scale, Box } from 'lucide-react';

const PALETTE_ITEMS = [
    { type: 'api',          label: 'API / Service',   icon: Server,   color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30 hover:border-purple-400/60' },
    { type: 'database',     label: 'Database',         icon: Database, color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/30 hover:border-blue-400/60'       },
    { type: 'cache',        label: 'Cache',            icon: Zap,      color: 'text-teal-400',   bg: 'bg-teal-500/10 border-teal-500/30 hover:border-teal-400/60'       },
    { type: 'queue',        label: 'Message Queue',    icon: Layers,   color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/30 hover:border-amber-400/60'    },
    { type: 'loadbalancer', label: 'Load Balancer',    icon: Scale,    color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/30 hover:border-green-400/60'    },
    { type: 'custom',       label: 'Custom Component', icon: Box,      color: 'text-gray-400',   bg: 'bg-gray-500/10 border-gray-500/30 hover:border-gray-400/60'       },
];

export default function NodePalette() {
    const onDragStart = (e: React.DragEvent, type: string) => {
        e.dataTransfer.setData('application/reactflow-type', type);
        e.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Add Components</h3>
            <p className="text-[11px] text-gray-600 mb-3">Drag onto the canvas to place</p>
            <div className="flex flex-col gap-1.5">
                {PALETTE_ITEMS.map(({ type, label, icon: Icon, color, bg }) => (
                    <div
                        key={type}
                        draggable
                        onDragStart={e => onDragStart(e, type)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-grab active:cursor-grabbing transition-all text-xs select-none ${bg}`}
                    >
                        <Icon size={15} className={color} />
                        <span className="text-gray-300">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
