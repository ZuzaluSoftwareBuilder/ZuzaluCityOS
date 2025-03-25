import { CaretLeft } from '@phosphor-icons/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@heroui/react';
import { useCallback } from 'react';
import { useMediaQuery } from '@mui/material';

export interface IBackHeaderProps {
  spaceId: string;
}

const BackHeader = ({ spaceId }: IBackHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isTablet = useMediaQuery('(max-width:1200px)');

  const handleBack = useCallback(() => {
    if (pathname.includes('/roles') && isTablet) {
      const roleParam = searchParams.get('role');
      if (roleParam) {
        return router.push(pathname);
      }
    }

    router.push(`/spaces/${spaceId}`);
  }, [isTablet, pathname, router, searchParams, spaceId]);

  return (
    <div className="flex items-center gap-[10px] w-full ">
      <Button
        className="h-[34px] bg-[#363636] hover:bg-[#424242] rounded-lg px-3.5 flex items-center gap-[5px]"
        onPress={handleBack}
      >
        <CaretLeft
          size={18}
          weight="light"
          format={'Stroke'}
          className="text-white"
        />
        <span className="text-white text-[13px] font-medium">Back</span>
      </Button>

      <span className="text-white text-[14px]">Space Settings</span>
    </div>
  );
};

export default BackHeader;
