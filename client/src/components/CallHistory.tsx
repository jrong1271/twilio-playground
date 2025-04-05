import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

export default function CallHistory() {
  const [groupedCalls, setGroupedCalls] = useState<
    Record<
      string,
      {
        sid: string;
        toFormatted: string;
        formattedPrice: string;
        formattedTime: string;
      }[]
    >
  >({});

  useEffect(() => {
    async function fetchHistory() {
      await axios.get("/api/history").then((res) => {
        setGroupedCalls(res.data);
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
        {Object.entries(groupedCalls).map(([date, calls]) => (
          <React.Fragment key={date}>
            <div className="col-span-3 font-bold bg-gray-100 py-2 px-4 rounded">
              {date}
            </div>
            {calls.map((call) => (
              <div key={call.sid} className="table-content">
                <span>{call.toFormatted}</span>
                <span>{call.formattedPrice}</span>
                <span>{call.formattedTime}</span>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
