import { useEffect, useState } from "react";
import axios from "axios";

export default function CallHistory() {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      await axios.get("/api/history").then((res) => {
        setCalls(res.data);
      });
    }
    fetchHistory();
  }, []);

  return (
    <div className="panel min-w-[600px]">
      <div className="block-header">Call History</div>
      <div className="block-content">
        <div className="table-header">
          <span className="text-center">Dial Number</span>
          <span className="text-center">Cost</span>
          <span className="text-center">Created</span>
        </div>
        {calls.map((call: any) => (
          <div key={call.sid} className="table-content">
            <span>{call.toFormatted}</span>
            <span>{call.formattedPrice}</span>
            <span>{call.formattedTime}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
