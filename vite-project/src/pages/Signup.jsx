import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate

const Signup = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? "/signup" : "/login";
    try {
      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      setMessage(result.message);

      if (response.ok && !isSignup) {
        // Redirect to LiveFeed page if login is successful
        navigate('/LiveFeed');
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setFormData({ email: "", password: "" }); // Clear form fields when toggling
    setMessage(""); // Clear any previous messages
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h1>{isSignup ? "Signup" : "Login"}</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", marginTop: "10px" }}>
          {isSignup ? "Signup" : "Login"}
        </button>
      </form>
      <p style={{ marginTop: "20px" }}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          onClick={toggleForm}
          style={{
            color: "blue",
            textDecoration: "underline",
            background: "none",
            border: "none",
          }}
        >
          {isSignup ? "Login" : "Signup"}
        </button>
      </p>
      {message && (
        <p
          style={{
            marginTop: "10px",
            color: message.includes("error") ? "red" : "green",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Signup;
