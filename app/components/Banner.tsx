import React from 'react';

import { RightArrowIcon } from '@/components/icons';
import { Button } from '@/components/base';

const Banner = () => {
  return (
    <>
      <div className="h-[50px] p-[10px] border-b-w-10 border-b-1">1</div>
      <div className="px-[42px] py-[32px] bg-[url('/banner/banner_bg.png')] bg-lightgray bg-center bg-cover bg-no-repeat">
        <p className="text-[49px] font-[900] leading-[1.2] mb-[10px] font-[merriweather]">
          Zuzalu City
        </p>
        <p className="text-[16px] font-[500] leading-[1.2] opacity-80 mb-[20px]">
          Welcome to the new Zuzalu City! Stay up to date below.
        </p>
        <div className="flex items-center gap-[10px]">
          <Button border startContent={<RightArrowIcon />}>
            Join the Discussion
          </Button>
        </div>
      </div>
    </>
  );
};

export default Banner;
