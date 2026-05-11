import { create } from 'zustand';
import { Node, Edge, addEdge, OnNodesChange, OnEdgesChange, OnConnect, applyNodeChanges, applyEdgeChanges } from 'reactflow';

interface Feedback {
    score: number;
    estimated_monthly_cost: number;
    suggestions: string[];
}

export interface FlowEvent {
    from: string;
    to: string;
    protocol: string;
    latency: number;
}

interface AppState {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setGraph: (nodes: Node[], edges: Edge[]) => void;
    updateNodeData: (nodeId: string, newData: any) => void;
    addNode: (node: Node) => void;
    updateGlobalStateFromSimulation: (simNodes: any[]) => void;
    isGenerating: boolean;
    setIsGenerating: (isGen: boolean) => void;
    isSimulating: boolean;
    toggleSimulation: () => void;
    simulationSocket: WebSocket | null;
    feedback: Feedback | null;
    isAnalyzing: boolean;
    analyzeSystem: () => Promise<void>;
    // Node selection & detail
    selectedNodeId: string | null;
    setSelectedNodeId: (id: string | null) => void;
    // Data flow log
    flowLog: FlowEvent[];
    addFlowEvents: (events: FlowEvent[]) => void;
    clearFlowLog: () => void;
}

const initialNodes: Node[] = [
    {
        id: '1', type: 'api', position: { x: 350, y: 150 },
        data: {
            label: 'API Gateway', status: 'healthy', latency: 45, max_tps: 1500,
            description: 'Entry point for all client requests. Handles routing, authentication, and rate limiting.',
            data_steps: ['Receive HTTP/HTTPS request from client', 'Validate JWT bearer token', 'Apply rate limiting rules', 'Route to target service'],
        }
    },
    {
        id: '2', type: 'database', position: { x: 350, y: 350 },
        data: {
            label: 'Primary PostgreSQL', status: 'healthy', latency: 12, max_tps: 1000,
            description: 'Primary relational database storing all persistent application data.',
            data_steps: ['Receive SQL query from application', 'Execute query against data pages', 'Write changes to WAL log', 'Return result set to caller'],
        }
    },
];
const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2', animated: true, label: 'SQL' }];

const useStore = create<AppState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    isGenerating: false,
    isSimulating: false,
    simulationSocket: null,
    feedback: null,
    isAnalyzing: false,
    selectedNodeId: null,
    flowLog: [],

    onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
    onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
    onConnect: (connection) => set({ edges: addEdge({ ...connection, animated: true }, get().edges) }),

    setGraph: (nodes, edges) => set({ nodes, edges, feedback: null, selectedNodeId: null, flowLog: [] }),

    updateNodeData: (nodeId, newData) => {
        set({
            nodes: get().nodes.map((node) =>
                node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
            ),
        });
    },

    addNode: (node) => set({ nodes: [...get().nodes, node] }),

    updateGlobalStateFromSimulation: (simNodes) => {
        set({
            nodes: get().nodes.map((node) => {
                const update = simNodes.find((sn: any) => sn.id === node.id);
                if (update) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            status: update.status,
                            latency: update.latency,
                            utilization: update.utilization,
                            traffic: update.traffic,
                        }
                    };
                }
                return node;
            }),
        });
    },

    setSelectedNodeId: (id) => set({ selectedNodeId: id }),
    addFlowEvents: (events) => set(state => ({ flowLog: [...state.flowLog, ...events].slice(-150) })),
    clearFlowLog: () => set({ flowLog: [] }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),

    toggleSimulation: () => {
        const { isSimulating, simulationSocket, nodes, edges, updateGlobalStateFromSimulation } = get();
        if (isSimulating && simulationSocket) {
            simulationSocket.close();
            set({ isSimulating: false, simulationSocket: null });
            get().clearFlowLog();
        } else {
            const ws = new WebSocket('ws://localhost:8000/api/v1/simulate');
            ws.onopen = () => ws.send(JSON.stringify({ nodes, edges }));
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'SIMULATION_TICK') {
                    updateGlobalStateFromSimulation(data.nodes);
                    if (data.new_nodes?.length > 0) {
                        set(state => ({
                            nodes: [...state.nodes, ...data.new_nodes],
                            edges: [...state.edges, ...data.new_edges],
                        }));
                    }
                    if (data.flow_events?.length > 0) {
                        get().addFlowEvents(data.flow_events);
                    }
                }
            };
            ws.onclose = () => set({ isSimulating: false, simulationSocket: null });
            set({ isSimulating: true, simulationSocket: ws });
        }
    },

    analyzeSystem: async () => {
        const { nodes, edges } = get();
        set({ isAnalyzing: true, feedback: null });
        try {
            const res = await fetch('http://localhost:8000/api/v1/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges }),
            });
            const data = await res.json();
            if (res.ok) {
                set({ feedback: data });
            } else {
                console.error(data);
                alert('Analysis Failed. Ensure GROQ_API_KEY is configured.');
            }
        } catch (e) {
            console.error(e);
            alert('Failed to connect to backend for analysis.');
        } finally {
            set({ isAnalyzing: false });
        }
    },
}));

export default useStore;
