// frontend\src\components\modals\modal.tsx
interface ModalProps {
    isOpen: boolean; // Add isOpen prop
    onClose: () => void; // Add onClose prop
    children: React.ReactNode; // Add children prop
  }

// Generic modal component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-bpegrey rounded-lg p-6 relative w-3/4 max-w-3xl ">
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
          </button>
          {children}
        </div>
      </div>
    );
  };
  
  export default Modal;