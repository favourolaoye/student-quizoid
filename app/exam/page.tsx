"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import TextEditor from ".."; // Assuming TextEditor is your rich text editor component for theory answers
import useFullScreen from "../hooks/useFullScreen";
import useExamTimer from "../hooks/useExamTimer";
import { useUser } from "../context/userContext";
import Cookies from "js-cookie";

// Types for questions
type MultipleChoiceQuestion = {
  question: string;
  options: string[];
  correctOption: string;
  score: number;
};

type TheoryQuestion = {
  question: string;
};

type Question = MultipleChoiceQuestion | TheoryQuestion;

interface ExamDetails {
  instruction: string;
  duration: number;
  type: "multichoice" | "theory";
  questions: Question[];
  lecturerID: string
}

const ExamPage: React.FC = () => {
  const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  const router = useRouter();
  const { user } = useUser();
  const matricNo = user?.details?.matricNo;
  // const department = user?.details?.department;
  const searchParams = useSearchParams();
  const courseCode = searchParams.get("courseCode");

  useFullScreen();

  useEffect(() => {
    const checker = Cookies.get('check');
    if (checker === 'submitted') {
      router.back();
    }
  }, []);

  useEffect(() => {
    console.log("Exam Details on Fetch:", examDetails);
  }, [examDetails]);
  

  useEffect(() => {
    console.log("Fetched Exam Details:", examDetails);
  }, [examDetails]);

  const timeLeft = useExamTimer(examDetails?.duration || 0, courseCode);

  useEffect(() => {
    const fetchExamDetails = async () => {
      if (!courseCode) {
        toast.error("Course code not found");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/api/mcq/${courseCode}`
        );
        if (response.data.status === false) {
          toast.error(response.data.message || "Exam not found");
        } else {
          setExamDetails(response.data);
        }
      } catch (err) {
        toast.error("Failed to load exam details");
        console.error("Error loading exam details:", err);
      }
    };

    fetchExamDetails();
  }, [courseCode]);

  useEffect(() => {
    if (timeLeft === 0 && examDetails) {
      // Add a delay before submitting the exam
      const delay = setTimeout(() => {
        submitExam();
      }, 5000); // Delay of 1 second (1000 milliseconds)
  
   
      return () => clearTimeout(delay);
    }
  }, [timeLeft, examDetails]);
  
  

  const handleAnswerChange = (questionIndex: number, answer: string | number) => {
    console.log('Question Index:', questionIndex);
    console.log('Selected Answer:', answer);
  
    // Update the answers state with the selected answer
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer.toString(), // Convert the answer to a string
    }));
  
    if (typeof answer === 'number') {
      // Only update the score for multiple-choice questions
      updateScore(questionIndex, answer);
    }
  };
  
  
  
  

  const updateScore = (questionIndex: number, answerIndex: number) => {
    if (!examDetails) return;
  
    const question = examDetails.questions[questionIndex];
    let newScore = 0;
  
    if (examDetails.type === 'multichoice' && question && 'correctOption' in question) {
      const mcq = question as MultipleChoiceQuestion;
      const correctOptionIndex = parseInt(mcq.correctOption); // Convert correctOption to number
  
      if (answerIndex === correctOptionIndex) {
        newScore = mcq.score;
      }
    }
  
    setScore((prevScore) => {
      const currentAnswerIndex = parseInt(answers[questionIndex] || "-1"); // Default to -1 if not set
      const mcq = question as MultipleChoiceQuestion;
      const correctOptionIndex = parseInt(mcq.correctOption);
  
      const isAnswerCorrect = currentAnswerIndex === correctOptionIndex;
      // console.log('Previous Score:', prevScore);
      // console.log('Current Answer Index:', currentAnswerIndex);
      // console.log('Correct Option Index:', correctOptionIndex);
      // console.log('New Score for this question:', newScore);
      // console.log('Is the answer correct:', isAnswerCorrect);
  
      if (isAnswerCorrect) {
        return prevScore - mcq.score + newScore;
      } else {
        return prevScore + newScore;
      }
    });
  };
  
  

  const submitExam = async () => {
    if (!courseCode || !matricNo || !examDetails) return;
  
    // Ask for confirmation before submitting
    const isConfirmed = window.confirm("Are you sure you want to submit the exam?");
    if (!isConfirmed) {
      return; // Exit if the user cancels the submission
    }
  
    try {
      const payload = {
        matricNo,
        courseCode,
        lecturerID: examDetails.lecturerID, // Include the lecturerID
      };
  
      if (examDetails.type === "multichoice") {
        await axios.post("http://localhost:3000/api/submit/submit-objective", {
          ...payload,
          totalMark: score,
        });
      } else if (examDetails.type === "theory") {
        await axios.post("http://localhost:3000/api/submit/submit-theory", {
          ...payload,
          answers,
        });
      }
  
      // Cookies.set('check', courseCode , {
      //   expires: 1,
      //   path: '/',
      //   sameSite: 'Strict',
      // });
      toast.success('Exam submitted successfully');
      router.push('/thank-you');
    } catch (err: any) {
      toast.error("Failed to submit exam");
      console.error("Error submitting exam:", err);
    }
  };
  
  

  const nextQuestion = () => {
    if (currentQuestionIndex < (examDetails?.questions.length ?? 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (!examDetails) {
    return <div className="text-blue-400 text-2xl">Loading...</div>;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const currentQuestion = examDetails.questions[currentQuestionIndex];

  return (
    <div>
      <ToastContainer />
      <div className="mt-10">
        <h1 className="text-center text-lg font-bold mb-4">
          Instruction: {examDetails.instruction}
        </h1>
        <div className="mb-4">
          <p className="text-center text-red-500 text-xl">
            Time Remaining: {minutes} mins:{" "}
            {seconds < 10 ? `0${seconds}` : seconds} secs
          </p>
        </div>

        {examDetails.type === "multichoice" ? (
          <>
           <div className="mt-8 text-lg">
              <h2 className="font-bold ml-10">Question {currentQuestionIndex + 1}</h2>
              <p className="mt-4 ml-10">{currentQuestion.question}</p>
              <div className="flex flex-col mt-2 ml-10">
                {(currentQuestion as MultipleChoiceQuestion).options.map((option, index) => (
                  <label key={index} className="mt-2">
                    <input
                      type="radio"
                      name={`answer-${currentQuestionIndex}`} // Unique name per question
                      value={index}  // Use the index of the option as value
                      checked={parseInt(answers[currentQuestionIndex] || "-1") === index} // Check based on index
                      onChange={() => handleAnswerChange(currentQuestionIndex, index)}  // Pass index instead of option
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

          </>
        ) : (
          <>
            <div className="mt-8 p-5 text-lg">
              <h2 className="font-bold">Question {currentQuestionIndex + 1}</h2>
              <p className="mt-4 text-black">{currentQuestion.question}</p>
              <TextEditor
                value={answers[currentQuestionIndex] || ""}
                onChange={(value) =>
                  handleAnswerChange(currentQuestionIndex, value)
                }
              />
            </div>
          </>
        )}

        <div className="mt-8 p-3 flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Previous
          </button>
          <button
            onClick={nextQuestion}
            disabled={
              currentQuestionIndex === (examDetails.questions.length ?? 0) - 1
            }
            className="p-3 bg-blue-500 text-white rounded"
          >
            Next
          </button>
        </div>

        {currentQuestionIndex === (examDetails.questions.length ?? 0) - 1 && (
          <div className="mt-8">
            <button
              onClick={submitExam}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Submit Exam
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamPage;
