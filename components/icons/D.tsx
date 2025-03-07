import React from 'react';
import { IconProps } from 'types';

interface DIconProps extends IconProps {
  width?: number | string;
  height?: number | string;
}

export const DIcon: React.FC<DIconProps> = ({
  color = 'white',
  width = 15,
  height = 21,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="14 6.28571 15 21.42859"
      fill="none"
    >
      <g filter="url(#filter0_d_14956_492)">
        <path
          d="M29 12.7143V14.8571H26.8571V12.7143H29ZM29 10.5714V12.7143H26.8571V10.5714H29ZM26.8571 10.5714V12.7143H24.7143V10.5714H26.8571ZM26.8571 12.7143V14.8571H24.7143V12.7143H26.8571ZM26.8571 14.8571V17H24.7143V14.8571H26.8571ZM26.8571 17V19.1428H24.7143V17H26.8571ZM26.8571 19.1428V21.2857H24.7143V19.1428H26.8571ZM29 19.1428V21.2857H26.8571V19.1428H29ZM29 17V19.1428H26.8571V17H29ZM29 14.8571V17H26.8571V14.8571H29ZM29 21.2857V23.4286H26.8571V21.2857H29ZM26.8571 21.2857V23.4286H24.7143V21.2857H26.8571ZM26.8571 23.4286V25.5714H24.7143V23.4286H26.8571ZM26.8571 25.5714V27.7143H24.7143V25.5714H26.8571ZM29 25.5714V27.7143H26.8571V25.5714H29ZM29 23.4286V25.5714H26.8571V23.4286H29ZM18.2857 25.5714V27.7143H16.1429V25.5714H18.2857ZM16.1429 23.4286V25.5714H14V23.4286H16.1429ZM16.1429 21.2857V23.4286H14V21.2857H16.1429ZM16.1429 19.1428V21.2857H14V19.1428H16.1429ZM16.1429 17V19.1428H14V17H16.1429ZM16.1429 14.8571V17H14V14.8571H16.1429ZM16.1429 12.7143V14.8571H14V12.7143H16.1429ZM18.2857 17V19.1428H16.1429V17H18.2857ZM18.2857 19.1428V21.2857H16.1429V19.1428H18.2857ZM18.2857 21.2857V23.4286H16.1429V21.2857H18.2857ZM18.2857 23.4286V25.5714H16.1429V23.4286H18.2857ZM18.2857 14.8571V17H16.1429V14.8571H18.2857ZM20.4286 12.7143V14.8571H18.2857V12.7143H20.4286ZM20.4286 10.5714V12.7143H18.2857V10.5714H20.4286ZM18.2857 10.5714V12.7143H16.1429V10.5714H18.2857ZM18.2857 12.7143V14.8571H16.1429V12.7143H18.2857ZM22.5714 10.5714V12.7143H20.4286V10.5714H22.5714ZM29 6.28571V8.42856H26.8571V6.28571H29ZM26.8571 6.28571V8.42856H24.7143V6.28571H26.8571ZM26.8571 8.42856V10.5714H24.7143V8.42856H26.8571ZM29 8.42856V10.5714H26.8571V8.42856H29ZM22.5714 25.5714V27.7143H20.4286V25.5714H22.5714ZM20.4286 25.5714V27.7143H18.2857V25.5714H20.4286ZM20.4286 23.4286V25.5714H18.2857V23.4286H20.4286ZM22.5714 23.4286V25.5714H20.4286V23.4286H22.5714ZM24.7143 23.4286V25.5714H22.5714V23.4286H24.7143ZM24.7143 10.5714V12.7143H22.5714V10.5714H24.7143ZM24.7143 12.7143V14.8571H22.5714V12.7143H24.7143ZM22.5714 12.7143V14.8571H20.4286V12.7143H22.5714Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_14956_492"
          x="0"
          y="0.285706"
          width="43"
          height="49.4286"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="8" />
          <feGaussianBlur stdDeviation="7" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_14956_492"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_14956_492"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
