import asyncio
import random
import uuid
from typing import Dict, Any, List

class SimulationEngine:
    def __init__(self, graph_data: Dict[str, Any]):
        self.nodes = {n["id"]: n for n in graph_data.get("nodes", [])}
        self.edges = graph_data.get("edges", [])
        self.global_lambda = 500

    def generate_flow_events(self, latency_map: Dict[str, int]) -> List[Dict]:
        """
        Trace 1-2 random data paths through the graph topology per tick.
        Returns a list of hop events showing how data travels node-to-node.
        """
        if not self.edges:
            return []

        events = []
        # Find source nodes (nodes with no incoming edges)
        target_ids = {e.get("target") for e in self.edges}
        source_ids = [nid for nid in self.nodes if nid not in target_ids]
        if not source_ids:
            source_ids = list(self.nodes.keys())[:1]

        for source_id in source_ids[:2]:  # trace at most 2 paths per tick
            current_id = source_id
            visited = set()
            while current_id and current_id not in visited:
                visited.add(current_id)
                outgoing = [e for e in self.edges if e.get("source") == current_id]
                if not outgoing:
                    break
                edge = random.choice(outgoing)
                target_id = edge.get("target")
                if not target_id or target_id not in self.nodes:
                    break
                src_label = self.nodes[current_id].get("data", {}).get("label", current_id)
                tgt_label = self.nodes[target_id].get("data", {}).get("label", target_id)
                protocol = edge.get("label") or "HTTP"
                hop_latency = latency_map.get(target_id, self.nodes[target_id].get("data", {}).get("latency", 10))
                events.append({
                    "from": src_label,
                    "to": tgt_label,
                    "protocol": protocol,
                    "latency": hop_latency,
                })
                current_id = target_id
        return events

    def step_simulation(self):
        """
        Executes Queueing Theory math. Now equipped with Auto-Scaling!
        """
        updates = []
        new_nodes = []
        new_edges = []
        latency_map = {}

        for node_id, node in list(self.nodes.items()):
            data = node.get("data", {})
            max_tps = data.get("max_tps", 1000)
            base_latency = data.get("latency", 20)

            # Traffic routing fractions per node type
            node_type = node.get("type")
            if node_type == "database":
                current_lambda = int(self.global_lambda * 0.8)
            elif node_type == "cache":
                current_lambda = int(self.global_lambda * 0.9)
            elif node_type == "queue":
                current_lambda = int(self.global_lambda * 0.85)
            else:  # api, loadbalancer, custom
                current_lambda = self.global_lambda

            rho = current_lambda / max_tps if max_tps > 0 else 1.0
            status = data.get("status", "healthy")

            # --- Auto Scaling ---
            if rho >= 0.95 and status == "bottleneck" and not data.get("scaled_recently"):
                clone_id = f"clone-{uuid.uuid4().hex[:6]}"
                pos_x = node.get("position", {}).get("x", 200) + random.randint(150, 200)
                pos_y = node.get("position", {}).get("y", 200) + random.randint(-50, 50)
                clone_node = {
                    "id": clone_id,
                    "type": node_type,
                    "position": {"x": pos_x, "y": pos_y},
                    "data": {
                        "label": f'{data.get("label")} (Replica)',
                        "status": "healthy",
                        "latency": base_latency,
                        "max_tps": max_tps,
                        "scaled_recently": True,
                        "description": data.get("description", ""),
                        "data_steps": data.get("data_steps", []),
                    }
                }
                self.nodes[clone_id] = clone_node
                new_nodes.append(clone_node)
                for edge in self.edges:
                    if edge.get("target") == node_id:
                        new_edge = {
                            "id": f"edge-{uuid.uuid4().hex[:6]}",
                            "source": edge["source"],
                            "target": clone_id,
                            "animated": True,
                            "label": edge.get("label", ""),
                        }
                        self.edges.append(new_edge)
                        new_edges.append(new_edge)
                data["scaled_recently"] = True

            # Queueing latency math
            calculated_latency = base_latency
            if rho < 0.7:
                status = "healthy"
            elif 0.7 <= rho < 1.0:
                status = "warning"
                multiplier = 1.0 / (1.0 - rho)
                calculated_latency = min(int(base_latency * multiplier), 3000)
            else:
                status = "bottleneck"
                rho = min(rho, 1.2)
                calculated_latency = 5000

            latency_map[node_id] = calculated_latency
            updates.append({
                "id": node_id,
                "status": status,
                "latency": calculated_latency,
                "utilization": round(rho, 2),
                "traffic": current_lambda
            })

        return updates, new_nodes, new_edges, latency_map

    async def run(self, websocket):
        try:
            while True:
                self.global_lambda += random.randint(-150, 300)
                if self.global_lambda < 100: self.global_lambda = 100
                if self.global_lambda > 5000: self.global_lambda = 5000

                state_updates, new_nodes, new_edges, latency_map = self.step_simulation()
                flow_events = self.generate_flow_events(latency_map)

                payload = {
                    "type": "SIMULATION_TICK",
                    "global_traffic": self.global_lambda,
                    "nodes": state_updates,
                    "flow_events": flow_events,
                }
                if new_nodes:
                    payload["new_nodes"] = new_nodes
                    payload["new_edges"] = new_edges

                await websocket.send_json(payload)
                await asyncio.sleep(0.6)

        except Exception as e:
            print(f"Simulation Halted: {e}")
