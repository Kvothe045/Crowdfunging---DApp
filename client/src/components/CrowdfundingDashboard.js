import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Search, Grid, Bell, Image, Type, User, LogOut, AlertTriangle } from 'lucide-react';
import CampaignDetail from './CampaignDetail';
import CreateCampaignModal from './CreateCampaignModal';

const CrowdfundingDashboard = ({ contractAddress, contractABI }) => {
    const [contract, setContract] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [account, setAccount] = useState('');
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [lowBalanceAlert, setLowBalanceAlert] = useState(false);

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
    }, [contractAddress, contractABI]);

    const fetchCampaigns = async (contractInstance) => {
        try {
            const fetchedCampaigns = await contractInstance.getCampaigns();
            setCampaigns(fetchedCampaigns);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
        }
    };

    const handleCreateCampaign = async (campaignData) => {
        try {
            const imageUrl = await fetchImageUrl(campaignData.title);
            const tx = await contract.createCampaign(
                account,
                campaignData.title,
                campaignData.description,
                ethers.parseEther(campaignData.target),
                Math.floor(new Date(campaignData.deadline).getTime() / 1000),
                imageUrl
            );
            await tx.wait();
            console.log("Campaign created successfully!");
            await fetchCampaigns(contract);
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error("Error creating campaign:", error);
        }
    };

    const fetchImageUrl = async (title) => {
        // This is a placeholder function. In a real application, you would call your backend API here.
        // The backend would then use a service like Unsplash API to fetch a relevant image.
        return `https://source.unsplash.com/featured/?${encodeURIComponent(title)}`;
    };

    const isActiveCampaign = (campaign) => {
        return Number(campaign.deadline) * 1000 > Date.now() &&
            ethers.formatEther(campaign.amountCollected) < ethers.formatEther(campaign.target);
    };

    const activeCampaigns = campaigns.filter(isActiveCampaign);
    const pastCampaigns = campaigns.filter(campaign => !isActiveCampaign(campaign));

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <div className="w-20 bg-gray-800 flex flex-col items-center py-8 space-y-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold">CF</span>
                </div>
                <Grid size={28} className="text-gray-400 hover:text-white transition-colors" />
                <Bell size={28} className="text-gray-400 hover:text-white transition-colors" />
                <Image size={28} className="text-gray-400 hover:text-white transition-colors" />
                <Type size={28} className="text-gray-400 hover:text-white transition-colors" />
                <User size={28} className="text-gray-400 hover:text-white transition-colors" />
                <div className="flex-grow"></div>
                <LogOut size={28} className="text-gray-400 hover:text-white transition-colors" />
            </div>

            {/* Main content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for campaigns"
                            className="bg-gray-800 text-white pl-12 pr-4 py-3 rounded-full w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:from-green-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                    >
                        Create a Campaign
                    </button>
                    <div className="flex items-center space-x-3 bg-gray-800 rounded-full px-5 py-2">
                        <User size={24} className="text-green-400" />
                        <span className="text-sm font-medium">{account.slice(0, 6)}...{account.slice(-4)}</span>
                    </div>
                </div>

                {selectedCampaign ? (
                    <CampaignDetail
                        campaign={selectedCampaign}
                        onClose={() => setSelectedCampaign(null)}
                        contract={contract}
                        account={account}
                        setLowBalanceAlert={setLowBalanceAlert}
                    />
                ) : (
                    <>
                        {/* Active Campaigns */}
                        <h2 className="text-3xl font-bold mb-6">Active Campaigns ({activeCampaigns.length})</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                            {activeCampaigns.map((campaign, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg"
                                    onClick={() => setSelectedCampaign(campaign)}
                                >
                                    <img src={campaign.image} alt={campaign.title} className="w-full h-48 object-cover" />
                                    <div className="p-6">
                                        <h3 className="font-bold text-xl mb-2">{campaign.title}</h3>
                                        <div className="flex justify-between items-center mt-4 text-sm">
                                            <div>
                                                <p className="text-green-400 font-semibold">{ethers.formatEther(campaign.amountCollected)} ETH</p>
                                                <p className="text-gray-400">of {ethers.formatEther(campaign.target)} ETH</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">{Math.ceil((Number(campaign.deadline) * 1000 - Date.now()) / (1000 * 60 * 60 * 24))}</p>
                                                <p className="text-gray-400">Days Left</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                                                style={{ width: `${(Number(campaign.amountCollected) / Number(campaign.target)) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Past Campaigns */}
                        <h2 className="text-3xl font-bold mb-6">Past Campaigns ({pastCampaigns.length})</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {pastCampaigns.map((campaign, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg opacity-60"
                                >
                                    <div className="relative">
                                        <img src={campaign.image} alt={campaign.title} className="w-full h-48 object-cover filter grayscale" />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <span className="text-white font-bold text-xl">Closed</span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-bold text-xl mb-2">{campaign.title}</h3>
                                        <p className="text-gray-400">Raised: {ethers.formatEther(campaign.amountCollected)} ETH</p>
                                        <p className="text-gray-400">Target: {ethers.formatEther(campaign.target)} ETH</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {isCreateModalOpen && (
                <CreateCampaignModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreateCampaign}
                />
            )}

            {lowBalanceAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full">
                        <div className="flex items-center mb-4">
                            <AlertTriangle size={24} className="text-yellow-400 mr-2" />
                            <h2 className="text-xl font-bold">Low Balance</h2>
                        </div>
                        <p className="text-gray-300 mb-6">Your balance is too low to make this donation. Please add funds to your wallet and try again.</p>
                        <button
                            onClick={() => setLowBalanceAlert(false)}
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrowdfundingDashboard;