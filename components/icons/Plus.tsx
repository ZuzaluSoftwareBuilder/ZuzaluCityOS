import * as React from 'react';
import { IconProps } from 'types';

export const PlusIcon: React.FC<IconProps> = ({
  size = 6,
  color = 'white',
}) => {
  return (
    <svg
      width={`${size * 4}px`}
      height={`${size * 4}px`}
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.625 10H17.375"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 3.125V16.875"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
