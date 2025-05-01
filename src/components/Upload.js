import React, { useState } from "react";
import "./Upload.css";

const Upload = () => {
  const [dragging, setDragging] = useState(false);
  const [image, setImage] = useState(null); // State for storing the uploaded image
  const [uploaded, setUploaded] = useState(false); // State to track if an image has been uploaded
  const [breedInfo, setBreedInfo] = useState(null); // State to store breed prediction results

  const handleFileUpload = async (event) => {
    console.log("came");

    const file = event.target.files[0];
    console.log(file);

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl); // Set the image URL for preview
      setUploaded(true); // Mark as uploaded
      await sendImageToBackend(file); // Send the image to the backend
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setDragging(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const imageUrl = URL.createObjectURL(files[0]);
      setImage(imageUrl);
      setUploaded(true);
      await sendImageToBackend(files[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const sendImageToBackend = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://nithin521-soil-classifier-2.hf.space/predict", {
        method: "POST",
        body: formData,
        cors: "cors",
        headers: {
          Accept: "application/json",
        },
      });

      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch soil information");
      }
      const data = await response.json();
      console.log(data);
      setBreedInfo(data); // Store the soil prediction results
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to get soil information. Please try again.");
    }
  };

  return (
    <div
      className={`upload ${dragging ? "dragging" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      id="upload"
    >
      <h2>{uploaded ? "Upload more images" : "Upload Your Image"}</h2>
      <input
        type="file"
        onChange={handleFileUpload}
        style={{ display: "none" }} // Hide the default file input
        id="fileInput"
      />
      <label htmlFor="fileInput" className="uploadButton">
        Upload Image
      </label>
      <div className="drop-area">
        <p>
          {uploaded
            ? "Drag and drop more images here"
            : "Drag and drop your image here"}
        </p>
      </div>
      {image && (
        <img
          src={image}
          alt="Uploaded Preview"
          style={{ marginTop: "20px", maxWidth: "350px", height: "350px" }}
        />
      )}
      {breedInfo && console.log(breedInfo.score)}
      {breedInfo && breedInfo.recommendations && (
        <div>
          <h3>
            Prediction Results: <span>{breedInfo.soil_type}</span>
          </h3>
          {Object.values(breedInfo.recommendations).map(
            (recommendation, index) => (
              <div key={index}>
                {" "}
                {/* It's important to have a unique 'key' prop when mapping */}
                <h5>{recommendation}</h5>
              </div>
            )
          )}
        </div>
      )}
      {/* {breedInfo && <div className="breed-info">{breedInfo.soil_type}</div>} */}
    </div>
  );
};

export default Upload;
