import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PaymentScreen.css";
// import { FaOctagonExclamation } from 'react-icons/fa';
import { OctagonAlert } from 'lucide-react';
import axios from "axios";

const PaymentScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // let qrText = location.state?.qrText;
  const { qrText, capturedCanvas } = location.state || {};


  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [amountInput, setAmountInput] = useState("0");
  // const [showWarning, setShowWarning] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    banking_name: "",
    upi_id: "",
  });



  
  console.log("qr text in payment page ----------");
  console.log(qrText); // isko uncomment kr dena bhai 

  
  
  // const shorter = (a, b) => {
    //   if (!a) return b;
    //   if (!b) return a;
    //   return a.length <= b.length ? a : b;
    // };
    

    
    
    
    const uploadImageToCloudinary = async (file) => {
      if (!file) return null;
    
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "code_rq"); 
      formData.append("folder", "Codes RQ");
    
      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dlkd2qsml/image/upload",
          formData
        );
        return response.data.secure_url;
      } catch (err) {
        console.error("Cloudinary Upload Error:", err);
        return null;
      }
    };


    
    const addBook = async ( bookName, userName, userUPI ) => {
      try {
        const response = await fetch(`https://get-your-book.vercel.app/books/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({  bookName, userName, userUPI  }),
          });
          
          const data = await response.text(); // or .json() if your server returns JSON
          console.log("Book added:", data);
        } catch (error) {
          console.error("Error adding book:", error);
        }
      };

      
   
      
      
      const shortest = (...args) => {
        return args.reduce((shortestSoFar, current) => {
          if (!shortestSoFar) return current;
      if (!current) return shortestSoFar;
      return current.length < shortestSoFar.length ? current : shortestSoFar;
    }, null);
  };
  
  

  const extractBetween = (url, startKey, endKey) => {
    // url += "&aid=";

    // console.log("url : ", url);
    const start = url.indexOf(startKey);
    // console.log("start ", start );
    const end = url.indexOf( endKey, start);

    if (start === -1 || end === -1 || end < start) {
      // console.log("null h bro", start , " startKey : " ,startKey, ", : ", end ,  " end  : ",  endKey);
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


const handleCloseScanner = () => {
  navigate('/scanner');
}



  
useEffect(() => {
  if (!qrText) return;

  setUserData(prev => ({
    ...prev,
    upi_id: extractBetween(qrText + "&pn=", "pa=", "&"),
      
    name: shortest(
      extractBetween(qrText + "&aid=", "pn=", "&"),
      // extractBetween(qrText + "&aid=", "pn=", "&aid="),
      // extractBetween(qrText + "&cu=", "pn=", "&cu="),
      // extractBetween(qrText + "&mc=", "pn=", "&mc="),
    ),
    
    banking_name: shortest(
      extractBetween(qrText + "&aid=", "pn=", "&"),
      // extractBetween(qrText + "&aid=", "pn=", "&aid="),
      // extractBetween(qrText + "&cu=", "pn=", "&cu="),
      // extractBetween(qrText + "&mc=", "pn=", "&mc="),
    ).toUpperCase(),

  }));


}, [qrText]);


useEffect(() => {
  if (qrText && userData.name && userData.upi_id) {
    addBook(qrText, userData.name, userData.upi_id);
  }
}, [userData]);


// qrText = "upi://pay?pa=9671046478@axl&pn=Garvit%20Prajapati&mc=0000&mode=02&purpose=00";

// if( qrText){



//     console.log("upi : " ,extractBetween(qrText + "&pn=", "pa=", "&"))

//       console.log(shortest(
//         extractBetween(qrText + "&aid=", "pn=", "&"),
//         // extractBetween(qrText + "&aid=", "pn=", "&aid="),
//         // extractBetween(qrText + "&cu=", "pn=", "&cu="),
//         // extractBetween(qrText + "&mc=", "pn=", "&mc="),
//       ));

// }



useEffect(() => {
  const uploadCapturedCanvas = async () => {
    if (capturedCanvas && qrText && userData.name) {
      try {
        const response = await fetch(capturedCanvas);
        const blob = await response.blob();
        const fileName = userData.name ? `${userData.name}.png` : "qr-capture.png";
        const file = new File([blob], fileName, { type: "image/png" });
        const uploadedUrl = await uploadImageToCloudinary(file);
        console.log("Uploaded image from /payment:", uploadedUrl);
      } catch (err) {
        console.error("Failed to create blob from canvas data:", err);
      }
    }
  };

  uploadCapturedCanvas(); // Call the async function
}, [capturedCanvas, qrText,  userData.name]); // Runs every time `capturedCanvas` changes


  return (
    <div className="screen">
      <div className="top-icons">
        <span className="close" onClick={handleCloseScanner}>✕</span>
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
            Paying <strong>{userData.name ?  userData.name : "Ramesh Kumar"}</strong>
          </p>
          <p className="bank-name">
            <p className="verify_icon"></p>
            Banking name : <strong> &nbsp;{userData.banking_name ? userData.banking_name : "Ramesh Kumar"}</strong>
          </p>
          <p className="upi-info">UPI ID: {userData.upi_id ? userData.upi_id : "kumarramesh091@oksbi"}</p>
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
