import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import CrowdfundingABI from './Crowdfunding.json';

const contractAddress = "0x243096588BD61c1Cc7339115BC51B01d481F8dA1";
const contractABI = CrowdfundingABI.abi;

function App() {
  const [contract, setContract] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [account, setAccount] = useState('');

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
    <div className="App">
      <h1>Decentralised Crowdfunding App</h1>
      <p>Connected account: {account}</p>

      <h2>Create a Campaign</h2>
      <form onSubmit={createCampaign} className="create-campaign-form">
        <input type="text" name="title" placeholder="Campaign Title" required />
        <input type="text" name="description" placeholder="Campaign Description" required />
        <input type="number" name="target" placeholder="Target Amount (in ETH)" required step="0.01" />
        <input type="datetime-local" name="deadline" required />
        <input type="text" name="image" placeholder="Image URL" required />
        <button type="submit">Create Campaign</button>
      </form>

      <h2>Active Campaigns</h2>
      <div className="campaigns-container">
        {campaigns.map((campaign, index) => (
          <div key={index} className="campaign">
            <div className="campaign-image">
              <img src={campaign.image} alt={campaign.title} />
            </div>
            <div className="campaign-details">
              <h3>{campaign.title}</h3>
              <p>{campaign.description}</p>
              <p>Target: {ethers.formatEther(campaign.target)} ETH</p>
              <p>Collected: {ethers.formatEther(campaign.amountCollected)} ETH</p>
              <p>Deadline: {new Date(Number(campaign.deadline) * 1000).toLocaleString()}</p>
              <form onSubmit={(e) => {
                e.preventDefault();
                donateToCampaign(index, e.target.amount.value);
              }}>
                <input type="number" name="amount" placeholder="Amount to donate (in ETH)" step="0.01" required />
                <button type="submit">Donate</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;