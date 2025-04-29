import { Button } from '@/components/base';
import { SupabaseIcon } from '@/components/icons';
import { Tooltip } from '@heroui/react';
import { Barricade, CaretLeft, CaretRight, Check } from '@phosphor-icons/react';

interface StorageOptionProps {
  onBack: () => void;
  onSubmit: () => void;
  isSubmit: boolean;
}
export default function StorageOption({
  onBack,
  onSubmit,
  isSubmit,
}: StorageOptionProps) {
  return (
    <div className="flex flex-col justify-center gap-[30px] mobile:gap-[20px]">
      <div className="flex flex-col gap-[10px]">
        <h2 className="text-[20px] font-bold leading-[1.4] text-white mobile:text-[18px]">
          Storage
        </h2>
        <p className="text-[16px] leading-[1.6] text-white/80 opacity-80 mobile:text-[14px]">
          Select the method to store space data.
        </p>
        <p className=" text-[14px] leading-[1.2] text-white  opacity-80">
          Note: once a method is selected, this configuration cannot be changed.
        </p>
      </div>

      <div className="flex flex-col justify-center gap-[20px] rounded-[10px] border border-white/10 bg-white/[0.02] p-[20px] mobile:gap-[12px] mobile:p-[14px]">
        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-row items-stretch justify-stretch gap-[20px] mobile:flex-col mobile:gap-[10px]">
            <button
              className={`flex h-[50px] flex-1 flex-col justify-center rounded-[10px] bg-white/10 p-[10px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] transition-all duration-200`}
            >
              <div
                className={`flex w-full flex-row items-center justify-between`}
              >
                <div className="flex flex-row items-center gap-[10px]">
                  <SupabaseIcon size={6} />
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-[16px] font-semibold leading-[1.2] text-white">
                      Web2 -Supabase
                    </span>
                  </div>
                </div>
                <div>
                  <Check className="size-[16px] text-[#EDDCDC]" />
                </div>
              </div>
            </button>

            <button
              className={`flex h-[50px] flex-1 flex-col justify-center rounded-[10px] bg-white/[0.05] p-[10px] transition-all duration-200`}
            >
              <Tooltip
                placement="bottom"
                content="Coming soon"
                classNames={{
                  base: ['bg-transparent'],
                  content: [
                    'px-2.5 py-1 bg-[rgba(44,44,44,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm',
                  ],
                }}
              >
                <div
                  className={`flex w-full cursor-not-allowed flex-row items-center  justify-between opacity-50`}
                >
                  <div className="flex flex-row items-center gap-[10px]">
                    <Barricade
                      size={24}
                      weight="light"
                      className="text-white"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-[16px] font-semibold leading-[1.2] text-white">
                        Web3 - Ceramic Network
                      </span>
                    </div>
                  </div>
                </div>
              </Tooltip>
            </button>
          </div>
          <p className=" text-[14px] leading-[1.2] text-white">
            Web3 - Ceramic Network (coming soon)
          </p>
        </div>
      </div>

      <div className="mt-0 flex flex-row items-center justify-end gap-[10px]">
        <Button
          onClick={onBack}
          color="secondary"
          size="md"
          className="w-[120px] mobile:w-[100px]"
          startContent={
            <CaretLeft className="size-[20px] mobile:size-[16px]" />
          }
        >
          Back
        </Button>
        <Button
          onClick={onSubmit}
          color="submit"
          size="md"
          className="w-[120px] mobile:w-[100px]"
          endContent={<CaretRight className="size-[20px] mobile:size-[16px]" />}
          isLoading={isSubmit}
        >
          Create
        </Button>
      </div>
    </div>
  );
}
