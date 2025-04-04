import CallPanel from "./components/CallPanel";
import CallHistory from "./components/CallHistory";

export default function App() {
  return (
    <div className="panel max-w-3xl mx-auto p-4 gap-4 font-sans">
      <CallPanel />
      <CallHistory />
    </div>
  );
}
