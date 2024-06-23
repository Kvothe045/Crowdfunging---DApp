import { motion } from 'framer-motion';
import { ethers } from 'ethers';

export const CampaignCard = ({ campaign, onDonate }) => (
    <motion.div
        className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
        whileHover={{ y: -5 }}
    >
        <img src={campaign.image} alt={campaign.title} className="w-full h-48 object-cover" />
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{campaign.title}</h2>
            <p className="text-gray-400 mb-4">{campaign.description}</p>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <p className="text-sm text-gray-500">Target</p>
                    <p className="text-lg font-semibold">{ethers.formatEther(campaign.target)} ETH</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Collected</p>
                    <p className="text-lg font-semibold">{ethers.formatEther(campaign.amountCollected)} ETH</p>
                </div>
            </div>
            <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                    <div
                        style={{ width: `${(Number(campaign.amountCollected) / Number(campaign.target)) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                    ></div>
                </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
                Deadline: {new Date(Number(campaign.deadline) * 1000).toLocaleDateString()}
            </p>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full"
                onClick={onDonate}
            >
                Donate Now
            </motion.button>
        </div>
    </motion.div>
);