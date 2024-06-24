import React from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import PublicSpace from "../../components/PublicSpace/PublicSpace"; 
import "./PublicSpacePage.css"


const PublicSpacePage = ({ slideIn, handleSlideIn }) => {
  return (
    <div className="public-space-container">
      <LeftSidebar slideIn={slideIn} handleSlideIn={handleSlideIn} />
      <div className="public-space">
        <PublicSpace />
      </div>
    </div>
  );
};

export default PublicSpacePage;
