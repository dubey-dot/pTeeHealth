import { TopNav } from "@/components/layout/TopNav";
import { IntakePage } from "@/pages/IntakePage";

// Only the Intake step of the Journey is built out so far. As Hypothesis,
// Assessment, Reasoning, Treatment, and Evaluation screens are designed,
// this becomes a router with one route per step (see react-router-dom,
// already listed as a dependency for that purpose).
function App() {
  return (
    <div className="min-h-screen bg-canvas">
      <TopNav />
      <IntakePage />
    </div>
  );
}

export default App;
