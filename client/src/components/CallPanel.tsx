import { useState } from "react";
import axios from "axios";
import ConfirmModal from "./ConfirmModal";

export default function CallPanel() {
  const [number, setNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState<(() => void) | null>(null);
  const [modalMessage, setModalMessage] = useState("Are you sure?"); // Default message

  const handleCall = async () => {
    await axios.post("http://localhost:5100/api/call", { to: number });
  };
  const showModalWithAction = (newAction: () => void, message: string) => {
    setAction(() => newAction);
    setModalMessage(message);
    setIsModalOpen(true);
  };
  const handleConfirm = () => {
    if (action) action();
    setIsModalOpen(false);
    setAction(null);
  };
  return (
    <div className="panel">
      <div className="block-header">Make a Call</div>
      <div className="block-content">
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="p-2"
        />
        <button
          onClick={() => {
            showModalWithAction(handleCall, "Clock in now?");
          }}
          className="btn btn-action"
        >
          Call
        </button>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        message={modalMessage}
      />
    </div>
  );
}
