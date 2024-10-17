// UpdateButton.tsx
import React from 'react';
import { RefreshCw } from 'lucide-react';

interface UpdateButtonProps {
    onUpdate: () => void;
}

const UpdateButton: React.FC<UpdateButtonProps> = ({ onUpdate }) => {
    return (
        <button
            onClick={onUpdate}
            className="flex items-center px-4 py-3 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
            <RefreshCw className="mr-2" />
            Actualizar
        </button>
    );
};

export default UpdateButton;
