import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const ReadingGraph = ({ bookId }) => {
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/books/${bookId}/progress-history/`)
      .then(res => {
        console.log("📊 Progress Data:", res.data); // for debugging
        const formatted = res.data.map(entry => ({
          date: new Date(entry.updated_at).toLocaleDateString(),
          percent: entry.percent_completed
        }));
        setProgressData(formatted);
      })
      .catch(err => {
        console.error("❌ Error fetching graph data:", err);
      });
  }, [bookId]);

  return (
    <div style={{
      width: '100%',
      height: 350,
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '20px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
    }}>
      <h4 style={{ color: '#000', marginBottom: '15px' }}>📊 Reading Progress Over Time</h4>
      {progressData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={progressData}>
            <XAxis dataKey="date" stroke="#000" />
            <YAxis domain={[0, 100]} stroke="#000" />
            <Tooltip />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="percent" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ color: '#000' }}>No progress data available.</p>
      )}
    </div>
  );
};

export default ReadingGraph;
