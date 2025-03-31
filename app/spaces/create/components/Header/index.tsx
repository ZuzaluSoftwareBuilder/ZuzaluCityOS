'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { CaretLeft } from '@phosphor-icons/react';

const Header = () => {
  const router = useRouter();

  return (
    <div className="sticky top-[50px] tablet:top-[0px] mobile:top-[0px] z-50 w-full border-b border-white/10 bg-[#2C2C2C]/60 px-5 py-1.5 backdrop-blur-2xl">
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => router.push('/spaces')}
          className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white transition-colors"
        >
          <CaretLeft size={20} className="h-5 w-5" />
         <div className='mobile:hidden'>Back</div>
        </button>
        <h1 className="text-lg font-bold text-white">Create a Community</h1>
      </div>
    </div>
  );
};

export default Header;
