import { Button } from '@/components/base';
import {
  CaretLeft,
  CaretRight,
  Check,
  DoorOpen,
  LockLaminated,
} from '@phosphor-icons/react';

interface AccessRuleProps {
  onBack: () => void;
  onSubmit: () => void;
  isGated: boolean;
  onGatedChange: (isGated: boolean) => void;
}

export default function AccessRule({
  onBack,
  onSubmit,
  isGated,
  onGatedChange,
}: AccessRuleProps) {
  return (
    <div className="flex flex-col justify-center gap-[30px] mobile:gap-[20px]">
      <div className="flex flex-col gap-[10px]">
        <h2 className="text-[20px] font-bold leading-[1.4] text-white mobile:text-[18px]">
          Access Rule
        </h2>
        <p className="text-[16px] leading-[1.6] text-white/80 opacity-80 mobile:text-[14px]">
          Optionally configure access to your community space. You can leave
          your space open or gate access to your space with a credential.
        </p>
        <p className=" text-[14px] leading-[1.2] text-white  opacity-80">
          Note: Space Gating can also be configured later
        </p>
      </div>

      <div className="flex flex-col justify-center gap-[20px] rounded-[10px] border border-white/10 bg-white/[0.02] p-[20px] mobile:gap-[12px] mobile:p-[14px]">
        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-row items-stretch justify-stretch gap-[20px] mobile:flex-col mobile:gap-[10px]">
            <button
              onClick={() => onGatedChange(false)}
              className={`flex h-[50px] flex-1 flex-col justify-center rounded-[10px] p-[10px] transition-all duration-200 ${
                !isGated
                  ? 'bg-white/10 shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)]'
                  : 'bg-white/[0.05]'
              }`}
            >
              <div
                className={`flex w-full flex-row items-center justify-between ${!isGated ? '' : 'opacity-50'}`}
              >
                <div className="flex flex-row items-center gap-[10px]">
                  <DoorOpen
                    size={30}
                    className="shrink-0 text-white"
                    weight="duotone"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-[16px] font-semibold leading-[1.2] text-white">
                      Open Space
                    </span>
                  </div>
                </div>
                <div>
                  {!isGated && <Check className="size-[16px] text-[#EDDCDC]" />}
                </div>
              </div>
            </button>

            <button
              onClick={() => onGatedChange(true)}
              className={`flex h-[50px] flex-1 flex-col justify-center rounded-[10px] p-[10px] transition-all duration-200 ${
                isGated
                  ? 'bg-white/10 shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)]'
                  : 'bg-white/[0.05]'
              }`}
            >
              <div
                className={`flex w-full flex-row items-center justify-between ${!isGated ? 'opacity-50' : ''}`}
              >
                <div className="flex flex-row items-center gap-[10px]">
                  <LockLaminated
                    size={30}
                    className="shrink-0 text-white"
                    weight="duotone"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-[16px] font-semibold leading-[1.2] text-white">
                      Gated Space
                    </span>
                  </div>
                </div>
                <div>
                  {isGated && <Check className="size-[16px] text-[#EDDCDC]" />}
                </div>
              </div>
            </button>
          </div>
          <p className=" text-[14px] leading-[1.2] text-white">
            An open space allows anyone to be a member. Apps inside a space can
            still be gated.
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
        >
          Next
        </Button>
      </div>
    </div>
  );
}
