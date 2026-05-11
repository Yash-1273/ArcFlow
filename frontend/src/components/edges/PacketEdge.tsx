"use client";

import { getBezierPath, EdgeProps, EdgeLabelRenderer, BaseEdge } from 'reactflow';
import useStore from '@/store/useStore';

// Three staggered packets per edge during simulation
const PACKETS = [
    { delay: '0s',    color: '#818cf8' }, // indigo
    { delay: '0.7s',  color: '#34d399' }, // emerald
    { delay: '1.4s',  color: '#60a5fa' }, // blue
];

export default function PacketEdge({
    id,
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
    style,
    markerEnd,
    label,
}: EdgeProps) {
    const isSimulating = useStore(state => state.isSimulating);

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX, sourceY, sourcePosition,
        targetX, targetY, targetPosition,
    });

    return (
        <>
            {/* Edge line — give it the id so <mpath> can reference it */}
            <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />

            {/* Protocol label */}
            {label && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            pointerEvents: 'all',
                        }}
                        className="nodrag nopan"
                    >
                        <span className="text-[10px] bg-gray-900 text-gray-500 px-1.5 py-0.5 rounded border border-gray-700 font-mono">
                            {label as string}
                        </span>
                    </div>
                </EdgeLabelRenderer>
            )}

            {/* Cisco-style animated packets */}
            {isSimulating && PACKETS.map(({ delay, color }, i) => (
                <circle key={i} r={4} fill={color} opacity={0.9} filter="url(#packet-glow)">
                    <animateMotion
                        dur="2.1s"
                        begin={delay}
                        repeatCount="indefinite"
                        calcMode="linear"
                    >
                        <mpath href={`#${id}`} />
                    </animateMotion>
                </circle>
            ))}
        </>
    );
}
