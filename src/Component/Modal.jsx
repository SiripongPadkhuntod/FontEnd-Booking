import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const LogoutConfirmationModal = ({ isOpen, onConfirm, onCancel, nightMode }) => {
    if (!isOpen) return null;

    const bgClass = nightMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-900";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className={`w-full max-w-md rounded-lg ${bgClass} p-8 relative shadow-2xl text-center`}
            >
                <AlertTriangle className="mx-auto w-16 h-16 text-yellow-500 mb-4" />

                <h2 className="text-2xl font-semibold mb-4 text-yellow-600">
                    Confirm Logout
                </h2>

                <p className="mb-6">Are you sure you want to log out?</p>

                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onCancel}
                        className={`py-3 px-8 rounded-full text-lg font-semibold ${nightMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} text-gray-800`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="py-3 px-8 rounded-full text-lg font-semibold bg-red-600 hover:bg-red-500 text-white"
                    >
                        Logout
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, nightMode }) => {
    if (!isOpen) return null;

    const bgClass = nightMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-900";
    const cardBgClass = nightMode ? "bg-gray-800" : "bg-gray-100";
    const buttonBgClass = nightMode ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className={`w-full max-w-md rounded-lg ${bgClass} p-8 relative shadow-2xl text-center`}
            >
                <AlertTriangle className="mx-auto w-16 h-16 text-yellow-500 mb-4" />

                <h2 className="text-2xl font-semibold mb-4 text-yellow-600">
                    Confirm Cancellation
                </h2>

                <p className="mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>

                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onCancel}
                        className={`py-3 px-8 rounded-full text-lg font-semibold ${nightMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} text-gray-800`}
                    >
                        No, Keep Booking
                    </button>
                    <button
                        onClick={onConfirm}
                        className="py-3 px-8 rounded-full text-lg font-semibold bg-red-600 hover:bg-red-500 text-white"
                    >
                        Yes, Cancel Booking
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default { LogoutConfirmationModal, ConfirmationModal };