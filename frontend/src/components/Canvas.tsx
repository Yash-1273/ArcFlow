"use client";

import { useCallback, useRef, useState } from 'react';
import ReactFlow, { MiniMap, Controls, Background, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import useStore from '@/store/useStore';
import DatabaseNode from './nodes/DatabaseNode';
import ApiNode from './nodes/ApiNode';
import CacheNode from './nodes/CacheNode';
import QueueNode from './nodes/QueueNode';
import LoadBalancerNode from './nodes/LoadBalancerNode';
import CustomNode from './nodes/CustomNode';
import PacketEdge from './edges/PacketEdge';

const nodeTypes = {
    database: DatabaseNode,
    api: ApiNode,
    cache: CacheNode,
    queue: QueueNode,
    loadbalancer: LoadBalancerNode,
    custom: CustomNode,
};

// All edges use PacketEdge — handles both normal and simulating states
const edgeTypes = {
    default: PacketEdge,
};

const NODE_DEFAULT_LABELS: Record<string, string> = {
    api: 'API Service',
    database: 'Database',
    cache: 'Cache',
    queue: 'Message Queue',
    loadbalancer: 'Load Balancer',
    custom: 'Custom Component',
};

// SVG filter for packet glow effect (injected once into the page)
function PacketGlowFilter() {
    return (
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
                <filter id="packet-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
        </svg>
    );
}

export default function Canvas() {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setSelectedNodeId, addNode } = useStore();
    const [rfInstance, setRfInstance] = useState<any>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedNodeId(node.id);
    }, [setSelectedNodeId]);

    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null);
    }, [setSelectedNodeId]);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('application/reactflow-type');
        if (!type || !rfInstance || !wrapperRef.current) return;

        const bounds = wrapperRef.current.getBoundingClientRect();
        const position = rfInstance.project({
            x: e.clientX - bounds.left,
            y: e.clientY - bounds.top,
        });

        addNode({
            id: `node-${Date.now()}`,
            type,
            position,
            data: {
                label: NODE_DEFAULT_LABELS[type] ?? 'Component',
                status: 'healthy',
                latency: 20,
                max_tps: 1000,
                description: '',
                data_steps: [],
            },
        } as Node);
    }, [rfInstance, addNode]);

    return (
        <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
            <PacketGlowFilter />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setRfInstance}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultEdgeOptions={{ type: 'default' }}
                fitView
            >
                <MiniMap
                    nodeStrokeColor={(n) => {
                        const colors: Record<string, string> = {
                            database: '#3b82f6',
                            api: '#a855f7',
                            cache: '#14b8a6',
                            queue: '#f59e0b',
                            loadbalancer: '#22c55e',
                            custom: '#6b7280',
                        };
                        return colors[n.type ?? ''] ?? '#6b7280';
                    }}
                    nodeColor="#1f2937"
                    maskColor="rgba(3, 7, 18, 0.7)"
                />
                <Controls className="bg-gray-800 border-gray-700 fill-white" />
                <Background color="#374151" gap={16} size={1} />
            </ReactFlow>
        </div>
    );
}
