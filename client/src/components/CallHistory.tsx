import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

export default function CallHistory() {
  const [groupedCalls, setGroupedCalls] = useState<
    Record<
      string,
      {
        sid: string;
        fromFormatted: string;
        formattedPrice: string;
        formattedTime: string;
      }[]
    >
  >({});

  useEffect(() => {
    axios
      .get("/api/history")
      .then((res) => {
        setGroupedCalls(res.data);
      })
      .catch((error) => {
        console.error("Error fetching call history:", error);
      });
  }, []);

  return (
    <div className="panel min-w-[600px]">
      <div className="block-header">Call History</div>
      <div className="block-content">
        <div className="table-header">
          <span className="text-center">From Number</span>
          <span className="text-center">Created</span>
          <span className="text-center">Cost</span>
        </div>
        {Object.entries(groupedCalls).map(([date, calls]) => (
          <React.Fragment key={date}>
            <div className="col-span-3 bg-gray-100 p-3 rounded text-center">
              <span className="p-2 font-bold">{date}</span>
            </div>
            {calls.map((call) => (
              <div key={call.sid} className="table-content">
                <span>{call.fromFormatted}</span>
                <span>{call.formattedTime}</span>
                <span>{call.formattedPrice}</span>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
