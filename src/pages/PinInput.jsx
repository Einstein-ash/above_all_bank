
import React, { useEffect, useState } from 'react';
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
  const [showPinError, setShowPinError] = useState(false);

  const handleNumpadClick = (val) => {

    setShowPinError(false);
    // if (navigator.vibrate) navigator.vibrate(10); // 10ms light vibration

    if (val === 'X') {
      setPin((prev) => prev.slice(0, -1));
    } else if (val === '✔') {
      // Optional: handle PIN submission
    } else if (pin.length < 6 && typeof val === 'number') {
      setPin((prev) => [...prev, val]);
    }

  };

  const handlePinSubmit = () => {

    if(pin.length < 6 ){
      setShowPinError(true);
      return ;
    }
    else {
      navigate('/success', {
        state : {
          amountInput,
          banking_name,
        }
      }); 
    }
  };

  const handlePinCross = () => {
    setPin((prev) => prev.slice(0, -1));
  }


  useEffect(() => {

    if(!showPinError && navigator.vibrate) {
        navigator.vibrate(40);
    }
  }, [showPinError]);

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
          <p className="recipient">{banking_name ? banking_name : 'Ramesh Kumar'}</p>
          <p className="amount">₹ {amountInput ? amountInput : 100}.00</p>
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
        <p className='pinInput_warning_name'>{banking_name ? banking_name : 'Ramesh Kumar'}</p>
          </p>
      </div>

     

      {showNumpad && (
        <div className='numpad_wrapper'>

              {showPinError && (
                <div className='pin_error_container'>
                  <p className='pin_error_text'>Please enter 6 digit UPI PIN</p>
                  <button 
                    className='btn_pin_error' 
                    onClick={() => setShowPinError(false)}>
                      DISMISS
                  </button>

                </div>
              )}

          <div className="numpad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'x', 0, '✔'].map((val, idx) => (
              <button
                key={idx}
                className="num-btn"
                onClick={() => {
                  if (val === '✔') {
                    handlePinSubmit();
                  } else if(val === 'x') {
                    handlePinCross();
                  }
                  else {
                    handleNumpadClick(val);
                  }
                }}
              >
          
                {val === '✔' ? (
                  <>
                    <p className="pinInput_tick_img"></p> 
                    
                  </>
                ) : val === 'x' ? (
                  <>
                    <p className="pinInput_corss_img" ></p> 
                  </>
                ) : (
                  val
                )}
              </button>
            ))}
          </div>

          </div>
      )}
    </div>
  );
};

export default PinEntryScreen;
