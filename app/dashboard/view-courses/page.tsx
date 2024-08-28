"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '@/app/context/userContext';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface Course {
  title: string;
  code: string;
  examStatus?: boolean;  // Optional status for exam availability
  examType?: string;     // Optional type for the exam
}

export default function Page() {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const studentId = user?.id;
  const router = useRouter();


  

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!studentId) {
        toast.error('Student ID not found');
        return; 
      }

      setLoading(true);

      try {
        const response = await axios.get(`http://localhost:3000/api/info/${studentId}/enrolled-courses`);
        const courses = response.data;
        console.log('Courses loaded successfully:', courses);

        // Fetch exam details for each course
        const coursesWithExamStatus = await Promise.all(courses.map(async (course: Course) => {
            try {
              const examResponse = await axios.get(`http://localhost:3000/api/mcq/${course.code}`);
              const examData = examResponse.data;
              console.log('Exam data for course:', course.code, examData);
              let codei = course.code;
              // Assuming status is a boolean indicating the exam's availability
              return { 
                ...course, 
                examStatus: examData.status ?? false, // Use `?? false` to ensure a default value of false if status is undefined
                examType: examData.type ?? null // Same for examType
              };
            } catch (examErr: any) {
              console.error('Error fetching exam status:', examErr);
              return { ...course, examStatus: false, examType: null };  // Default to false/null on error
            }
          }));
          
        setEnrolledCourses(coursesWithExamStatus);
      } catch (err: any) {
        toast.error('Failed to fetch enrolled courses');
        console.error('Error fetching enrolled courses:', err);
      } finally {
        setLoading(false);  // Indicate loading is complete
      }
    };

    if (studentId) {  // Check if studentId is available before fetching
      fetchEnrolledCourses();
    }
  }, [studentId]);  // Depend on studentId to trigger the effect when it changes

  const startExam = (courseCode: string) => {
    // Encode courseCode to ensure proper URL format
    const encodedCourseCode = encodeURIComponent(courseCode.trim());
    router.push(`/exam?courseCode=${encodedCourseCode}`);
  };

  if (loading) {
    return <div className='text-blue-400'>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Enrolled Courses</h1>
      {enrolledCourses.length > 0 ? (
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className='bg-white'>
              <th className="p-3 px-4 border-b text-left">Course title</th>
              <th className="p-3 px-4 border-b text-left">Course code</th>
              <th className="p-3 px-4 border-b text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {enrolledCourses.map((course) => (
              <tr key={course.code}>
                <td className="p-3 px-4 border-b">{course.title}</td>
                <td className="p-3 px-4 border-b">{course.code}</td>
                <td className="p-3 px-4 border-b">
                  <button 
                    onClick={() => startExam(course.code)} 
                    className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${!course.examStatus  ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!course.examStatus}  // Disable button if examStatus is false or exam has already been submitted
                  >
                    Start Exam
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No enrolled courses found.</p>
      )}
    </div>
  );
}
