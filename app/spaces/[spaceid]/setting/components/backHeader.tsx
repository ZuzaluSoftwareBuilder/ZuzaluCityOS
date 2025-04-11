import { Button } from '@heroui/react';
import { useMediaQuery } from '@mui/material';
import { CaretLeft } from '@phosphor-icons/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

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
    <div className="flex w-full items-center gap-[10px] ">
      <Button
        className="flex h-[34px] items-center gap-[5px] rounded-lg bg-[#363636] px-3.5 hover:bg-[#424242]"
        onPress={handleBack}
      >
        <CaretLeft
          size={18}
          weight="light"
          format={'Stroke'}
          className="text-white"
        />
        <span className="text-[13px] font-medium text-white">Back</span>
      </Button>

      <span className="text-[14px] text-white">Space Settings</span>
    </div>
  );
};

export default BackHeader;
