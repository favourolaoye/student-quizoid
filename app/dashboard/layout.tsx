"use client";

import { ContentProvider } from "@/app/context/contextContext";
import Sidebar from "@/app/components/sidebar";
import { useUser } from "@/app/context/userContext";
import { ReactNode } from "react";

export default function Layout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {

    const { user } = useUser();
    return (
        <html lang="en">
            
            <body className='w-full h-full'>
                <ContentProvider>
                    <div className='w-full h-full flex bg-[#f8faf9]'>
                        <div className="flex w-full gap-2">
                            <Sidebar />
                            <div className='w-9/12 flex flex-col'>
                                <div className="flex flex-col bg-white rounded-xl w-full p-4 sticky top-0">
                                    <div className="flex flex-col w-fit self-end bg-white text-gray-500">
                                        <h2 className='font-semibold text-black'>Welcome back,<span> {user?.name}</span></h2>
                                        <span className='text-sm text-gray-500'>Matric number: {user?.details.matricNo}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col p-8">
                                    {children}
                                </div>
                            </div>
                        </div>            
                    </div>
                </ContentProvider>
            </body>
        </html>
    );
}
