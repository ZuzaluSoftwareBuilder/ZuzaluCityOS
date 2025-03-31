import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseScrollSectionProps {
  sections: {
    hash: string;
    threshold?: number;
  }[];
  onSectionChange?: (hash: string) => void;
  options?: {
    scrollContainer?: HTMLElement | null;
  };
}

export const useScrollSection = ({
  sections,
  onSectionChange,
  options = {},
}: UseScrollSectionProps) => {
  const { scrollContainer } = options;
  const isScrollingRef = useRef(false);
  const [activeSection, setActiveSection] = useState(sections[0].hash);

  const getScrollContainer = useCallback(() => {
    if (scrollContainer && !(scrollContainer instanceof Window)) {
      return {
        element: scrollContainer,
        scrollTop: scrollContainer.scrollTop,
        getBoundingClientRect: () => scrollContainer.getBoundingClientRect(),
        addEventListener:
          scrollContainer.addEventListener.bind(scrollContainer),
        removeEventListener:
          scrollContainer.removeEventListener.bind(scrollContainer),
        scrollTo: scrollContainer.scrollTo.bind(scrollContainer),
      };
    }
    return {
      element: window,
      scrollTop: window.scrollY,
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
      }),
      addEventListener: window.addEventListener.bind(window),
      removeEventListener: window.removeEventListener.bind(window),
      scrollTo: window.scrollTo.bind(window),
    };
  }, [scrollContainer]);

  const scrollToSection = useCallback(
    (hash: string, offset: number = -20) => {
      const container = getScrollContainer();
      const element = document.getElementById(hash);
      if (!element) return;

      isScrollingRef.current = true;
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollTop = rect.top - containerRect.top + container.scrollTop;

      container.scrollTo({
        top: scrollTop + offset,
        behavior: 'smooth',
      });

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    },
    [getScrollContainer],
  );

  // 监听滚动事件
  useEffect(() => {
    const container = getScrollContainer();
    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const sectionElements = sections.map((section) => ({
        hash: section.hash,
        element: document.getElementById(section.hash),
        threshold: section.threshold ?? 100,
      }));

      const currentSection = sectionElements.find((section) => {
        if (!section.element) return false;
        const rect = section.element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        return rect.top <= containerRect.top + section.threshold;
      });

      if (currentSection) {
        setActiveSection((prev) => {
          if (prev !== currentSection.hash) {
            onSectionChange?.(currentSection.hash);
            return currentSection.hash;
          }
          return prev;
        });
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [getScrollContainer, sections, onSectionChange]);

  return {
    activeSection,
    setActiveSection,
    scrollToSection,
  };
};
