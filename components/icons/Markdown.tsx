import React, { CSSProperties } from 'react';

export const MarkdownIcon: React.FC<{
    size?: number;
    style?: CSSProperties;
    color?: string;
}> = ({ size = 6, style, color = 'white' }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="15" viewBox="0 0 21 15" fill="none">
            <g clip-path="url(#clip0_469_11459)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.30085 4.06177H3.33984V11.506H5.38327V7.3727L7.32879 10.0394L9.18199 7.3727V11.506H11.1226V4.06177H9.18199L7.32879 6.81714L5.30085 4.06177ZM2.05636 0.794922H18.9436C19.8028 0.794922 20.5 1.59076 20.5 2.57247V13.0174C20.5 13.9989 19.8032 14.7949 18.9436 14.7949H2.05636C1.19717 14.7949 0.5 13.9991 0.5 13.0174V2.57247C0.5 1.59091 1.19681 0.794922 2.05636 0.794922ZM14.5078 4.10603H14.4884V7.92826H12.6206L15.5 11.506L18.3795 7.90628H16.4347V4.10603H14.5078Z" fill="white" />
            </g>
            <defs>
                <clipPath id="clip0_469_11459">
                    <rect width="20" height="14" fill="white" transform="translate(0.5 0.794922)" />
                </clipPath>
            </defs>
        </svg>
    );
};
