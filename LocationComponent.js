import React, { useState, useEffect, useRef } from "react";

const LocationComponent = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInRegion, setIsInRegion] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Target coordinates
  const targetLat = 30.903825140141603;
  const targetLng = 75.90097405628944;
  const radius = 20; // meters

  // Function to calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const checkRegion = (currentLat, currentLng) => {
    const distance = calculateDistance(
      currentLat,
      currentLng,
      targetLat,
      targetLng
    );
    setIsInRegion(distance <= radius);
    return distance;
  };

  const getLocation = () => {
    setIsLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLat = position.coords.latitude;
          const currentLng = position.coords.longitude;
          const distance = checkRegion(currentLat, currentLng);

          setLocation({
            latitude: currentLat,
            longitude: currentLng,
            accuracy: position.coords.accuracy,
            distance: distance,
          });
          setIsLoading(false);
        },
        (error) => {
          let errorMessage = "Error getting location: ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage +=
                "Please allow location access to use this feature.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "The request to get user location timed out.";
              break;
            default:
              errorMessage += "An unknown error occurred.";
          }
          setError(errorMessage);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera by default
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      setError("Error accessing camera: " + err.message);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  useEffect(() => {
    getLocation();
    return () => {
      closeCamera(); // Cleanup camera when component unmounts
    };
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Location Check</h2>

      {!location && !error && !isLoading && (
        <button onClick={getLocation} style={styles.button}>
          Check My Location
        </button>
      )}

      {isLoading && (
        <p style={styles.message}>
          Getting your location with high accuracy...
        </p>
      )}

      {error && (
        <div style={styles.error}>
          <p>{error}</p>
          <button onClick={getLocation} style={styles.button}>
            Try Again
          </button>
        </div>
      )}

      {location && (
        <div style={styles.locationInfo}>
          <h3>Your Location:</h3>
          <p>
            <strong>Latitude:</strong> {location.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {location.longitude}
          </p>
          <p>
            <strong>Accuracy:</strong> {location.accuracy} meters
          </p>
          <p>
            <strong>Distance from Target:</strong>{" "}
            {location.distance.toFixed(2)} meters
          </p>

          <div style={isInRegion ? styles.insideRegion : styles.outsideRegion}>
            <h3>{isInRegion ? "Inside Region ✅" : "Outside Region ❌"}</h3>
            <p>
              Target Region: 20 meters radius from ({targetLat}, {targetLng})
            </p>
          </div>

          {location.accuracy > 10 && (
            <p style={styles.warning}>
              Note: For better accuracy, try moving to an open area with clear
              sky view.
            </p>
          )}

          <div style={styles.buttonContainer}>
            <button
              onClick={isCameraOpen ? closeCamera : openCamera}
              style={styles.button}
            >
              {isCameraOpen ? "Close Camera" : "Open Camera"}
            </button>
            <a
              href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.mapLink}
            >
              View on Google Maps
            </a>
          </div>

          {isCameraOpen && (
            <div style={styles.cameraContainer}>
              <video ref={videoRef} autoPlay playsInline style={styles.video} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    color: "#333",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginRight: "10px",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "15px",
  },
  message: {
    color: "#666",
    fontStyle: "italic",
  },
  error: {
    color: "#d32f2f",
    padding: "10px",
    backgroundColor: "#ffebee",
    borderRadius: "4px",
    margin: "10px 0",
  },
  locationInfo: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  },
  insideRegion: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#e8f5e9",
    borderRadius: "4px",
    color: "#2e7d32",
  },
  outsideRegion: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#ffebee",
    borderRadius: "4px",
    color: "#c62828",
  },
  mapLink: {
    display: "inline-block",
    color: "#2196F3",
    textDecoration: "none",
  },
  warning: {
    color: "#f57c00",
    fontStyle: "italic",
    marginTop: "10px",
  },
  cameraContainer: {
    marginTop: "20px",
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  video: {
    width: "100%",
    height: "auto",
    display: "block",
  },
};

export default LocationComponent;
