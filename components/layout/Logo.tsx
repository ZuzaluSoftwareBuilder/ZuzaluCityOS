'use client'

import React from 'react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';

const GreenBlurDataUrl = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNc/+mZKQAHnQK+h0UQYgAAAABJRU5ErkJggg==';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  const router = useRouter();

  return (
    <div className={`flex items-center cursor-pointer ${className}`}>
      <NextImage
        className="xl:hidden pc:hidden tablet:hidden"
        src={'/header/logo.png'}
        width={30}
        height={30}
        onClick={() => router.push('/')}
        alt="Logo"
        placeholder={"blur"}
        blurDataURL={GreenBlurDataUrl}
        priority
      />

      <NextImage
        className="mobile:hidden"
        src={'/header/logoWithText.png'}
        width={155}
        height={30}
        onClick={() => router.push('/')}
        alt="Logo"
        placeholder={"blur"}
        blurDataURL={GreenBlurDataUrl}
        priority
      />

      <span className="mobile:hidden text-[14px] font-[300] opacity-80 leading-[1.2] italic text-white pl-[10px]">
        beta
      </span>
    </div>
  );
};

export default Logo; 