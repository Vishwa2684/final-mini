import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const VideoFeed = () => {
    const [ip, setIp] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [rawCountsHistory, setRawCountsHistory] = useState([]);
    const [aggregatedCounts, setAggregatedCounts] = useState([]);
    const [interval, setIntervalTime] = useState(1000); // Default 1 second

    useEffect(() => {
        if (videoUrl) {
            const intervalId = setInterval(() => {
                fetchCounts();
            }, 1000); // Always fetch every second

            return () => clearInterval(intervalId);
        }
    }, [videoUrl]);

    // Effect to aggregate data when interval or raw data changes
    useEffect(() => {
        aggregateData();
    }, [interval, rawCountsHistory]);

    const fetchCounts = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/counts");
            const data = await response.json();
            setRawCountsHistory(prevData => {
                // Keep last 3600 seconds (1 hour) of data
                const newData = [...prevData, ...data];
                return newData.slice(-3600);
            });
        } catch (error) {
            console.error("Error fetching counts:", error);
        }
    };

    const aggregateData = () => {
        if (rawCountsHistory.length === 0) return;

        const intervalInSeconds = interval / 1000;
        const groups = {};
        
        rawCountsHistory.forEach(item => {
            const timeGroup = Math.floor(item.time / intervalInSeconds) * intervalInSeconds;
            if (!groups[timeGroup]) {
                groups[timeGroup] = {
                    counts: [],
                    time: timeGroup
                };
            }
            groups[timeGroup].counts.push(item.count);
        });

        const aggregated = Object.values(groups).map(group => ({
            time: group.time,
            count: Math.round(group.counts.reduce((a, b) => a + b, 0) / group.counts.length)
        }));

        setAggregatedCounts(aggregated.slice(-60)); // Keep last 60 data points
    };

    const chartData = {
        labels: aggregatedCounts.map(item => new Date(item.time * 1000).toLocaleTimeString()),
        datasets: [
            {
                label: `Average Count (${interval/1000}s intervals)`,
                data: aggregatedCounts.map(item => item.count),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    const handleFetchVideo = () => {
        if (ip.trim() === "") {
            alert("Please enter a valid IP address.");
            return;
        }
        setVideoUrl(`http://127.0.0.1:5000/video_feed?ip=${ip}`);
    };

    return (
        <div className="p-5">
            <div>
                <input
                    type="text"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    className="mb-2 p-2 border rounded"
                    placeholder="Enter IP address"
                />
                <button 
                    onClick={handleFetchVideo}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Fetch Video
                </button>
            </div>

            {videoUrl && (
                <>
                    <div className="mt-4">
                        <img
                            src={videoUrl}
                            alt="Live Video Feed"
                            className="max-h-[400px] border"
                        />
                    </div>

                    <div className="mt-4">
                        <select
                            value={interval}
                            onChange={(e) => setIntervalTime(Number(e.target.value))}
                            className="p-2 border rounded"
                        >
                            <option value={1000}>1 Second</option>
                            <option value={5000}>5 Seconds</option>
                            <option value={60000}>1 Minute</option>
                            <option value={300000}>5 Minutes</option>
                            <option value={600000}>10 Minutes</option>
                            <option value={3600000}>1 Hour</option>
                        </select>
                    </div>

                    <div className="mt-4" style={{ height: "400px" }}>
                        <h3>Count History</h3>
                        {aggregatedCounts.length > 0 ? (
                            <Bar data={chartData} options={options} />
                        ) : (
                            <p>No data available</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default VideoFeed;