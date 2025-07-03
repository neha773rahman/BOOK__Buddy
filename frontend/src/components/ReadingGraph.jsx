import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const ReadingGraph = ({ bookId }) => {
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/books/${bookId}/progress-history/`)
      .then(res => {
        const formatted = res.data.map(entry => ({
          date: new Date(entry.updated_at).toLocaleDateString(),
          percent: entry.percent_completed
        }));
        setProgressData(formatted);
      });
  }, [bookId]);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h4>📊 Reading Progress Over Time</h4>
      {progressData.length > 0 ? (
        <ResponsiveContainer>
          <LineChart data={progressData}>
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="percent" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No progress data available.</p>
      )}
    </div>
  );
};

export default ReadingGraph;
