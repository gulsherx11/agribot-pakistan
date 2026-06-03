from langgraph.graph import StateGraph, END
from typing import TypedDict, Optional
from agents.weather_agent import get_weather
from agents.irrigation_agent import get_irrigation_advice
from agents.fertilizer_agent import get_fertilizer_advice
from agents.llm_advisory_agent import get_llm_advice

# ── State ──────────────────────────────────────────
class AgriState(TypedDict):
    crop: str
    city: str
    area_acres: float
    stage: str
    disease: str
    weather: Optional[dict]
    irrigation: Optional[dict]
    fertilizer: Optional[dict]
    final_advice: Optional[str]

# ── Nodes ──────────────────────────────────────────
async def weather_node(state: AgriState) -> AgriState:
    result = await get_weather(state["city"])
    return {**state, "weather": result}

async def irrigation_node(state: AgriState) -> AgriState:
    result = await get_irrigation_advice(state["crop"], state["city"])
    return {**state, "irrigation": result}

async def fertilizer_node(state: AgriState) -> AgriState:
    result = get_fertilizer_advice(
        state["crop"],
        state["stage"],
        state["area_acres"],
        state["disease"]
    )
    return {**state, "fertilizer": result}

async def llm_node(state: AgriState) -> AgriState:
    result = await get_llm_advice({
        "crop":       state["crop"],
        "city":       state["city"],
        "area_acres": state["area_acres"],
        "weather":    state["weather"],
        "irrigation": state["irrigation"],
        "fertilizer": state["fertilizer"],
        "disease":    state["disease"]
    })
    return {**state, "final_advice": result["advice"]}

# ── Build Graph ────────────────────────────────────
def build_graph():
    graph = StateGraph(AgriState)

    graph.add_node("weather_agent",    weather_node)
    graph.add_node("irrigation_agent", irrigation_node)
    graph.add_node("fertilizer_agent", fertilizer_node)
    graph.add_node("llm_advisor",      llm_node)

    graph.set_entry_point("weather_agent")
    graph.add_edge("weather_agent",    "irrigation_agent")
    graph.add_edge("irrigation_agent", "fertilizer_agent")
    graph.add_edge("fertilizer_agent", "llm_advisor")
    graph.add_edge("llm_advisor",      END)

    return graph.compile()

agri_app = build_graph()