import React, { useState } from 'react';

interface PasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (password: string) => boolean;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const isSuccess = onSubmit(password);
        if (!isSuccess) {
            setError('Incorrect password. Please try again.');
        } else {
            setPassword(''); // Clear password on success
        }
    };

    const handleClose = () => {
        setError('');
        setPassword('');
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md dark:bg-gray-800">
                <div className="p-6 border-b dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Admin Authentication</h2>
                    <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Please enter the password to access admin features.</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 sr-only">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                                autoFocus
                            />
                        </div>
                        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                    </div>
                    <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3 dark:bg-gray-700/50 dark:border-gray-700">
                        <button type="button" onClick={handleClose} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 dark:border-gray-500">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            Authenticate
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordModal;