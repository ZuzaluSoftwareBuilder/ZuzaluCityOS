'use client';
import React, { useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useScrollSection } from '@/hooks/useScrollSection';

const APP_CATEGORY = {
  NativeApps: {
    hash: 'native-apps',
    title: 'Native Apps',
    subTitle: 'Install apps integrated directly in Zuzalu City',
  },
  CommunityApps: {
    hash: 'community-apps',
    title: 'Community Apps',
    subTitle: 'Install apps built by the community',
  },
};

export default function ExploreAppsPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { activeSection, setActiveSection, scrollToSection } = useScrollSection(
    {
      sections: Object.values(APP_CATEGORY).map((item) => ({
        hash: item.hash,
        threshold: 100,
      })),
      onSectionChange: (hash) => {
        window.history.replaceState(null, '', `#${hash}`);
      },
      options: {
        scrollContainer: scrollContainerRef.current,
      },
    },
  );

  // Scroll to section when hash is present
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (
      hash &&
      Object.values(APP_CATEGORY).some((item) => item.hash === hash)
    ) {
      setActiveSection(hash);
      scrollToSection(hash);
    }
  }, [scrollToSection, setActiveSection]);

  // Handle nav click
  const handleNavClick = useCallback(
    (hash: string, e: React.MouseEvent) => {
      e.preventDefault();
      setActiveSection(hash);
      scrollToSection(hash);
      window.history.pushState(null, '', `#${hash}`);
    },
    [scrollToSection, setActiveSection],
  );

  return (
    <div
      className={clsx(
        'w-full h-full overflow-hidden',
        'p-[20px] pc:p-[20px_40px_0]',
        'relative',
      )}
    >
      <div
        ref={scrollContainerRef}
        className={clsx('w-full h-full overflow-auto flex gap-10')}
      >
        <div
          className={clsx(
            'hidden pc:flex', // show on pc
            'absolute top-[20px] left-[40px]',
            'h-full w-[150px] p-[20px] flex-col gap-5',
          )}
        >
          {Object.values(APP_CATEGORY).map((item) => (
            <Link
              key={item.hash}
              href={`#${item.hash}`}
              onClick={(e) => handleNavClick(item.hash, e)}
              className={clsx(
                'text-[13px] font-medium leading-[140%]',
                activeSection !== item.hash && 'opacity-50',
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
        <div
          className={clsx(
            'h-full w-full p-5  flex flex-col gap-5',
            'pc:w-[600px] xl:mx-auto', // pc
            'mobile:p-0', // mobile
          )}
        >
          {Object.values(APP_CATEGORY).map((item, idx, arr) => {
            return (
              <React.Fragment key={item.hash}>
                <div id={item.hash} className="w-full flex flex-col gap-3 ">
                  <div className="leading-[140%] font-semibold text-[18px]">
                    {item.title}
                  </div>
                  <div className="leading-[140%] font-medium text-[13px] opacity-50">
                    {item.subTitle}
                  </div>
                  <div className="flex flex-col">
                    {/* TODO: app list */}
                  </div>
                </div>
                {/* line of division */}
                {idx < arr.length - 1 && (
                  <hr className="w-full border-[rgba(255,255,255,0.1)]" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
