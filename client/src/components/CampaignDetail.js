import React, { useState } from 'react';
import { ethers } from 'ethers';
import { X } from 'lucide-react';

const CampaignDetail = ({ campaign, onClose, contract, account }) => {
    const [donationAmount, setDonationAmount] = useState('');

    const handleDonate = async () => {
        try {
            const tx = await contract.donatetoCampaign(campaign.id, {
                value: ethers.parseEther(donationAmount)
            });
            await tx.wait();
            console.log("Donation successful!");
            onClose(); // Close the detail view after successful donation
        } catch (error) {
            console.error("Error donating to campaign:", error);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="relative">
                <img src={campaign.image} alt={campaign.title} className="w-full h-64 object-cover" />
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-gray-900 p-2 rounded-full"
                >
                    <X size={24} />
                </button>
            </div>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{campaign.title}</h2>
                <div className="flex justify-between mb-6">
                    <div>
                        <p className="text-gray-400">Days Left</p>
                        <p className="text-xl font-bold">{Math.ceil((Number(campaign.deadline) * 1000 - Date.now()) / (1000 * 60 * 60 * 24))}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Raised</p>
                        <p className="text-xl font-bold">{ethers.formatEther(campaign.amountCollected)} ETH</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Total Backers</p>
                        <p className="text-xl font-bold">{campaign.donators.length}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Creator</h3>
                    <p className="text-gray-400">{campaign.owner}</p>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Story</h3>
                    <p className="text-gray-400">{campaign.description}</p>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Donators</h3>
                    <ul className="space-y-2">
                        {campaign.donators.map((donator, index) => (
                            <li key={index} className="flex justify-between">
                                <span className="text-gray-400">{donator.slice(0, 6)}...{donator.slice(-4)}</span>
                                <span>{ethers.formatEther(campaign.donations[index])} ETH</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Fund</h3>
                    <input
                        type="number"
                        placeholder="ETH 0.1"
                        className="w-full bg-gray-700 rounded p-2 mb-2"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                    />
                    <button
                        onClick={handleDonate}
                        className="w-full bg-purple-500 text-white py-2 rounded"
                    >
                        Fund Campaign
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetail;