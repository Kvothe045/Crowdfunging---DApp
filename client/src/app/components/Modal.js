import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export const Modal = ({ children, onClose }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-gray-800 p-8 rounded-xl w-full max-w-md relative"
        >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                <FiX size={24} />
            </button>
            {children}
        </motion.div>
    </motion.div>
);