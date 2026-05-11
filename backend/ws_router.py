import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from simulation_engine import SimulationEngine

router = APIRouter(tags=["Simulation WebSockets"])

@router.websocket("/api/v1/simulate")
async def websocket_simulate(websocket: WebSocket):
    """
    Spins up an isolated Simulation Engine instance for the connecting client.
    Expects the very first message to be the Graph blueprint JSON.
    """
    await websocket.accept()
    try:
        # 1. Frontend sends the JSON architectural blueprint
        initial_blueprint = await websocket.receive_text()
        graph_data = json.loads(initial_blueprint)
        
        # 2. Instantiate isolated Math Engine
        engine = SimulationEngine(graph_data)
        
        # 3. Enter infinite streaming loop
        await engine.run(websocket)
        
    except WebSocketDisconnect:
        print("Frontend disconnected from Math Simulation.")
    except Exception as e:
        print(f"Simulation Websocket Error: {e}")
        try:
            await websocket.close()
        except Exception:
            pass
