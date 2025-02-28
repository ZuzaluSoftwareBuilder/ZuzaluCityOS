import React from 'react';

import {
  ArrowCircleRightFillIcon,
  ArrowCircleRightIcon,
  RightArrowIcon,
} from '@/components/icons';
import { Button } from '@/components/base';

const Banner = () => {
  return (
    <>
      <div className="h-[50px] border-b-w-10 border-b-1 bg-[rgb(34,34,34)] hover:bg-[rgb(28,28,28)] cursor-pointer group">
        <div className="h-full p-[10px] w-full flex items-center justify-center gap-[10px]">
          <div className="relative w-[24px] h-[24px]">
            <ArrowCircleRightIcon className="absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0" />
            <ArrowCircleRightFillIcon className="absolute inset-0 transition-all duration-300 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-[2px]" />
          </div>
          <div className="relative transition-transform duration-300 group-hover:-translate-x-[2px]">
            <p className="text-[14px] font-[600] leading-[1.2] text-white/80">
              Learn about Zuzalu City&apos;s focus on building decentralized,
              ethereum-based, privacy…
            </p>
            <p
              className="text-[14px] font-[600] leading-[1.2] text-transparent animate-gradient absolute top-0 left-0 z-10"
              style={{
                animationTimeline: 'auto',
                animationRangeStart: 'normal',
                animationRangeEnd: 'normal',
                background:
                  'linear-gradient(90deg, transparent 0%, transparent 41%, rgb(125, 255, 209) 50%, transparent 59%, transparent 100%) 0% 0% / 200% 200% no-repeat text',
                animation: '4s linear 0s infinite normal none running eKXFfL',
              }}
            >
              Learn about Zuzalu City&apos;s focus on building decentralized,
              ethereum-based, privacy…
            </p>
          </div>
        </div>
      </div>
      <div className="px-[42px] py-[32px] bg-[url('/banner/banner_bg.png')] bg-lightgray bg-center bg-cover bg-no-repeat">
        <p className="text-[49px] font-[900] leading-[1.2] mb-[10px] font-[merriweather]">
          Zuzalu City
        </p>
        <p className="text-[16px] font-[500] leading-[1.2] opacity-80 mb-[20px]">
          Welcome to the new Zuzalu City! Stay up to date below.
        </p>
        <div className="flex items-center gap-[10px]">
          <Button
            border
            startContent={<RightArrowIcon />}
            className="bg-[#383838] font-[600]"
          >
            Join the Discussion
          </Button>
        </div>
      </div>
    </>
  );
};

export default Banner;
