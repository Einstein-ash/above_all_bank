
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PinEntryScreen.css';

const PinEntryScreen = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const qrText = location.state?.qrText;
    const amountInput = location.state?.amountInput;
    const banking_name = location.state?.banking_name;

  const [pin, setPin] = useState([]);
  const [showNumpad, setShowNumpad] = useState(false);

  const handleNumpadClick = (val) => {

    // if (navigator.vibrate) navigator.vibrate(10); // 10ms light vibration

    if (val === 'X') {
      setPin((prev) => prev.slice(0, -1));
    } else if (val === '✔') {
      // Optional: handle PIN submission
    } else if (pin.length < 6 && typeof val === 'number') {
      setPin((prev) => [...prev, val]);
    }

  };

  const handlePinInput = () => {
    navigate('/success', {
      state : {
        amountInput,
        banking_name,
      }
    }); 
  };


  return (
    <div className="pin-screen">
      <div className="header">
        <div className="pin_input_bank_info">
          <p className='pin_input_bank_name'>State Bank of India</p>
          <p>XXXX4075</p>   
        </div>
        <p className='pin_input_upi_logo'></p>
      </div>

      <div className="send-info">
        <div className="left">
          <p className="label">To:</p>
          <p className="label">Sending:</p>
        </div>
        <div className="right">
          <p className="recipient">{banking_name}</p>
          <p className="amount">₹ {amountInput}.00</p>
        </div>
      </div>

      <div className="enter-pin">ENTER 6-DIGIT UPI PIN</div>

      <div className="pin-boxes" onClick={() => setShowNumpad(true)}>
        {Array(6).fill().map((_, idx) => (
          <div className="pin-box" key={idx}>
            {idx < pin.length ? '●' : <span className="pin-line"></span>}
          </div>
        ))}
      </div>

      <div className="warning_box">
        <span className="cicular_warning_avatar">!</span>
        <p>You are transferring money from your account to 
        <p className='pinInput_warning_name'>{banking_name}</p>
          </p>
      </div>

      {showNumpad && (
        <div className="numpad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'X', 0, '✔'].map((val, idx) => (
            <button
                key={idx}
                className={`num-btn ${val === '✔' ? 'submit' : ''}`}
                onClick={() => {
                  if (val === '✔') {
                    handlePinInput();
                  } else {
                    handleNumpadClick(val);
                  }
                }}
              >
                {val}
              </button>






          ))}
        </div>
      )}
    </div>
  );
};

export default PinEntryScreen;
