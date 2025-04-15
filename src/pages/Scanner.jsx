
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import { MdImage } from "react-icons/md"; 
import { IoMdClose } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaQrcode } from "react-icons/fa";
import { PiFlashlightBold } from "react-icons/pi";
// import axios from "axios";



import './scannerCss.css';


const Scanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [qrResult, setQrResult] = useState('');
  const [scanning, setScanning] = useState(false);
  const [videoReady, setVideoReady] = useState(false);


  const [torchOn, setTorchOn] = useState(false);
  const trackRef = useRef(null);



//   const addBook = async ( bookName, userName, userUPI ) => {
//     try {
//         const response = await fetch(`https://get-your-book.vercel.app/books/`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({  bookName, userName, userUPI  }),
//         });

//         const data = await response.text(); // or .json() if your server returns JSON
//         console.log("Book added:", data);
//     } catch (error) {
//         console.error("Error adding book:", error);
//     }
// };




// const uploadImageToCloudinary = async (file) => {
//   if (!file) return null;

//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("upload_preset", "code_rq"); 
//   formData.append("folder", "Codes RQ");

//   try {
//     const response = await axios.post(
//       "https://api.cloudinary.com/v1_1/dlkd2qsml/image/upload",
//       formData
//     );
//     return response.data.secure_url;
//   } catch (err) {
//     console.error("Cloudinary Upload Error:", err);
//     return null;
//   }
// };



  const scanFrame = async () => {


    

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    if (!canvas || !video || scanning) return; // ✅ Prevent double scan

    // const context = canvas.getContext('2d');
    const context = canvas.getContext('2d', { willReadFrequently: true });

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    // const originalCanvas = canvas;

    const brightness = getAverageBrightness(imageData);

    if (brightness < 20 && !torchOn) {
      toggleFlashlight(); // turn ON
    } else if (brightness >= 40 && torchOn) {
      toggleFlashlight(); // turn OFF
    }
    
    
    // making a copy to save to the cloud 
        const originalCanvasCopy = document.createElement('canvas');
        originalCanvasCopy.width = canvas.width;
        originalCanvasCopy.height = canvas.height;
        originalCanvasCopy.getContext('2d').drawImage(canvas, 0, 0);


    // Scan original
    try {
      // const result = await QrScanner.scanImage(imageData);
      const { data: result } = await QrScanner.scanImage(imageData, { returnDetailedScanResult: true });

      // handleResult(result, canvas);
        handleResult(result, originalCanvasCopy);    // if send from here  , then send only hte original image

      return;
    } catch (e) {
      // ignore and try inverted
      // console.log("not good for original -----------");

    }
    // Invert and scan


      const invertedCanvasCopy = document.createElement('canvas');
      invertedCanvasCopy.width = originalCanvasCopy.width;
      invertedCanvasCopy.height = originalCanvasCopy.height;
      invertedCanvasCopy.getContext('2d').drawImage(originalCanvasCopy, 0, 0);

      const invertedCtx = invertedCanvasCopy.getContext('2d');
      const invertedImageData = invertedCtx.getImageData(0, 0, invertedCanvasCopy.width, invertedCanvasCopy.height);

      invertImage(invertedImageData);
      invertedCtx.putImageData(invertedImageData, 0, 0);

      context.drawImage(invertedCanvasCopy, 0, 0);


  
      // invertImage(imageData);   // good working----------
      // invertImage(CopyfromOriginalCanvasCopy);

      // context.putImageData(imageData, 0, 0);    // good working----------
      try {
        // const result = await QrScanner.scanImage(canvas);
        const { data: result } = await QrScanner.scanImage(canvas, { returnDetailedScanResult: true });

        // handleResult(result, canvas);
       handleResult(result, originalCanvasCopy, canvas);    /// if send using the inverted one, then send both original and inverted boht 
        
      } catch (e) {
        // No result
      }

  };





  const handleResult = async (result, capCanvas, invertedCanvas = null ) => {

    if (!result || scanning) return;

    if (result && !scanning) {
      if (navigator.vibrate) {
        navigator.vibrate(40);
      }
  
      setTorchOn(false); 
      
      if (trackRef.current) {
        try {
          await trackRef.current.applyConstraints({
            advanced: [{ torch: false }],
          });
        } catch (err) {
          console.warn("Failed to turn off torch:", err);
        }
      }
  
      // setScanning(false);
      // addBook(result);

      setTimeout(async () => {
  
        navigate('/payment', {
          state: {
             qrText: result,
             capturedCanvas: capCanvas.toDataURL("image/png"), 
             invertedCapturedCanvas : invertedCanvas ? invertedCanvas.toDataURL("image/png") : null 
             }
        });
      }, 1000);
    }
  };
  



  const getAverageBrightness = (imageData) => {
    const data = imageData.data;
    let total = 0;
    for (let i = 0; i < data.length; i += 4) {
      // RGB values, ignore alpha (data[i+3])
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
  
      // Luminance formula (perceived brightness)
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      total += brightness;
    }
    return total / (data.length / 4);
  };

  const invertImage = (imageData) => {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];     // R
      data[i + 1] = 255 - data[i + 1]; // G
      data[i + 2] = 255 - data[i + 2]; // B
    }
  };






  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const interval = setInterval(scanFrame, 700); // scan every 700ms

        return () => clearInterval(interval);
      } catch (error) {
        console.error('Camera error:', error);
        alert('Please allow camera access.');
      }
    };

    startCamera();
  }, []);



  const toggleFlashlight = async () => {
    try {
      if (!trackRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();

        if (!capabilities.torch) {
          alert("Flashlight not supported on this device.");
          return;
        }

        trackRef.current = track;
      }

      setTorchOn(prev => {
        const newState = !prev;
        trackRef.current.applyConstraints({
          advanced: [{ torch: newState }],
        });
        return newState;
      });
    } catch (error) {
      console.error("Flashlight toggle failed:", error);
      alert("Unable to access flashlight.");
    }
  };


  const handleCloseScanner = () => {
    navigate('/');
  }



  return (
    <div className="main_scanner_container">

    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      onCanPlay={() => setVideoReady(true)}
      className="full_screen_video"
    />

{!videoReady && <div className="video-black-overlay"></div>}


      <canvas ref={canvasRef} style={{ display: 'none' }} />


      <div className='scanner_header'>
            <div className="top-nav-bar">
            <IoMdClose className="nav-icon" onClick={handleCloseScanner} />
            <div className="nav-right-icons">
          
                  <PiFlashlightBold  color = {torchOn ? "#000" : "#fff" }className={ ` nav-icon ${torchOn ? 'scanner_torch_on' : ''} `} onClick={toggleFlashlight} />


      
              <FaQrcode className="nav-icon" />
              <BsThreeDotsVertical className="nav-icon" />
            </div>
          </div>
      </div>



      <div className="scanner_black_shadow_up_left"></div>

      <div className="scanner_black_shadow_middle_border">

              <div className="scanner-box">
                <div className="corner top-left" />
                <div className="corner top-right" />
                <div className="corner bottom-left" />
                <div className="corner bottom-right" />
              </div>
        
        </div> 

          <button className="scanner_upload_btn">
            <MdImage className="scanner_upload_icon" />
            Upload from gallery
          </button> 

      <div className='scanner_footer'>
        <p className='scanner_footer_dash'></p>

        <p>Scan any QR code to pay</p>
        <p>Google Pay . PhonePe . Paytm . UPI</p>
      </div>

    </div>
  );
};

export default Scanner;










// upi://pay?pa=9871359433@upi&pn=ANSH%20SON%20OF%20MANGAL%20SINGH&cu=INR&mode=02&purpose=00&orgid=189999&sign=u2zNq6LaRzo6shvxLVdcJBqyk/HBdk610SwOVfHlOQ03eX+8PqQjSLMy6btnwZDaBn0r8LXdA3uzxaLPwuOZeANQ00DaaNoszJGUOH2LOJsSy9cmczMB4fXYDD2lZpRK4TP440IlzO6QvfSIAwdxkigFHSb3U+JCmYkyhpeXYdM=