'use client';
import { CaretLeft } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();

  return (
    <div className="sticky top-[50px] z-50 w-full border-b border-white/10 bg-[#2C2C2C]/60 px-5 py-1.5 backdrop-blur-2xl tablet:top-0 mobile:top-0">
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => router.push('/spaces')}
          className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white transition-colors"
        >
          <CaretLeft size={20} className="size-5" />
          <div className="mobile:hidden">Back</div>
        </button>
        <h1 className="text-lg font-bold text-white">Create a Community</h1>
      </div>
    </div>
  );
};

export default Header;
