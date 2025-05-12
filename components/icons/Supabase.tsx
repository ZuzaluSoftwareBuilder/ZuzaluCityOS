import { IconProps } from '@/types';

export const SupabaseIcon: React.FC<IconProps> = ({
  size = 6,
  color = 'white',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={`${size * 4}px`}
      height={`${size * 4}px`}
      viewBox="0 0 24 24"
      fill={color}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 14h8v7l8 -11h-8v-7z" />
    </svg>
  );
};
