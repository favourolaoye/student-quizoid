"use client";

import { useState, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

const VerifyFace = () => {
  const [message, setMessage] = useState('');
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();

  const handleCapture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      setMessage('Could not capture image.');
      return;
    }

    const blob = await fetch(imageSrc).then(res => res.blob());
    const formData = new FormData();
    formData.append('file', blob, 'face.jpg');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('No token found. Please log in again.');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const studentId = payload.user.details.matricNo;

      const response = await axios.post(`http://localhost:3000/api/students/verify/${studentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.message === 'Face verified successfully') {
        setMessage('Face verified successfully');
        router.push('/dashboard'); // Redirect to the student dashboard or desired page
      } else {
        setMessage('Face verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setMessage('Verification error');
    }
  };

  return (
    <div>
      <h1>Verify Face</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={350}
      />
      <button onClick={handleCapture}>Capture and Verify</button>
      <p>{message}</p>
    </div>
  );
};

export default VerifyFace;
