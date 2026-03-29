import React, { useEffect } from "react";
import "./App.css";
import { useLiveLikeInit } from "./useLivelike.ts";
// import QRComponent from "./QRComponent";
function App() {
  const clientId = "q4p0w4FGx2gf0uGnqB6lB4bhrQcagfioJDsNDgs8";
  const { isLoading, userProfile } = useLiveLikeInit({
    clientId: clientId,
  });

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "success") {
        console.log("Iframe content changed:", event.data.message);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!userProfile) {
    return <p>Error In Loading livelike...</p>;
  }

  return (
    <div className="App">
      <iframe
        title="LiveLike Content"
        className="tgl-iframe"
        src="https://tgl-qa.livelikeapp.com/perfect-season.html?accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIzNjk4NWE2LTdkN2ItNGIzMy1hMjc3LTAwMjY5ZjdmNmZhNSIsImNsaWVudF9pZCI6Ik45dDRYd3lNMVZKRmtOV2tJZUZxcWNTSWNScDRkYjFNRVVhbmZ3R0EiLCJhY2Nlc3NfdG9rZW4iOiJjM2FkYjFlZjhkMDNjYWM3ODcwOGQ3MjdjZjg1NjNhNWQ0YmM1NjUyIiwiaXNzIjoiYmxhc3RydCIsImlhdCI6MTc2MjUyNTAwNn0.rGXfpBYeR9m_DKs6DQZnVV6l9jsH6dUfNheFaPAct90"
      />
    </div>
  );
}

export default App;
