"use client";

import React from 'react';
import Widjets from '../components/Widjets';

export default function page() {
  return (
    <div className='w-full h-full flex bg-[#f8faf9]'>
    <div className="flex w-full gap-2">
        <Widjets/>
    </div>
</div>
  )
}
