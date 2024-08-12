'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

interface Student {
  name: string;
  matricNo: string;
  faceImage: string;
}

const ViewFace = () => {
  const searchParams = useSearchParams();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const studentId = searchParams.get('id');
    console.log('Student ID:', studentId);  // For debugging

    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/students/${studentId}`);
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    if (studentId) {
      fetchStudentDetails();
    }
  }, [searchParams]);

  return (
    <div>
      <h1>Student Details</h1>
      {student ? (
        <div>
          <p>Name: {student.name}</p>
          <p>Matric No: {student.matricNo}</p>
          {student.faceImage && (
            <img 
              src={`http://localhost:3000/${student.faceImage}`} 
              alt="Face" 
              style={{ marginTop: '20px', maxWidth: '100%', height: 'auto' }} 
            />
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ViewFace;
