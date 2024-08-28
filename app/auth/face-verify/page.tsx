'use client';

import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const Page = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const router = useRouter();

  useEffect(() => {
    // Retrieve token from cookies
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
    setIsLoading(true); // Start loading
    try {
      if (!token) {
        toast.info("Please relogin");
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
        toast.success("Face verified successfully!");
        Cookies.set("authkey", "face successful", { expires: 1, path: '/', sameSite: 'Strict' });
        router.push('/dashboard'); // Navigate only on success
      } else {
        toast.error('Face verification failed. Please try again.');
        setIsLoading(false); // Stop loading if verification fails
      }
    } catch (error: any) {
      toast.error('Error: No match');
      console.error('Error during face verification:', error);
      setIsLoading(false); // Stop loading on error
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Face Verification</h1>
      {isLoading ? (
        <div className="loading-indicator mb-4">
          <p>Verifying face, please wait...</p>
        </div>
      ) : (
        <>
          <div className="relative mb-4">
            <video
              ref={videoRef}
              width="640"
              height="480"
              autoPlay
              className="border border-gray-300 rounded-lg shadow-md"
            ></video>
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              style={{ display: 'none' }}
            ></canvas>
          </div>
          <button
            onClick={captureFace}
            className="bg-green-500 text-white p-4 rounded-sm shadow-md hover:bg-green-200 transition duration-300"
          >
            Capture and Verify Face
          </button>
        </>
      )}
    </div>
  );
};

export default Page;
