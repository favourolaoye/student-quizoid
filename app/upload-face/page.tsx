'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

const UploadFace = () => {
  const [faceImages, setFaceImages] = useState<File[]>([]);
  const [message, setMessage] = useState('');
  const [extractedToken, setExtractedToken] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setExtractedToken(token);
    }
  }, [searchParams]);

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFaceImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (faceImages.length === 0) {
      setMessage('Please select images.');
      return;
    }
  
    const formData = new FormData();
    faceImages.forEach((image) => {
      formData.append('faceImages', image); 
    });
  
    try {
      const response = await axios.post(`http://localhost:3000/api/students/upload-face/${extractedToken}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      const studentId = response.data.studentId; // Assuming your response contains studentId
      setMessage('Face images uploaded successfully');
      router.push(`/view-face?id=${studentId}`);
    } catch (error: any) {
      setMessage('Error uploading face images');
    }
  };
  

  return (
    <div>
      <h1>Upload Face Images</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" multiple onChange={handleFileChange} required />
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default UploadFace;
