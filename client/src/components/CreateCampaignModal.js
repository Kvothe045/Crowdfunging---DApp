import React, { useState } from 'react';
import { X } from 'lucide-react';

const CreateCampaignModal = ({ onClose, onCreate }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        target: '',
        deadline: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const imageUrl = await generateImageUrl(formData.title);
        onCreate({ ...formData, image: imageUrl });
    };

    const generateImageUrl = async (title) => {
        // This is a placeholder function. In a real implementation, you would call your backend API here.
        // For now, we'll use a placeholder image service.
        return `https://source.unsplash.com/400x300/?${encodeURIComponent(title)}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white">Create Campaign</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">Campaign Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Enter campaign title"
                            className="w-full bg-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Describe your campaign"
                            rows="4"
                            className="w-full bg-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="target" className="block text-sm font-medium text-gray-400 mb-1">Target Amount (ETH)</label>
                        <input
                            type="number"
                            id="target"
                            name="target"
                            placeholder="0.00"
                            step="0.01"
                            className="w-full bg-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                            value={formData.target}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-400 mb-1">End Date</label>
                        <input
                            type="date"
                            id="deadline"
                            name="deadline"
                            className="w-full bg-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                            value={formData.deadline}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Launch Campaign
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaignModal;