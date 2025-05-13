import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";
import BarGraph from "../Visualization/BarGraph.jsx";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/food/list");
        if (response.data.success) {
          const foodItems = response.data.data;

          const lowStock = foodItems.filter(
            (food) => food.quantity <= 5
          ).length;
          const outOfStock = foodItems.filter(
            (food) => food.quantity === 0
          ).length;

          setLowStockCount(lowStock);
          setOutOfStockCount(outOfStock);
        } else {
          setError("Failed to fetch food items");
        }
      } catch (error) {
        console.error("Error fetching food items:", error);
        setError("Something went wrong while fetching food items");
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/order");
        if (response.data.success) {
          const orders = response.data.orders;
          const totalSales = orders.reduce(
            (acc, order) => acc + order.amount,
            0
          );
          setSalesCount(totalSales);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Something went wrong while fetching orders");
      } finally {
        setLoading(false);
      }
    };

    const fetchChartData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/food/list");
        const allItems = response.data.data;

        const provinceCategoryData = allItems.reduce((acc, item) => {
          const province = item.category || "Unknown";
          const category = item.foodCategory || "Other";

          if (!acc[province]) {
            acc[province] = {};
          }

          if (!acc[province][category]) {
            acc[province][category] = 0;
          }

          acc[province][category] += 1;

          return acc;
        }, {});

        const formattedData = Object.keys(provinceCategoryData).map(
          (province) => ({
            province,
            ...provinceCategoryData[province],
          })
        );

        setChartData(formattedData);
        setCategories(
          Object.keys(
            allItems.reduce((acc, item) => {
              acc[item.foodCategory || "Other"] = true;
              return acc;
            }, {})
          )
        );
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setError("Something went wrong while fetching chart data");
      }
    };

    fetchFoods();
    fetchOrders();
    fetchChartData();
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="matrix-container">
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        <Link to={"/list"} className="card">
          <h2>Low Stock Items</h2>
          <p>{lowStockCount}</p>
        </Link>

        <Link to={"/list"} className="card">
          <h2>Out of Stock Items</h2>
          <p>{outOfStockCount}</p>
        </Link>

        <div className="card">
          <h2>Total Sales Amount</h2>
          <p>Rs. {salesCount.toFixed(2)}</p>
        </div>

        <div className="card">
          <h2>Total Customers</h2>
          <p>50</p>
        </div>
      </div>
      <div className="bar-chart-container">
        <BarGraph data={chartData} categories={categories} />
      </div>
    </div>
  );
};

export default Dashboard;
