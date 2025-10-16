import React from "react";
import "./PageLoader.css";

const PageLoader = () => {
  return (
    <div className="loader-container">
      <img
        src="/assets/dog-svgrepo-com.svg"
        alt="Cute dog loading"
        className="dog-image"
      />
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default PageLoader;
