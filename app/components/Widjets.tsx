import Link from 'next/link'
import React from 'react'
import { useContent } from  '@/app/context/contextContext';


export default function Widjets() {

    const { setContent } = useContent();

    const Widjets = [
        {label:'Enroll Courses', desc:'Enroll for courses.', ref:'/dashboard/manage-courses', set:'Enroll courses'},
        {label:'View courses', desc:'View your enrolled courses.', ref:'/dashboard/view-courses', set:'Courses enrolled'},
    ]

  return (
    <div className=''>
        <ul className="grid grid-cols-1 gap-8 text-gray-600 sm:md:grid-cols-2 md:grid-cols-3">
            {Widjets.map((wid,id)=>(
                <Link href={wid.ref} key={id}>
                    <li onClick={()=>setContent(wid.set)} className="flex flex-col gap-4 bg-white rounded-xl w-full p-8 hover:scale-95 hover:border-t-4 hover:border-green-600">
                        <h2 className='font-medium text-xl'>{wid.label}</h2>
                        <p>{wid.desc}</p>
                    </li>
                </Link>
            ))}
        </ul>
    </div>
  )
}