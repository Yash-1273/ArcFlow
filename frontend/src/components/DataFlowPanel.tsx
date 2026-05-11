"use client";

import { useEffect, useRef, useState } from 'react';
import useStore, { FlowEvent } from '@/store/useStore';
import { ChevronDown, ChevronUp, ArrowRight, Trash2, Radio } from 'lucide-react';

/* Protocol → colour */
const PROTOCOL_COLORS: Record<string, string> = {
    REST:    'text-purple-400 bg-purple-500/10 border-purple-500/20',
    HTTP:    'text-blue-400   bg-blue-500/10   border-blue-500/20',
    HTTPS:   'text-blue-400   bg-blue-500/10   border-blue-500/20',
    SQL:     'text-amber-400  bg-amber-500/10  border-amber-500/20',
    gRPC:    'text-teal-400   bg-teal-500/10   border-teal-500/20',
    WS:      'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    MQ:      'text-orange-400 bg-orange-500/10 border-orange-500/20',
    TCP:     'text-sky-400    bg-sky-500/10    border-sky-500/20',
};

const protocolClass = (p: string) =>
    PROTOCOL_COLORS[p.toUpperCase()] ?? 'text-gray-400 bg-gray-500/10 border-gray-500/20';

/* Latency badge colour */
const latencyColor = (ms: number) =>
    ms >= 1000 ? 'text-red-400' :
    ms >= 200  ? 'text-yellow-400' :
                 'text-emerald-400';

function EventRow({ event, index }: { event: FlowEvent; index: number }) {
    const pc = protocolClass(event.protocol);
    return (
        <div className="group flex items-center gap-3 px-4 py-1.5 hover:bg-white/3 transition-colors rounded-md text-xs">
            {/* index */}
            <span className="text-gray-700 font-mono w-8 text-right flex-shrink-0 select-none">
                {String(index + 1).padStart(3, '0')}
            </span>

            {/* from */}
            <span className="text-gray-300 font-medium truncate max-w-[130px]" title={event.from}>
                {event.from}
            </span>

            <ArrowRight size={10} className="text-gray-700 flex-shrink-0" />

            {/* to */}
            <span className="text-gray-300 font-medium truncate max-w-[130px]" title={event.to}>
                {event.to}
            </span>

            {/* protocol badge */}
            <span className={`flex-shrink-0 px-1.5 py-0.5 rounded border text-[10px] font-mono font-bold ${pc}`}>
                {event.protocol}
            </span>

            {/* latency */}
            <span className={`ml-auto font-mono flex-shrink-0 tabular-nums ${latencyColor(event.latency)}`}>
                {event.latency}ms
            </span>
        </div>
    );
}

export default function DataFlowPanel() {
    const { flowLog, isSimulating, clearFlowLog } = useStore();
    const [isOpen, setIsOpen] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);

    /* auto-scroll to bottom when new events arrive */
    useEffect(() => {
        if (autoScroll && scrollRef.current && isOpen) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [flowLog, isOpen, autoScroll]);

    /* detect manual scroll up → disable auto-scroll */
    const onScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        setAutoScroll(scrollHeight - scrollTop - clientHeight < 40);
    };

    if (!isSimulating && flowLog.length === 0) return null;

    return (
        <div className={`border-t border-white/5 bg-[#070d1a]/90 backdrop-blur-sm flex-shrink-0 transition-all duration-200 ${isOpen ? 'h-48' : 'h-10'}`}>

            {/* ── Toolbar ── */}
            <div className="flex items-center gap-3 px-4 h-10 border-b border-white/4 flex-shrink-0">
                {/* live indicator */}
                <div className="flex items-center gap-2">
                    {isSimulating ? (
                        <span className="flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-50" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                    ) : (
                        <Radio size={12} className="text-gray-600" />
                    )}
                    <span className="text-xs font-semibold text-gray-300">Data Flow</span>
                    {isSimulating && (
                        <span className="text-[10px] text-emerald-400 border border-emerald-500/30 bg-emerald-500/8 px-1.5 py-0.5 rounded font-bold tracking-wide">
                            LIVE
                        </span>
                    )}
                </div>

                {/* event count */}
                <span className="text-[10px] text-gray-600 font-mono">{flowLog.length} events</span>

                {/* auto-scroll indicator */}
                {!autoScroll && isOpen && (
                    <button
                        onClick={() => { setAutoScroll(true); if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }}
                        className="text-[10px] text-blue-400 hover:text-blue-300 border border-blue-500/20 px-1.5 py-0.5 rounded transition-colors"
                    >
                        ↓ Resume scroll
                    </button>
                )}

                <div className="ml-auto flex items-center gap-1">
                    {/* clear */}
                    {flowLog.length > 0 && (
                        <button
                            onClick={clearFlowLog}
                            className="p-1.5 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-500/8 transition-all"
                            title="Clear log"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}
                    {/* collapse */}
                    <button
                        onClick={() => setIsOpen(o => !o)}
                        className="p-1.5 rounded-md text-gray-600 hover:text-white transition-all"
                    >
                        {isOpen ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
                    </button>
                </div>
            </div>

            {/* ── Log body ── */}
            {isOpen && (
                <div
                    ref={scrollRef}
                    onScroll={onScroll}
                    className="h-[calc(100%-40px)] overflow-y-auto py-1 font-mono"
                >
                    {flowLog.length === 0 ? (
                        <p className="px-4 py-3 text-xs text-gray-700 italic">
                            Waiting for simulation events…
                        </p>
                    ) : (
                        flowLog.map((ev, i) => <EventRow key={i} event={ev} index={i} />)
                    )}
                </div>
            )}
        </div>
    );
}
