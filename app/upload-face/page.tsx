"use client"
import React, { useState } from 'react';
import axios from 'axios';

const Page = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  // Handle file selection
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files ? Array.from(event.target.files) : []);
  };

  // Handle form submission and file upload
  const onUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      setMessage('Please select at least one image.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('faceImages', file); // Ensure this key matches with backend
    });

    try {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get('token');

      if (!token) {
        throw new Error('Token is missing from URL.');
      }

      const response = await axios.post(`http://localhost:3000/api/students/upload-face?token=${token}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage(response.data.message || 'Images uploaded successfully.');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error uploading images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold text-center mb-6">Upload Your Face Images</h2>
      <form onSubmit={onUpload}>
        <input 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={onFileChange} 
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50"
        />

        <button
          type="submit"
          disabled={uploading}
          className={`w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Page;
