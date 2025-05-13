import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ListOrder.css";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import TopSoldItemsPieChart from "../../Visualization/TopSoldItemsPieChart.jsx";

const ListOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const navigate = useNavigate();

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/order");
        if (response.data.success) {
          setOrders(response.data.orders);
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

    fetchOrders();
  }, []);

  // Filter orders by search term and date range
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.date);
    const isWithinDateRange =
      (!startDate || orderDate >= new Date(startDate)) &&
      (!endDate || orderDate <= new Date(endDate));

    return (
      order.userId &&
      order.userId.name &&
      order.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      isWithinDateRange
    );
  });

  // Get top 4 most sold items for the pie chart
  const getTopSoldItems = () => {
    const itemCount = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        itemCount[item.name] = (itemCount[item.name] || 0) + item.quantity;
      });
    });

    return Object.entries(itemCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([name, quantity]) => ({ name, quantity }));
  };

  const topSoldItems = getTopSoldItems();

  // Handle order deletion
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/order/delete/${orderToDelete}`);
      setOrders(orders.filter((order) => order._id !== orderToDelete));
      toast.success("Order removed");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error removing order");
    } finally {
      setShowDeleteModal(false);
      setOrderToDelete(null);
    }
  };

  // Open delete confirmation modal
  const handleDeleteClick = (orderId) => {
    setOrderToDelete(orderId);
    setShowDeleteModal(true);
  };

  // Navigate to edit order page
  const handleEdit = (id) => {
    navigate(`/edit/order/${id}`);
  };

  // Generate PDF Report
  const generatePDFReport = () => {
    const pieChart = document.querySelector(".pie-chart-container");

    html2canvas(pieChart).then((canvas) => {
      const chartImage = canvas.toDataURL("image/png");
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(`Order List Report (${startDate} to ${endDate})`, doc.internal.pageSize.getWidth() / 2, 15, null, null, "center");

      doc.setFontSize(14);
      doc.text("Summary", 20, 30);
      const totalOrders = filteredOrders.length;
      const totalAmount = filteredOrders.reduce((acc, order) => acc + order.amount, 0);
      doc.text(`Total Orders: ${totalOrders}`, 20, 40);
      doc.text(`Total Amount: Rs ${totalAmount}.00`, 20, 50);

      doc.addImage(chartImage, "PNG", 35, 60, 180, 100);

      const tableData = filteredOrders.map((order) => [
        order._id,
        order.userId.name,
        `Rs ${order.amount}.00`,
        order.status,
        new Date(order.date).toLocaleString(),
      ]);

      doc.autoTable({
        head: [["Order ID", "User Name", "Amount", "Status", "Date"]],
        body: tableData,
        startY: 170,
      });

      doc.save("order_report.pdf");
    });
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="list-container">
      <TopSoldItemsPieChart topSoldItems={topSoldItems} />
      <hr className="separator" />
      <div className="list-header">
        <h2>All Orders</h2>
        <input
          type="search"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>
      <div className="date-filter">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="date-input" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="date-input" />
      </div>
      <table className="list-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User Name</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="6">No orders found</td>
            </tr>
          ) : (
            filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.userId.name}</td>
                <td>Rs {order.amount}.00</td>
                <td>{order.status}</td>
                <td>{new Date(order.date).toLocaleString()}</td>
                <td>
                <button className="edit-btn" onClick={() => handleEdit(order._id)}>Edit</button>
<button className="delete-btn" onClick={() => handleDeleteClick(order._id)}>Delete</button>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this order?</p>
            <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
            <button onClick={handleDelete}>Confirm</button>
          </div>
        </div>
      )}
      <button className="generate-pdf-btn" onClick={generatePDFReport}>Generate PDF Report</button>
    </div>
  );
};

export default ListOrder;
