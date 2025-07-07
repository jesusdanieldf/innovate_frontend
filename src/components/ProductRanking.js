import React, { useState, useEffect } from "react";
import axios from "axios";

function ProductRanking() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products/ranking")
      .then((response) => {
        // Limiting to the top 10 products
        setRanking(response.data.slice(0, 10));
      })
      .catch((error) => {
        console.error("Error fetching product ranking:", error);
      });
  }, []);

  const getMedalIcon = (index) => {
    if (index === 0) return <i className="bi bi-trophy-fill" style={{ color: "gold" }}></i>; // Gold trophy for 1st place
    if (index === 1) return <i className="bi bi-trophy-fill" style={{ color: "silver" }}></i>; // Silver trophy for 2nd place
    if (index === 2) return <i className="bi bi-trophy-fill" style={{ color: "#cd7f32" }}></i>; // Bronze trophy for 3rd place
    return null; // No trophy for positions beyond the top 3
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Top Selling Products Ranking</h1>
      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th> {/* Ranking column */}
            <th>Product</th>
            <th>Total Sold</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((product, index) => (
            <tr key={product.productId}>
              <td>
                {index + 1} {/* Display the ranking number starting from 1 */}
                {getMedalIcon(index)} {/* Show medal icon next to the ranking */}
              </td>
              <td>{product.productName}</td>
              <td>{product.totalSold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductRanking;
