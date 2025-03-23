import React, { useState, useEffect } from "react";
import "./header.css";
import Login from "./login";
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '../contract';

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLogin = async (username) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // Request account access
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const tx = await contract.registerUser(username);
    await tx.wait();
    setUser(username);
    localStorage.setItem("user", username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <header className="header">
      <div className="container">
        <a href="/" className="logo">Metro Mart</a>
        <div className="right-content">
          <div className="search-bar">
            <input type="text" placeholder="Search for a product..." />
            <button>🔍</button>
          </div>
          <nav className="nav-links">
            <a href="/products">Products</a>
            <a href="/categories">Categories</a>
            {user ? (
              <div className="user-info">
                <span className="username">👤 {user}</span>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <Login onLogin={handleLogin} />
            )}
            <div className="cart">
              <a href="/cart" className="icon">🛒</a>
              <span className="cart-badge">0</span>
            </div>
            <button className="icon">🌙</button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;