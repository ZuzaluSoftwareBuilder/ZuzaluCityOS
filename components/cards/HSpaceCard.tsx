// 这里和app/component/SpaceCard.tsx 的组件差不多，
// 为了不影响原有业务，之后把app/component/SpaceCard.tsx 的组件迁移到这个文件中，成为公共组件
import React from 'react';
import { Image, Skeleton } from '@heroui/react';
import { Button, Avatar, Chip, Card, CardHeader, CardBody, CardFooter } from '@/components/base';
import { cn } from '@heroui/react';
import { UsersIcon, BuildingsIcon, ArrowSquareRightIcon, CheckCircleIcon } from '@/components/icons';
import { Space } from '@/types';
import { useRouter } from 'next/navigation';
import { useCeramicContext } from '@/context/CeramicContext';
import { isUserAssociated } from '@/utils/permissions';

// 格式化成员数的工具函数
const formatMemberCount = (count: number): string => {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`.replace('.0k', 'k');
    }
    return count.toString();
};

// 骨架屏组件
export function HSpaceCardSkeleton() {
    return (
        <Card className="w-[276px] flex-shrink-0 bg-[#262626] border border-white/10 rounded-[10px]">
            <CardHeader className="relative p-0">
                <Skeleton className="w-full h-[108px] rounded-t-[10px]" />
                <Skeleton className="absolute left-[11px] w-[60px] h-[60px] bottom-[-21px] z-10 rounded-full" />
                <div className="absolute bottom-[-30px] right-[6px] flex items-center gap-[6px]">
                    <Skeleton className="w-[16px] h-[16px] rounded-full" />
                    <Skeleton className="w-[30px] h-[13px] rounded-[4px]" />
                </div>
            </CardHeader>

            <CardBody className="pt-[30px] px-[10px] pb-0">
                <div className="flex items-center gap-1.5 mb-1.5">
                    <Skeleton className="w-[80px] h-[24px] rounded-[4px]" />
                </div>
                <Skeleton className="w-full h-[22px] mb-[6px] rounded-[4px]" />
                <Skeleton className="w-full h-[42px] mb-[8px] rounded-[4px]" />
                <div className="flex flex-start gap-[10px] my-[8px]">
                    <Skeleton className="w-[40px] h-[12px] rounded-[4px]" />
                    <Skeleton className="w-[40px] h-[12px] rounded-[4px]" />
                </div>
            </CardBody>

            <CardFooter className="px-[10px] pb-[10px]">
                <Skeleton className="w-full h-[40px] rounded-[8px]" />
            </CardFooter>
        </Card>
    );
}

interface HSpaceCardProps {
    data?: Space;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}
const sizeInfo = {
    sm: {
        width: '276px',
        height: '110px',
    },
    md: {
        width: '276px',
        height: '110px',
    },
    lg: {
        width: '318px',
        height: '126px',
    },
}
const HSpaceCard: React.FC<HSpaceCardProps> = ({ data, className, size = 'md' }) => {
    if (!data) {
        return <HSpaceCardSkeleton />;
    }

    const {
        banner,
        avatar,
        name,
        tagline,
        members,
        admins,
        superAdmin,
        category,
        id,
    } = data;
    const { profile } = useCeramicContext();
    const router = useRouter();
    const bannerSize = sizeInfo[size];

    const currentUserId = profile?.author?.id;

    const isUserJoined = React.useMemo(() => {
        return currentUserId && isUserAssociated(data, currentUserId);
    }, [currentUserId, data]);

    const formattedMemberCount = React.useMemo(() => {
        const totalMembers =
            (members?.length || 0) +
            (admins?.length || 0) +
            (superAdmin?.length || 0);
        return formatMemberCount(totalMembers);
    }, [members?.length, admins?.length, superAdmin?.length]);

    return (
        <Card
            className={cn(
                size === 'lg' ? "w-[318px]" : "w-[276px]",
                "bg-[#262626]",
                className
            )}
        >
            <CardHeader className="relative p-0">
                {/* Banner */}
                <div className={cn(
                    "w-full rounded-t-[10px] overflow-hidden",
                    size === 'lg' ? "h-[126px]" : "h-[110px]"
                )}>
                    <div className={cn(
                        "w-full h-full bg-[#404040]",
                        !banner && "bg-gradient-to-r from-[#7DFFD1] to-[#FFCA7A]"
                    )}>
                        {banner && (
                            <Image
                                src={banner}
                                alt={`${name} banner`}
                                classNames={{
                                    img: "w-full h-full object-cover"
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Avatar */}
                <div className="absolute left-[11px] bottom-[-21px]">
                    <Avatar
                        src={avatar}
                        alt={name}
                        className={cn(
                            "w-[60px] h-[60px] shadow-[0px_0px_0px_1px_rgba(34,34,34,0.10)]",
                            !avatar && "bg-gradient-to-br from-[#7DFFD1] to-[#FFCA7A]"
                        )}
                    />
                </div>

                {/* Joined Badge */}
                {isUserJoined && (
                    <div className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-[4px] border border-b-w-10 bg-[rgba(34,34,34,0.60)] backdrop-filter backdrop-blur-[5px] absolute right-[10px] top-[10px] z-10">
                        <CheckCircleIcon size={4} />
                        <span className="text-[14px] font-[500]">已加入</span>
                    </div>
                )}

                {/* Member Count */}
                <div className="absolute bottom-[-30px] right-[6px] flex items-center gap-[6px] opacity-50">
                    <UsersIcon size={4} />
                    <span className="text-[13px] leading-[1.4]">{formattedMemberCount}</span>
                </div>
            </CardHeader>

            <CardBody className="pt-[30px] px-[10px] pb-0">
                <div className="mb-[6px]">
                    <Chip startContent={<BuildingsIcon size={4} />} size="sm">
                        SPACETYPE
                    </Chip>
                </div>
                {/* Space Name */}
                <h3 className="text-shadow-[0px_5px_10px_rgba(0,0,0,0.15)] text-[18px] font-bold leading-[1.2] line-clamp-2 mb-[6px]">
                    {name}
                </h3>

                {/* Description */}
                <p className="text-shadow-[0px_5px_10px_rgba(0,0,0,0.15)] text-[13px] leading-[1.6] opacity-60 line-clamp-2 h-[42px] mb-[20px]">
                    {tagline}
                </p>

                {/* Categories */}
                <div className="mb-[10px] flex items-center gap-[10px] opacity-40">
                    {category
                        ?.split(',')
                        .slice(0, 2)
                        .map((item) => (
                            <span key={item} className="text-[10px] leading-[1.2] uppercase">
                                {item}
                            </span>
                        ))}
                    {category && category.split(',').length > 2 && (
                        <span className="text-[10px] leading-[1.2]">
                            +{category.split(',').length - 2}
                        </span>
                    )}
                </div>
            </CardBody>

            <CardFooter className="px-[10px] pb-[10px]">
                {/* Action Button */}
                <Button
                    startContent={<ArrowSquareRightIcon />}
                    className="w-full"
                    onPress={() => router.push(`/spaces/${id}`)}
                >
                    查看空间
                </Button>
            </CardFooter>
        </Card >
    );
};

export default HSpaceCard;
