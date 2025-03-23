import React from "react";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { id } = useParams(); // Get product ID from URL

  return (
    <div>
      <h1>Product Details</h1>
      <p>You are viewing product {id}</p>
    </div>
  );
};

export default ProductPage;
