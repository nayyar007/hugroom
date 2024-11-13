import React from "react";
import "./App.css";
// import { LLHugMainComponent } from "@livelike/tf1-components";
import { useLiveLikeInit } from "./useLivelike.ts";

function App() {
  const clientId = "jpyNYfoE7c1HLLa7gCydApSlh6k1vigaNbne7Key";
  const { isLoading, userProfile } = useLiveLikeInit({
    clientId: clientId,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!userProfile) {
    return <p>Error In Loading livelike...</p>;
  }

  return (
    <div className="App">
      <iframe
        src="https://tgl-dev.livelikeapp.com/"
        className="tgl-iframe"
      ></iframe>
    </div>
  );
}

export default App;
