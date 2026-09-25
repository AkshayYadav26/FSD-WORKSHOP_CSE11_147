import React, { useState } from "react";

function ApiTester() {
  const [url, setUrl] = useState("");   // user input URL
  const [method, setMethod] = useState("GET"); // default method
  const [result, setResult] = useState(null);

  const handleRequest = async () => {
    if (!url) {
      setResult({ message: "Please enter a URL" });
      return;
    }

    let options = { method };

    // Example body for POST/PUT
    if (method === "POST" || method === "PUT") {
      options = {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Test User", email: "test@gmail.com" }),
      };
    }

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error:", err);
      setResult({ message: "Error connecting to backend" });
    }
  };

  return (
    <div>
      <h1>API Tester WebPage</h1>

      {/* Input box for URL */}
      <input
        type="text"
        placeholder="Enter backend URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "400px" }}
      />

      {/* Dropdown for method */}
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>

      <button onClick={handleRequest}>Send Request</button>

      {/* Show result */}
      <pre>{result ? JSON.stringify(result, null, 2) : "No response yet"}</pre>
    </div>
  );
}

export default ApiTester;
