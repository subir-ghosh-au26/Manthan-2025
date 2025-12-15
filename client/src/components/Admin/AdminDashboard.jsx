import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import {
  Download,
  Lock,
  LogOut,
  QrCode,
  LayoutDashboard,
  TrendingUp,
  PieChart as PieIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import QRCodeGenerator from "./QRCodeGenerator";
import styles from "../DelegateForm/DelegateForm.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// --- STYLES ---
const adminStyles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    background: "rgba(255, 255, 255, 0.9)",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    textAlign: "center",
  },
  statValue: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1e3a8a",
    margin: "5px 0",
    fontFamily: '"Playfair Display", serif',
  },
  statLabel: {
    color: "#64748b",
    fontSize: "0.9rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  chartContainer: {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    height: "400px",
    display: "flex",
    flexDirection: "column",
  },
  chartTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "24px",
    marginBottom: "30px",
  },
};

// Colors for Pie Chart
const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#f97316", "#ef4444"]; // Green, Blue, Yellow, Orange, Red

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState({ averages: [], sentiment: [] });
  const [showQR, setShowQR] = useState(false);

  // --- LOGIN ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "Manthan@17") {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert("Invalid PIN");
    }
  };

  // --- DATA FETCHING & PROCESSING ---
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/feedback`);
      const rawData = response.data;
      setData(rawData);
      processMetrics(rawData);
    } catch (error) {
      console.error("Fetch error", error);
    }
  };

  const processMetrics = (rawData) => {
    if (rawData.length === 0) return;

    // 1. Calculate Averages for Bar Chart
    const categories = ["food", "stay", "conference", "campus", "activities"];
    const averages = categories.map((cat) => {
      const sum = rawData.reduce((acc, curr) => acc + curr[cat], 0);
      return {
        name: cat.charAt(0).toUpperCase() + cat.slice(1), // Capitalize
        score: (sum / rawData.length).toFixed(1),
      };
    });

    // 2. Calculate Sentiment (Pie Chart) - Count all stars across all categories
    let starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    rawData.forEach((item) => {
      categories.forEach((cat) => {
        starCounts[item[cat]] += 1;
      });
    });

    const sentimentData = [
      { name: "Exceptional (5★)", value: starCounts[5] },
      { name: "Excellent (4★)", value: starCounts[4] },
      { name: "Good (3★)", value: starCounts[3] },
      { name: "Fair (2★)", value: starCounts[2] },
      { name: "Poor (1★)", value: starCounts[1] },
    ].filter((item) => item.value > 0); // Hide empty slices

    setMetrics({ averages, sentiment: sentimentData });
  };

  // --- EXCEL EXPORT ---
  const downloadExcel = () => {
    const formattedData = data.map((item) => ({
      Date: new Date(item.submittedAt).toLocaleString(),
      Dining: item.food,
      Stay: item.stay,
      Conference: item.conference,
      Campus: item.campus,
      Activity: item.activities,
      Comments: item.comments || "N/A",
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback_Report");
    XLSX.writeFile(workbook, "Feedback_Report.xlsx");
  };

  // --- RENDER: LOGIN ---
  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <motion.div
          className={styles.card}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          style={{ maxWidth: "400px", textAlign: "center", padding: "40px" }}
        >
          <Lock size={48} color="#1e3a8a" style={{ marginBottom: "20px" }} />
          <h2
            className={styles.title}
            style={{ fontSize: "1.8rem", color: "#0f172a" }}
          >
            Admin Panel
          </h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter PIN"
              className={styles.textArea}
              style={{
                minHeight: "50px",
                margin: "20px 0",
                textAlign: "center",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className={styles.button}>
              Access Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- RENDER: DASHBOARD ---
  return (
    <div
      className={styles.container}
      style={{ alignItems: "flex-start", paddingBottom: "50px" }}
    >
      <div style={{ width: "100%", maxWidth: "1200px" }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            color: "white",
          }}
        >
          <div>
            <h1
              className={styles.title}
              style={{
                fontSize: "2.2rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Analytics Overview
            </h1>
            <p className={styles.subtitle}>Real-time feedback insights</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={downloadExcel}
              className={styles.button}
              style={{
                margin: 0,
                width: "auto",
                padding: "12px 24px",
                background: "#10b981",
              }}
            >
              <Download size={18} /> Export Excel
            </button>
            <button
              onClick={() => setShowQR(!showQR)}
              className={styles.button}
              style={{
                margin: 0,
                width: "auto",
                padding: "12px 24px",
                background: "#3b82f6",
              }}
            >
              <QrCode size={18} /> {showQR ? "Hide QR" : "Show QR"}
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className={styles.button}
              style={{
                margin: 0,
                width: "auto",
                padding: "12px",
                background: "rgba(255,255,255,0.2)",
              }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
        {showQR && (
          <div style={{ marginBottom: "40px" }}>
            <QRCodeGenerator />
          </div>
        )}

        {/* 1. KPI CARDS */}
        <div style={adminStyles.grid}>
          {metrics.averages.map((item, index) => (
            <motion.div
              key={index}
              style={adminStyles.statCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div style={adminStyles.statLabel}>{item.name}</div>
              <div style={adminStyles.statValue}>{item.score}</div>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                Average Rating
              </div>
            </motion.div>
          ))}
          <motion.div
            style={adminStyles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div style={adminStyles.statLabel}>Total Responses</div>
            <div style={adminStyles.statValue}>{data.length}</div>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              Submissions
            </div>
          </motion.div>
        </div>

        {/* 2. CHARTS SECTION */}
        <div style={adminStyles.chartsRow}>
          {/* BAR CHART: Category Comparison */}
          <div style={adminStyles.chartContainer}>
            <div style={adminStyles.chartTitle}>
              <TrendingUp size={20} /> Category Performance
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.averages}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="score"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART: Overall Sentiment */}
          <div style={adminStyles.chartContainer}>
            <div style={adminStyles.chartTitle}>
              <PieIcon size={20} /> Overall Rating Distribution
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.sentiment}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {metrics.sentiment.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. RECENT FEEDBACK LIST (Simplified Table) */}
        <div style={adminStyles.chartContainer}>
          <div style={adminStyles.chartTitle}>
            <LayoutDashboard size={20} /> Recent Comments
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {[...data]
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .slice(0, 5)
      .map((item, i) => (
              <div
                key={i}
                style={{ padding: "15px 0", borderBottom: "1px solid #e2e8f0" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                  }}
                >
                  <span style={{ fontWeight: "600", color: "#1e293b" }}>
                    {new Date(item.submittedAt).toLocaleDateString()}{" "}
                    {new Date(item.submittedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {/* <span style={{ fontSize: '0.85rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px' }}>
                    Food: {item.food}★ | Stay: {item.stay}★ | Conf: {item.conference}★ | Campus: {item.campus}★ | Activity: {item.activities}★
                  </span> */}
                </div>
                <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem" }}>
                  {item.comments ? (
                    `"${item.comments}"`
                  ) : (
                    <span style={{ fontStyle: "italic", opacity: 0.5 }}>
                      No comments provided
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
