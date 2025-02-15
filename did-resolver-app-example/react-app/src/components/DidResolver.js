import React, { useState } from "react";
import { resolve } from "web-did-resolver"; // Import resolver

const DidResolver = () => {
  const [did, setDid] = useState("");
  const [resolvedData, setResolvedData] = useState(null);
  const [error, setError] = useState("");

  const handleResolve = async () => {
    try {
      setError("");
      const result = await resolve(did); // Call resolver
      setResolvedData(result);
    } catch (err) {
      setError("Failed to resolve DID. Check if it's valid.");
    }
  };

  return (
    <div className="container">
      <h2>🔗 Web DID Resolver</h2>
      <input
        type="text"
        placeholder="Enter a DID (e.g., did:web:example.com)"
        value={did}
        onChange={(e) => setDid(e.target.value)}
      />
      <button onClick={handleResolve}>Resolve DID</button>

      {error && <p className="error">{error}</p>}
      {resolvedData && (
        <pre className="result">
          {JSON.stringify(resolvedData, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default DidResolver;
