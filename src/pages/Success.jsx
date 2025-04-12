
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Success.css';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import SuccessAudio from '../assets/audio/success_final_a.mp3';
import { Share2 } from 'lucide-react';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const amountInput = location.state?.amountInput;
  const banking_name = location.state?.banking_name;

  const [moveUp, setMoveUp] = useState(false);
  const [successVid, setSuccessVid] = useState('');
  const [addedsuccessVid, setAddedSuccessVid] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [transaction_id, setTransactionID] = useState('504980959412');
  const [paymentTime, setPaymentTime] = useState('');
  const [onSuccessWindow, setOnSuccessWindow] = useState(false);

  const [showDetails, setShowDetails] = useState(false); // ⬅️ ADDED

  const handleDone = () => {
    navigate('/');
  }

  const GetVideo = async () => {
    try {
      const res = await fetch(
        'https://lottie.host/fc5081aa-982a-485d-a6b1-2f5aafeb407e/ixBHyon6J5.lottie'
      );

      if (!res.ok) {
        throw new Error('Failed to fetch video');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      console.log('Fetched finally');
      setSuccessVid(url);

      const now = new Date();
      const formatted = now.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      setPaymentTime(formatted);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  useEffect(() => {
    GetVideo();
  }, []);

  useEffect(() => {
    if (!successVid || onSuccessWindow) return;

    setAddedSuccessVid(successVid);
    setTransactionID(
      Math.floor(100000000000 + Math.random() * 900000000000)
    );
    
    const audioTimeout = setTimeout(() => {
      const audio = new Audio(SuccessAudio);
      audio.play();
    }, 7000);
    
    const moveUpTimeout = setTimeout(() => {
      
      setMoveUp(true);
    }, 10000);

    return () => {
      clearTimeout(audioTimeout);
      clearTimeout(moveUpTimeout);
    };
  }, [successVid]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (successVid) {
        setIsLoading(false);
        setOnSuccessWindow(true);

        setTimeout(() => {
          setShowDetails(true); // ⬅️ TRIGGER SHOW AFTER 1s
        }, 1500);
      }
    }, 7000);

    return () => clearTimeout(timer);
  }, [successVid]);

  if (isLoading) {
    return (
      <div className="loader-screen">
        <div className="spinner"></div>
        <p className="loading-text">Paying {banking_name ? banking_name : "Ramesh Kumar"} ₹{amountInput ? amountInput : 100}</p>
      </div>
    );
  }

  return (
    <div className="success_container">
      <div className="empty_container_above_success"></div>

      <div className={`${moveUp ? 'move-up' : ''}`}>
        <p className={`lottie-wrapper ${moveUp ? 'move-up_success_logo' : ''}`}>
          <DotLottieReact src={addedsuccessVid} autoplay />
        </p>

          {showDetails && ( // ⬅️ CONDITIONAL DISPLAY + ANIMATION
        <div className="success_data success_details_fade">
          <p className="success_amount">
            ₹{amountInput ? amountInput : 100}.00
          </p>
          <p className="success_user_name">Paid to {banking_name ? banking_name : " Ramesh Kumar"}</p>

          <div className="empty_space_success"></div>

            <div className="success_details_fade">
              <p className="success_time">{paymentTime}</p>
              <p className="success_transaction_id">UPI transaction ID: {transaction_id}</p>
            </div>
           </div>
          )}
      </div>

      <div className="success_footer">
        <button className="success_btn_share_ss">
          <Share2 size={16} style={{ marginRight: '8px' }} />
          Share screenshot
        </button>
        <button className="success_btn_done" onClick={handleDone}>Done</button>
      </div>
    </div>
  );
};

export default Success;
