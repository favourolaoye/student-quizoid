'use client';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const Page = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve token from localStorage
    const storedToken = Cookies.get("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.error('No token found in localStorage');
    }

    // Access webcam
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error('Error accessing webcam:', err);
        });
    }
  }, []);

  const captureFace = async () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const image = canvasRef.current.toDataURL('image/jpeg');
        verifyFace(image);
      }
    }
  };

  const verifyFace = async (imageData: string) => {
    try {
      if (!token) {
        toast.info("pls relogin");
        throw new Error('Token is missing');
      }

      const response = await fetch('http://localhost:3000/api/students/verify-face', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ image: imageData }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('API response error:', result);
        throw new Error(result.message || 'Face verification failed');
      }

      if (result.success) {
        alert('Face verified successfully!');
        toast.success("verified");
        router.push('/dashboard');
      } else {
        toast.error('Face verification failed. Please try again.');
      }
    } catch (error: any) {
      toast.error('Error during face verification'c);
      console.error("error");
    }
  };

  return (
    <div>
      <h1>Face Verification</h1>
      <video ref={videoRef} width="640" height="480" autoPlay></video>
      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>
      <button onClick={captureFace} className='bg-black text-white p-3'>Capture and Verify Face</button>
    </div>
  );
};

export default Page;
