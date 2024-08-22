
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from "@/app/context/userContext";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Quizoid",
  description: "E Examinations system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          {children}
        </UserProvider>
        <ToastContainer/> 
      </body>
    </html>
  );
}
