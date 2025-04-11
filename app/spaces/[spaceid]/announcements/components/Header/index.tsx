'use client';

import clsx from 'clsx';

const AnnouncementsHeader = () => {
  return (
    <div
      className={clsx([
        'flex items-center border-b border-[rgba(255,255,255,0.1)] bg-[#2c2c2c]',
        'p-5',
        'pc:h-[50px] pc:px-5 pc:backdrop-blur-[20px]',
      ])}
    >
      <h1
        className={clsx([
          'shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)]',
          'text-[16px] font-[600] leading-[120%] text-white',
          'pc:text-[20px] pc:font-bold',
        ])}
      >
        Announcements
      </h1>
    </div>
  );
};

export default AnnouncementsHeader;
