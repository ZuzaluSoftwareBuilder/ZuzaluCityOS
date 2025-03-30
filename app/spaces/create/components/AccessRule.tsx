import { DoorOpen } from "@phosphor-icons/react";
import { LockLaminated } from "@phosphor-icons/react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { CheckIcon } from '@heroicons/react/16/solid';
import { Button } from '@/components/base';

interface AccessRuleProps {
    onBack: () => void;
    onSubmit: () => void;
    isGated: boolean;
    onGatedChange: (isGated: boolean) => void;
}

export default function AccessRule({ onBack, onSubmit, isGated, onGatedChange }: AccessRuleProps) {
    return (
        <div className="flex flex-col justify-center gap-[30px] mobile:gap-[20px]">
            {/* Header Section */}
            <div className="flex flex-col gap-[10px]">
                <h2 className="text-white font-bold text-[20px] mobile:text-[18px] leading-[1.4]">Access Rule</h2>
                <p className="text-white/80 text-[16px] opacity-80 mobile:text-[14px] leading-[1.6]">
                    Optionally configure access to your community space. You can leave your space open or gate access to your space with a credential.
                </p>
                <p className="text-white text-[14px] leading-[1.2] opacity-80  text-shadow-[0px_5px_10px_rgba(0,0,0,0.15)]">Note: Space Gating can also be configured later</p>
            </div>

            {/* Selection Section */}
            <div className="flex flex-col justify-center gap-[20px] p-[20px] mobile:gap-[12px] mobile:p-[14px] bg-white/[0.02] border border-white/10 rounded-[10px]">
                <div className="flex flex-col gap-[20px]">
                    <div className="flex flex-row mobile:flex-col justify-stretch items-stretch gap-[20px] mobile:gap-[10px]">
                        {/* Open Space Option */}
                        <button
                            onClick={() => onGatedChange(false)}
                            className={`flex-1 flex flex-col justify-center h-[50px] p-[10px] rounded-[10px] transition-all duration-200 ${!isGated ? "bg-white/10 shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)]" : "bg-white/[0.05]"
                                }`}
                        >
                            <div className={`flex flex-row justify-between items-center w-full ${!isGated ? '' : 'opacity-50'}`}>
                                <div className="flex flex-row items-start items-center gap-[10px]">
                                    <DoorOpen size={30} className="text-white flex-shrink-0" weight="duotone" />
                                    <div className="flex-1 min-w-0">
                                        <span className="text-white font-semibold text-[16px] leading-[1.2] block truncate">Open Space</span>
                                    </div>
                                </div>
                                <div>
                                    {!isGated && <CheckIcon className="text-[#EDDCDC] w-[16px] h-[16px]" />}
                                </div>
                            </div>
                        </button>

                        {/* Gated Space Option */}
                        <button
                            onClick={() => onGatedChange(true)}
                            className={`flex-1 flex flex-col justify-center h-[50px] p-[10px] rounded-[10px] transition-all duration-200 ${isGated ? "bg-white/10 shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)]" : "bg-white/[0.05]"
                                }`}
                        >
                            <div className={`flex flex-row justify-between items-center w-full ${!isGated ? 'opacity-50' : ''}`}>
                                <div className="flex flex-row items-start items-center gap-[10px]">
                                    <LockLaminated size={30} className="text-white flex-shrink-0" weight="duotone" />
                                    <div className="flex-1 min-w-0">
                                        <span className="text-white font-semibold text-[16px] leading-[1.2] block truncate">Gated Space</span>
                                    </div>
                                </div>
                                <div>
                                    {isGated && <CheckIcon className="text-[#EDDCDC] w-[16px] h-[16px]" />}
                                </div>
                            </div>
                        </button>
                    </div>
                    <p className="text-white text-[14px] leading-[1.2] text-shadow-[0px_5px_10px_rgba(0,0,0,0.15)]">
                        An open space allows anyone to be a member. Apps inside a space can still be gated.
                    </p>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-row justify-end items-center gap-[10px] mt-0 mobile:mt-[auto]">
                <Button
                    onClick={onBack}
                    color="secondary"
                    size="md"
                    className="w-[120px] mobile:w-[100px]"
                    startContent={<CaretLeft className="w-[20px] h-[20px] mobile:w-[16px] mobile:h-[16px]" />}
                >
                    Back
                </Button>
                <Button
                    onClick={onSubmit}
                    color="primary"
                    size="md"
                    className="w-[120px] mobile:w-[100px]"
                    endContent={<CaretRight className="w-[20px] h-[20px] mobile:w-[16px] mobile:h-[16px]" />}
                >
                    Create
                </Button>
            </div>
        </div>
    );
}
