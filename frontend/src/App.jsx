import React, { useState } from "react";
import CropSelector from "./components/CropSelector";
import ImageUploader from "./components/ImageUploader";
import DetectButton from "./components/DetectButton";
import ResultDisplay from "./components/ResultDisplay";
import LocationSelector from "./components/LocationSelector";
import logo from "./assets/pisheti_logo.png"; // Adjust path if needed
import bgImage from './assets/pexels-jplenio-1574547.jpg'; // Adjust path if needed
import LanguageDropdown from "./components/DropDown";

// Import Google Fonts (Inter)
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const App = () => {
  const [selectedCrop, setSelectedCrop] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ state: "", district: "" });
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleLocationSelect = (state, district) => {
    setLocation({ state, district });
  };
  // Handle disease detection
  const handleDetectDisease = async () => {
    if (!selectedCrop || !image || !location.state || !location.district) {
      alert("Please select a crop and upload an image or check your location.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("crop", selectedCrop);
    formData.append("state", location.state);  
    formData.append("district", location.district);
    formData.append("language", selectedLanguage); // Pass the selected language
    try {
      const response = await fetch("http://localhost:8000/api/predict/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error detecting disease:", error);
      alert("Error processing image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative bg-fixed"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Header and Logo */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mb-6">
        <div className="flex items-center gap-4 w-full justify-center md:justify-start">
          <img
            src={logo}
            alt="Logo"
            className="w-20 h-14 md:w-28 md:h-20 drop-shadow-lg rounded-xl bg-white/80 p-1"
          />
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg tracking-tight">
            Crop Disease Detection & Remedies
          </h1>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-10 w-full max-w-lg flex flex-col gap-6 border border-white/30 transition-all duration-300">
        {/* Language Dropdown */}
        <LanguageDropdown
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
        {/* Location Selector */}
        <LocationSelector onLocationSelect={handleLocationSelect} />
        {/* Display Selected Location */}
        {location.state && location.district && (
          <div className="mb-2 p-3 bg-blue-50/80 shadow rounded-lg text-center w-full">
            <h2 className="text-base font-semibold text-blue-900">📍 Selected Location</h2>
            <p className="text-blue-700 font-bold">{location.state}, {location.district}</p>
          </div>
        )}
        <CropSelector selectedCrop={selectedCrop} setSelectedCrop={setSelectedCrop} />
        <ImageUploader setImage={setImage} setPreview={setPreview} preview={preview} />
        <DetectButton onClick={handleDetectDisease} loading={loading} />
        <ResultDisplay result={result} />
      </div>

      {/* Footer (optional) */}
      <div className="relative z-10 mt-8 text-white/80 text-xs text-center">
        &copy; {new Date().getFullYear()} Crop Disease Detection. All rights reserved.
      </div>
    </div>
  );
};

export default App;
