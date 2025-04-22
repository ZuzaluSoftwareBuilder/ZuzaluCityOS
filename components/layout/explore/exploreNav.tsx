import { Button } from '@/components/base';
import { cn } from '@heroui/react';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface INavItem {
  label: string;
  icon: React.ReactNode;
  isComingSoon?: boolean;
}

export interface IExploreNavProps {
  navItems: INavItem[];
  onNavChange?: (_item: INavItem, _index: number) => void;
}

export default function ExploreNav({
  navItems,
  onNavChange,
}: IExploreNavProps) {
  const [activeTab, setActiveTab] = useState(navItems[0].label);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: '0px',
    width: '0px',
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef(new Map<string, HTMLElement>());
  const activeTabRef = useRef(activeTab);

  const updateIndicatorPosition = useCallback(() => {
    const currentActiveTab = activeTabRef.current;
    if (!currentActiveTab) return;

    const activeButton = buttonRefs.current.get(currentActiveTab);

    if (activeButton && containerRef.current) {
      const buttonRect = activeButton.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      setIndicatorStyle({
        left: `${buttonRect.left - containerRect.left}px`,
        width: `${buttonRect.width}px`,
      });
    }
  }, []);

  useEffect(() => {
    activeTabRef.current = activeTab;
    updateIndicatorPosition();
  }, [activeTab, updateIndicatorPosition]);

  useEffect(() => {
    window.addEventListener('resize', updateIndicatorPosition);

    return () => {
      window.removeEventListener('resize', updateIndicatorPosition);
    };
  }, []);

  const handleTabClick = useCallback(
    (item: INavItem, index: number) => {
      if (item.isComingSoon) return;
      setActiveTab(item.label);
      onNavChange?.(item, index);
    },
    [onNavChange],
  );

  const setButtonRef = useCallback(
    (element: HTMLElement | null, label: string) => {
      if (element) {
        buttonRefs.current.set(label, element);
      }
    },
    [],
  );

  return (
    <div className="sticky top-[50px] z-[1000] w-full max-w-full border-b border-white/10 bg-[rgba(34,34,34)] p-[0_10px]">
      <div
        ref={containerRef}
        className="relative flex w-full flex-row overflow-x-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {navItems.map((item, index) => (
          <Button
            key={item.label}
            ref={(el) => setButtonRef(el as HTMLElement | null, item.label)}
            className={cn(
              'h-[45px] bg-transparent hover:bg-transparent min-w-0 whitespace-nowrap p-[14px] text-[16px] uppercase font-[600] leading-[1.4] text-white opacity-[0.34] shrink-0',
              activeTab === item.label ? 'opacity-100' : '',
              item.isComingSoon && 'cursor-not-allowed',
            )}
            startContent={item.icon}
            onPress={() => handleTabClick(item, index)}
            isDisabled={!!item.isComingSoon}
            disableAnimation={true}
            role="tab"
            aria-selected={activeTab === item.label}
          >
            {item.label}
            {item.isComingSoon && (
              <span className="whitespace-nowrap text-[13px] font-[400]">
                (Coming Soon)
              </span>
            )}
          </Button>
        ))}
        <div
          className="absolute bottom-0 m-0 h-px bg-[#DFDFDF] transition-all duration-300 ease-[ease]"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
        />
      </div>
    </div>
  );
}
