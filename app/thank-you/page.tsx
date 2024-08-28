"use client";

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    // Set the timeout for redirection (e.g., 5 seconds)
    const timer = setTimeout(() => {
      router.push('/auth')
    }, 5000) // 5000ms = 5 seconds

    // Clear the timeout if the component is unmounted before the timeout completes
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className='flex flex-col items-center justify-center w-full h-full p-8 bg-gray-100'>
      <h2 className='text-2xl font-semibold mb-4'>Exam Submitted!</h2>
      <p className='text-blue-500 underline'>
        <Link href="/auth">Login</Link>
      </p>
    </div>
  )
}
