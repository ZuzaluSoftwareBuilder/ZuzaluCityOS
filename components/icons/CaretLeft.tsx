import * as React from 'react';
import { IconProps } from 'types';

export const CaretLeftIcon: React.FC<IconProps> = ({
  size = 6,
  color = 'white',
}) => {
  return (
    <svg
      width={`${size * 4}px`}
      height={`${size * 4}px`}
      viewBox="0 0 21 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 16.25L6.75 10L13 3.75"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}; 