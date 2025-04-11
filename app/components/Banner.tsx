import { Button } from '@/components/base';
import {
  ArrowCircleRightFillIcon,
  ArrowCircleRightIcon,
  RightArrowIcon,
} from '@/components/icons';
import { useRouter } from 'next/navigation';

const Banner = () => {
  const router = useRouter();
  return (
    <>
      <div
        className="group h-[40px] cursor-pointer border-b-1 border-b-w-10 bg-[rgb(34,34,34)] hover:bg-[rgb(28,28,28)]"
        onClick={() => router.push('/dapps')}
      >
        <div className="flex size-full items-center justify-center gap-[10px] p-[10px]">
          <div className="relative size-[24px]">
            <ArrowCircleRightIcon className="absolute inset-0 opacity-100 transition-opacity duration-300 group-hover:opacity-0" />
            <ArrowCircleRightFillIcon className="absolute inset-0 opacity-0 transition-all duration-300 group-hover:translate-x-[2px] group-hover:opacity-100" />
          </div>
          <div className="relative transition-transform duration-300 group-hover:translate-x-[-2px]">
            <p className="text-[14px] font-[600] leading-[1.2] text-white/80">
              dApp Explore Open! List your dApps now!
            </p>
            <p
              className="absolute left-0 top-0 z-10 text-[14px] font-[600] leading-[1.2] text-transparent"
              style={{
                animationTimeline: 'auto',
                animationRangeStart: 'normal',
                animationRangeEnd: 'normal',
                background:
                  'linear-gradient(90deg, transparent 0%, transparent 41%, rgb(125, 255, 209) 50%, transparent 59%, transparent 100%) 0% 0% / 200% 200% no-repeat text',
                animation: '4s linear 0s infinite normal none running eKXFfL',
              }}
            >
              dApp Explore Open! List your dApps now!
            </p>
          </div>
        </div>
      </div>
      <div className="border-b-1 border-b-w-10 bg-[url('/banner/banner_bg.png')] bg-cover bg-center bg-no-repeat px-[42px] py-[32px] mobile:p-[20px]">
        <p className="mb-[10px] font-merriweather text-[49px] font-black leading-[1.2] mobile:mb-0 mobile:text-[42px]">
          Zuzalu City
        </p>
        <p className="mb-[20px] text-[16px] font-[500] leading-[1.2] opacity-80">
          Welcome to the new Zuzalu City! Stay up to date below.
        </p>
        <div className="flex items-center gap-[10px] mobile:flex-col mobile:items-start">
          <Button
            color="functional"
            startContent={<RightArrowIcon />}
            className="bg-[#383838] font-[600] mobile:w-full"
          >
            Join the Discussion
          </Button>
        </div>
      </div>
    </>
  );
};

export default Banner;
