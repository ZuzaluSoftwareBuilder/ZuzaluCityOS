import { cn } from '@heroui/react';
import React from 'react';

/**
 * FormTitle component - Used for form section titles
 * Replaces Typography variant="subtitleMB" from MUI
 */
export const FormTitle = ({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) => {
  return (
    <h3
      className={cn(
        'text-[16px] font-semibold text-white leading-[1.2]',
        className,
      )}
    >
      {children}
    </h3>
  );
};

/**
 * FormLabel component - Used for form field labels
 * Based on Figma design (font-weight: 700, font-size: 16px, line-height: 1.2)
 */
export const FormLabel = ({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) => {
  return (
    <label
      className={cn(
        'text-[16px] font-bold text-white leading-[1.2]',
        className,
      )}
    >
      {children}
    </label>
  );
};

/**
 * FormLabelDesc component - Used for form field descriptions
 * Based on Figma design (font-weight: 400, font-size: 13px, line-height: 1.4, letter-spacing: 1%)
 */
export const FormLabelDesc = ({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) => {
  return (
    <p
      className={cn(
        'text-[13px] font-normal text-white/60 leading-[1.4] tracking-[0.01em]',
        className,
      )}
    >
      {children}
    </p>
  );
};

/**
 * FormHelperText component - Used for form field error messages
 */
export const FormHelperText = ({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  error?: boolean;
  className?: string;
}>) => {
  return (
    <p className={cn('text-[12px] mt-1', 'text-error', className)}>
      {children}
    </p>
  );
};

/**
 * FormGroup component - Used to group form elements
 * Based on Figma design with 10px gap
 */
export const FormGroup = ({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) => {
  return (
    <div className={cn('flex flex-col gap-[10px]', className)}>{children}</div>
  );
};

/**
 * FormSection component - Used to create a section in a form
 * Based on Figma design (bg-white/[0.02], border-white/10, rounded-[10px], p-[20px])
 */
export const FormSection = ({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) => {
  return (
    <div
      className={cn(
        'bg-white/[0.02] border border-white/10 rounded-[10px] p-[20px]',
        className,
      )}
    >
      {children}
    </div>
  );
};

/**
 * FormSectionTitle component - Used for section titles in forms
 * Based on Figma design (text-[16px], font-semibold, text-white/60)
 */
export const FormSectionTitle = ({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) => {
  return (
    <h4
      className={cn(
        'text-[16px] font-semibold text-white opacity-60',
        className,
      )}
    >
      {children}
    </h4>
  );
};

/**
 * FormTag component - Used for tags/categories in forms
 * Based on Figma design (bg-white/[0.05], rounded-[10px], px-[10px] py-[4px])
 */
export const FormTag = ({
  children,
  onRemove,
  className,
}: Readonly<{
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}>) => {
  return (
    <div
      className={cn(
        'flex items-center bg-white/[0.05] rounded-[10px] px-[10px] py-[4px]',
        className,
      )}
    >
      <span className="text-[14px] font-semibold text-white">{children}</span>
      {onRemove && (
        <div className="ml-[10px] cursor-pointer opacity-50" onClick={onRemove}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

/**
 * FormFooter component - Used for form action buttons
 */
export const FormFooter = ({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) => {
  return (
    <div className={cn('flex justify-end gap-[10px] mt-[20px]', className)}>
      {children}
    </div>
  );
};
