import './App.css';
import turtle_logo from './turtle_logo.png';
import SaveTheTurtlesABI from "./SaveTheTurtlesABI.json";
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const turtle_address = '0x3Da1f6A461013CB7de63b3E081C3426E0d2908c9';

function App() {

  // Using state variables to store information
  const [accounts, setAccounts] = useState([]);

  const [name, setName] = useState("");

  const [allDonationInfo, setAllDonationInfo] = useState([]);

  // Check if wallet is connected
  const connectAccounts = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      setAccounts(accounts);
      toast.success("Wallet is succesfully connected");
    }
  }

  // Method that runs when Donate button is clicked
  const handleDonation = async (donateETH) => {
    donateETH.preventDefault();
    const data = new FormData(donateETH.target);
    setName(data.get("user_name"));
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          turtle_address,
          SaveTheTurtlesABI.abi,
          signer
        );

        // Executing the "donate" function from smart contract
        const donateTxn = await contract.donate(name, { value: ethers.utils.parseEther("0.5") });
        console.log("Mining...", donateTxn);
        toast.info("Sending funds. Please wait.");
        await donateTxn.wait();
        console.log("Mined...", donateTxn);
        toast.success(`Thank you for your donation ${name}`);
        let totalDonators = await contract.getAllDonators();
        console.log("Total donators: ", parseFloat(totalDonators));
        setName("");
        getAllDonationInfo();
      }
    } catch (err) {
      setName("");
      window.alert(err);
    }
  }

  // Calling smart contract function for donator's information
  const getAllDonationInfo = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          turtle_address,
          SaveTheTurtlesABI.abi,
          signer
        );

        // Executing the "getAllDonationInfo" function from smart contract
        const donationInfo = await contract.getAllDonationInfo();

        const donationInfoRetrieved = donationInfo.map((donations) => {
          return {
            address: donations.donator,
            name: donations.name,
          };
        });

        // Updating state variable
        setAllDonationInfo(prevInfo => [...prevInfo, {
          address: donationInfoRetrieved.address,
          name: donationInfoRetrieved.name
        }]);
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  // Runs function when page loads
  useEffect(() => {
    connectAccounts();
  }, []);

  return (
    <div className="App-header">
      <img src={turtle_logo} className="App-logo" alt="turtle" />
      <p>
        🐢 Donate 0.5 ETH to Save The Turtles 🐢
      </p>
      <p className="App-bottom">
        Need Metamask installed and Only works for Rinkeby network
      </p>
      {accounts.length ? (
        <div>
          <form onSubmit={handleDonation}>
            <input type="text" name="user_name" placeholder="Enter your name" className="App-input" />
            <button type="submit" className="App-donatebutton">Donate</button>
          </form>
        </div>
      ) : (
        console.log(console.error())
      )}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
