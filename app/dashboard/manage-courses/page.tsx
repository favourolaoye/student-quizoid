"use client";
import { useUser } from '@/app/context/userContext';
import React, { useEffect, useState } from 'react';

export default function Page() {
    const { user } = useUser();
    const [courses, setCourses] = useState([]);
    const dept = user?.details?.department;
    const level = user?.details?.level;
    const studentId = user?.id;
    console.log(dept, level);

    useEffect(() => {
        const fetchCourses = async () => {
            if (dept && level) {
                try {
                    const response = await fetch(
                        `http://localhost:3000/api/info/courses?department=${dept}&level=${level}`
                    );
                    if (!response.ok) {
                        throw new Error('Failed to fetch courses');
                    }
                    const data = await response.json();
                    setCourses(data);
                    console.log(data);
                } catch (error: any) {
                    console.error('Error fetching courses:', error.message);
                }
            }
        };

        fetchCourses();
    }, [dept, level]); // Update dependencies to avoid unnecessary fetches

    const enrollCourse = async (courseCode: string) => {
        try {
            const response = await fetch('http://localhost:3000/api/info/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseCode, // Use 'code' instead of 'courseId'
                    studentId: studentId,
                }),
            });

            if (response.ok) {
                alert('Enrolled successfully!');
            } else {
                alert('Failed to enroll in course.');
            }
        } catch (error) {
            console.error('Error enrolling in course:', error);
        }
    };

    return (
        <div>
            <h2 className='text-bold text-xl mb-5 text-gray-600'>Enroll for courses</h2>
            <table className='min-w-full divide-y divide-gray-200'>
                <thead>
                    <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Course Name
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Course Unit
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Course Code
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                    {courses.map((course: any) => (
                        <tr key={course._id}>
                            <td className='px-6 py-4 whitespace-nowrap text-black'>{course.title}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-black'>{course.units}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-black'>{course.code}</td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <button
                                    className='text-indigo-600 hover:text-indigo-900'
                                    onClick={() => enrollCourse(course.code)}
                                >
                                    Add
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
