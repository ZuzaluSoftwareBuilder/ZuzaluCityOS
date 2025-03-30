'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';

const Header = () => {
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/10 bg-[#2C2C2C]/60 px-5 py-1.5 backdrop-blur-2xl">
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => router.push('/spaces')}
          className="flex items-center gap-1.5 rounded-lg bg-[#2C2C2C] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3C3C3C]"
        >
          <ChevronLeftIcon className="h-5 w-5" />
         <div className='mobile:hidden'>Back</div>
        </button>
        <h1 className="text-lg font-bold text-white">Create a Community</h1>
      </div>
    </div>
  );
};

export default Header;
