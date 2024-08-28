"use client";

import { useEffect, useState } from 'react';

const useExamTimer = (duration: number, courseCode: string | null) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!courseCode) return;

    const storedStartTime = localStorage.getItem(`startTime_${courseCode}`);
    const currentTime = new Date().getTime();

    if (storedStartTime) {
      const elapsedTime = Math.floor((currentTime - parseInt(storedStartTime)) / 1000);
      const remainingTime = duration * 60 - elapsedTime;
      setTimeLeft(remainingTime > 0 ? remainingTime : 0);
    } else {
      const startTime = new Date().getTime();
      localStorage.setItem(`startTime_${courseCode}`, startTime.toString());
      setTimeLeft(duration * 60);
    }
  }, [duration, courseCode]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return timeLeft;
};

export default useExamTimer;
