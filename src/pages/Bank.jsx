import React from 'react';
import { useNavigate } from 'react-router-dom';
import './bankCss.css';

const Bank = () => {
  const navigate = useNavigate();

  const handleScannerClick = () => {
    navigate('/scanner'); 
  };

  return (
    <div>
      <div className="main_container">
        <div className="scanner_box" onClick={handleScannerClick} >
            
        </div>
      </div>

      <div className="home2_image"></div>
      <div className="home3_image"></div>
    </div>
  );
};

export default Bank;
