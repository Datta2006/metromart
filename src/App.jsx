import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "./contract";

function App() {
  const [products, setProducts] = useState([]);
  const [account, setAccount] = useState(null);

  const fetchProducts = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      console.log("Connected account:", accounts[0]);
      setAccount(accounts[0]);

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      console.log("Contract connected:", contract);

      const productData = []; // ✅ Fixed: Use an array instead of an object

      for (let i = 1; i <= 10; i++) {
        const product = await contract.getProductDetails(ethers.toBigInt(i));

        console.log(`Product ${i}:`, product); // Debugging

        productData.push({
          id: i,
          name: product[0],
          price: ethers.formatEther(product[1].toString()), // Ensure it's formatted correctly
          isBought: product[2],
        });
      }

      setProducts(productData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Product Store</h1>
      <p>Connected Account: {account ? account : "Not connected"}</p>
      <div>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id}>
              <h2>{product.name}</h2>
              <p>Price: {product.price} ETH</p>
              <p>Status: {product.isBought ? "Sold Out" : "Available"}</p>
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </div>
  );
}

export default App;
