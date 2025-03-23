import React from "react";
import './card.css';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '../contract';

function Cards(props) {
  const { id, name, price, isBought } = props;

  const handleBuy = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // Request account access
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const tx = await contract.buyProduct(id, {
      value: ethers.utils.parseEther(price),
    });
    await tx.wait();
    alert(`You have successfully purchased ${name}!`);
    window.location.reload(); // Refresh the page to update the product status
  };

  return (
    <div className='card'>
      <img src='../public/background.JPG' className="cardimage" alt={name} />
      <p><b>Name: {name}</b></p>
      <p><b>Price: {price} ETH</b></p>
      <button onClick={handleBuy} disabled={isBought}>
        {isBought ? "Sold Out" : "Buy Now"}
      </button>
    </div>
  );
}

export default Cards;