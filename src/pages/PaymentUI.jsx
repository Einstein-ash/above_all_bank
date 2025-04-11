import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PaymentScreen.css";
// import { FaOctagonExclamation } from 'react-icons/fa';
import { OctagonAlert } from 'lucide-react';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const qrText = location.state?.qrText;


  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [amountInput, setAmountInput] = useState("0");
  // const [showWarning, setShowWarning] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    banking_name: "",
    upi_id: "",
  });



  
  console.log("qr text in payment page ----------");
  console.log(qrText);


  const shorter = (a, b) => {
    if (!a) return b;
    if (!b) return a;
    return a.length <= b.length ? a : b;
  };
  

  const extractBetween = (url, startKey, endKey) => {
    // url += "&aid=";
    const start = url.indexOf(startKey);
    const end = url.indexOf(endKey);

    if (start === -1 || end === -1 || end < start) {
      console.log("null h bro");
      return null;
    }

    let value = url.substring(start + startKey.length, end);
    value = value.replace(/%20/g, " ");
    return value;
  };


  const formatAmount = (numStr) => {
    const x = numStr.replace(/[^\d]/g, "").replace(/,/g, ""); // keep digits onlu
    if (x.length <= 3) return x;
    const lastThree = x.slice(-3);
    const rest = x.slice(0, -3);
    return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  };

  const handleInputChange = (e) => {
    let value = formatAmount(e.target.value);

    if (/^\d*$/.test(value)) {
      value = value.replace(/\D/g, "");
      value = value.replace(/^0+/, "");
      setAmountInput(value || "0");
    }

    setAmountInput(value);
  };

  const handlePayClick = () => {
    navigate("/enterPin" , {
      state: {
        amountInput,
        qrText,
        banking_name : userData.banking_name
      }
    });
  };

  const handleArrowClick = () => {
    setShowBottomSheet(true);
  };
// 


  
useEffect(() => {
  if (!qrText) return;

  setUserData(prev => ({
    ...prev,
    upi_id: extractBetween(qrText + "&aid=", "pay?pa=", "&pn="),
    name: shorter(
      extractBetween(qrText + "&aid=", "&pn=", "&aid="),
      extractBetween(qrText, "&pn=", "&mc=")
    ),
    banking_name: shorter(
      extractBetween(qrText + "&aid=", "&pn=", "&aid="),
      extractBetween(qrText, "&pn=", "&mc=")
    ).toUpperCase(),

  }));
}, [qrText]);

  return (
    <div className="screen">
      <div className="top-icons">
        <span className="close">✕</span>
        <span>
          <div className="exclamation">
            <OctagonAlert    />
          </div>
          <span>&nbsp; </span>
          <span className="dots">⋮</span>
        </span>
      </div>

      <div className="profile-section">
        <div className="avatar">{userData.name.charAt(0)}</div>
        <div className="name-info">
          <p className="paying-name">
            Paying <strong>{userData.name}</strong>
          </p>
          <p className="bank-name">
            <p className="verify_icon"></p>
            Banking name : <strong> &nbsp;{userData.banking_name}</strong>
          </p>
          <p className="upi-info">UPI ID: {userData.upi_id}</p>
        </div>
      </div>

      <div className="amount-section">
              <p className="currency">₹</p>


              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                className="amount-input"
                name="amount_input"
                value={formatAmount(amountInput)}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePayClick(); 
                  }
                }}
              />

        <div className="add-note">Add note</div>
      </div>

      <div className="bottom-arrow">
        <button className="arrow-button" onClick={handleArrowClick}>
          →
        </button>
      </div>

      {/* belos is code for payment bmouldule boi----------- */}
      {showBottomSheet && (
        <div className="bottom-sheet">
          <div className="account-option">
            <p className="choose-text">Choose account to pay with</p>
            <div className="account-card">
              <div className="sbi_logo"></div>
              <div className="payment_ui_bank_info">
                <p className="bank_name_bottom_module">
                  State Bank of India ••••9035
                </p>
                <p className="payment_ui_balance">
                  Balance: <span className="check_now_balance">Check now</span>{" "}
                </p>
              </div>
            </div>
            <button className="pay_button" onClick={handlePayClick}>
              Pay ₹ {amountInput}
            </button>
            <div className="bottom-logos">
              <p className="axis_logo"></p>
              <p className="vertical_line"></p>
              <p className="upi_logo"></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentScreen;
