import React from 'react';
import CrowdfundingDashboard from './components/CrowdfundingDashboard';
import CrowdfundingABI from './contracts/Crowdfunding.json';

const contractAddress = "0x243096588BD61c1Cc7339115BC51B01d481F8dA1";
const contractABI = CrowdfundingABI.abi;

function App() {
  return (
    <CrowdfundingDashboard
      contractAddress={contractAddress}
      contractABI={contractABI}
    />
  );
}

export default App;