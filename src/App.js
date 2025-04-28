import React, { useEffect } from "react";
import "./App.css";
// import { LLHugMainComponent } from "@livelike/tf1-components";
import { useLiveLikeInit } from "./useLivelike.ts";
import LocationComponent from "./LocationComponent";
// import LocationComponent from "./CameraComponent.js";
function App() {
  const clientId = "jpyNYfoE7c1HLLa7gCydApSlh6k1vigaNbne7Key";
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
      <LocationComponent />
    </div>
  );
}

export default App;
