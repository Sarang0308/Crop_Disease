import React, { useState } from "react";
import CropSelector from "./components/CropSelector";
import ImageUploader from "./components/ImageUploader";
import DetectButton from "./components/DetectButton";
import ResultDisplay from "./components/ResultDisplay";
import LocationSelector from "./components/LocationSelector";
import logo from "./assets/pisheti_logo.png"; // Adjust path if needed

import bgImage from './assets/bg5.avif';
import LanguageDropdown from "./components/DropDown";



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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-500 to-green-400" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      
      <img 
       src={logo} 
       alt="Logo" 
       className="max-w-[150px] max-h-[90px] absolute top-5 left-5"
      />


      <h1 className="text-4xl font-bold text-orange-950 mb-3 drop-shadow-lg animate-bounce">
         Crop Disease Detection & Remedies 
      </h1>
      
      {/* Your other form fields */}
      <LanguageDropdown
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
      
      {/* Location Selector */}
      <LocationSelector onLocationSelect={handleLocationSelect} />
      
      {/* Display Selected Location */}
      {location.state && location.district && (
        <div className="mb-4 p-4 bg-white shadow rounded-lg text-center w-full max-w-md">
          <h2 className="text-lg font-semibold">📍 Selected Location</h2>
          <p className="text-blue-600 font-bold">{location.state}, {location.district}</p>
        </div>
      )}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg ">
        <CropSelector selectedCrop={selectedCrop} setSelectedCrop={setSelectedCrop} />
        <ImageUploader setImage={setImage} setPreview={setPreview} preview={preview} />
        <DetectButton onClick={handleDetectDisease} loading={loading} />
        <ResultDisplay result={result} />
         
      </div>
    </div>
  );
};

export default App;
