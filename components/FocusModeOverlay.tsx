import React from 'react';

interface FocusModeOverlayProps {
    onClose: () => void;
}

const FocusModeOverlay: React.FC<FocusModeOverlayProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black z-[9999] animate-fade-in"
            onClick={onClose} 
            role="dialog"
            aria-modal="true"
            aria-label="Full screen black overlay"
        >
            {/* This div is intentionally empty to create a pure black screen */}
        </div>
    );
};

export default FocusModeOverlay;
