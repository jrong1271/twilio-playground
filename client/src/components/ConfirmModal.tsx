import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string; // Optional: custom message for the modal
}

const ConfirmModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md border-1 border-gray-300">
        <h2 className="text-lg text-center font-bold">{message}</h2>
        <div className="mt-4">
          <button onClick={onConfirm} className="btn btn-action">
            Confirm
          </button>
          <button onClick={onClose} className="btn btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
