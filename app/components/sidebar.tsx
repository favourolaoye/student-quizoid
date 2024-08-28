import Link from 'next/link'
import React from 'react'
import { CiSettings } from 'react-icons/ci'
import { FaHome } from 'react-icons/fa'
import { FaListCheck } from 'react-icons/fa6'
import { MdGroups, MdScoreboard } from 'react-icons/md'
import { RiLogoutBoxLine, RiQuestionAnswerLine, RiSettingsLine } from 'react-icons/ri'
import { useContent } from '@/app/context/contextContext';
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/context/userContext'
import { toast } from 'react-toastify'

export default function Sidebar() {

    const { content, setContent } = useContent();
    const { logout } = useUser();
    const router = useRouter();

    const navs = [
        {id:0, label:'Dashboard', icon:<FaHome/>, ref:'/dashboard'},
        {id:1, label:'Add Courses', icon:<FaListCheck/>, ref:'/dashboard/manage-courses'},
        {id:2, label:'Courses', icon:<FaListCheck/>, ref:'/dashboard/view-courses'}
    ];

    const handleSignOut = () =>{
        toast.success('You have signed out sucessfully');
        router.push('/auth');
        logout();
        console.log('You have signed out chief');
    }
    
  return (
    <div className='w-3/12 bg-white h-screen'>
        <div className="flex flex-col justify-between h-full p-8">
            <div className="flex flex-col gap-6">
                <h2 className='font-bold text-xl text-green-600 '>Student Dashboard</h2>
                <ul className="flex flex-col text-gray-400">
                    {navs.map((nav,id) => (
                        <Link href={nav.ref} key={id}>
                            <li onClick={()=>setContent(nav.label)} className={`${content === nav.label ? 'bg-green-50 border-l-4 border-green-600' : ''} flex items-center p-4 gap-4 hover:bg-green-50`}>
                                <i className='text-[17px] text-green-600'>{nav.icon}</i>
                                <h2 className={`${content === nav.label ? 'font-medium text-gray-700':'text-gray-500'}`}>{nav.label}</h2>
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>
            <ul className="flex flex-col text-gray-400">
                {/* <Link href="/dashboard">
                    <li onClick={()=>setContent('Settings')} className={`${content === 'Settings' ? 'bg-green-50 border-l-4 border-green-600 text-gray-700' : ''} flex items-center p-4 gap-4 hover:bg-green-50`}>
                        <i className='text-[17px] text-green-600'><CiSettings/></i>
                        <h2 className={`${content === 'Settings' ? 'font-medium text-gray-700':'text-gray-500'}`}>Settings</h2>
                    </li>
                </Link> */}
                <li className={'flex text-red-500 items-center p-4 gap-4 hover:bg-green-50'} onClick={handleSignOut}>
                    <i className='text-[17px]'><RiLogoutBoxLine/></i>
                    <h2 className="">Logout</h2>
                </li>
            </ul>
        </div>
    </div>
  )
}
