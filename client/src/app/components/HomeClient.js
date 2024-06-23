'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX } from 'react-icons/fi';
import CrowdfundingABI from '../utils/Crowdfunding.json';
import { Modal } from './Modal';
import { CampaignCard } from './CampaignCard';

const contractAddress = "0x243096588BD61c1Cc7339115BC51B01d481F8dA1";
const contractABI = CrowdfundingABI.abi;

export function HomeClient() {
    const [contract, setContract] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [account, setAccount] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    useEffect(() => {
        const init = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    const address = await signer.getAddress();
                    setAccount(address);

                    const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
                    setContract(contractInstance);

                    await fetchCampaigns(contractInstance);
                } catch (error) {
                    console.error("Error initializing app:", error);
                }
            } else {
                console.log('Please install MetaMask!');
            }
        };

        init();
    }, []);

    const fetchCampaigns = async (contractInstance) => {
        try {
            const fetchedCampaigns = await contractInstance.getCampaigns();
            setCampaigns(fetchedCampaigns);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
        }
    };

    const createCampaign = async (event) => {
        event.preventDefault();
        const title = event.target.title.value;
        const description = event.target.description.value;
        const target = ethers.parseEther(event.target.target.value);
        const deadline = Math.floor(new Date(event.target.deadline.value).getTime() / 1000);
        const image = event.target.image.value;

        try {
            const tx = await contract.createCampaign(account, title, description, target, deadline, image);
            await tx.wait();
            console.log("Campaign created successfully!");
            await fetchCampaigns(contract);
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error("Error creating campaign:", error);
        }
    };

    const donateToCampaign = async (id, amount) => {
        try {
            const tx = await contract.donatetoCampaign(id, { value: ethers.parseEther(amount) });
            await tx.wait();
            console.log("Donation successful!");
            await fetchCampaigns(contract);
        } catch (error) {
            console.error("Error donating to campaign:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
            <header className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Nexus Fund
                </h1>
                <div className="flex items-center space-x-4">
                    <span className="text-sm bg-gray-700 px-4 py-2 rounded-full">
                        {account.slice(0, 6)}...{account.slice(-4)}
                    </span>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full flex items-center"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <FiPlus className="mr-2" /> New Campaign
                    </motion.button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {campaigns.map((campaign, index) => (
                    <CampaignCard
                        key={index}
                        campaign={campaign}
                        onDonate={() => setSelectedCampaign(campaign)}
                    />
                ))}
            </div>

            <AnimatePresence>
                {isCreateModalOpen && (
                    <Modal onClose={() => setIsCreateModalOpen(false)}>
                        <h2 className="text-2xl font-bold mb-4">Create a New Campaign</h2>
                        <form onSubmit={createCampaign} className="space-y-4">
                            <input className="w-full p-2 bg-gray-700 rounded" type="text" name="title" placeholder="Campaign Title" required />
                            <textarea className="w-full p-2 bg-gray-700 rounded" name="description" placeholder="Campaign Description" required />
                            <input className="w-full p-2 bg-gray-700 rounded" type="number" name="target" placeholder="Target Amount (ETH)" required step="0.01" />
                            <input className="w-full p-2 bg-gray-700 rounded" type="datetime-local" name="deadline" required />
                            <input className="w-full p-2 bg-gray-700 rounded" type="text" name="image" placeholder="Image URL" required />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full"
                                type="submit"
                            >
                                Create Campaign
                            </motion.button>
                        </form>
                    </Modal>
                )}

                {selectedCampaign && (
                    <Modal onClose={() => setSelectedCampaign(null)}>
                        <h2 className="text-2xl font-bold mb-4">Donate to {selectedCampaign.title}</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            donateToCampaign(campaigns.indexOf(selectedCampaign), e.target.amount.value);
                            setSelectedCampaign(null);
                        }} className="space-y-4">
                            <input className="w-full p-2 bg-gray-700 rounded" type="number" name="amount" placeholder="Amount to donate (ETH)" step="0.01" required />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full"
                                type="submit"
                            >
                                Confirm Donation
                            </motion.button>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
}