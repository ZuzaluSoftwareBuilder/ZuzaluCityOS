export const XIcon = ({ size = 20, color = 'white' }: { size?: number, color?: string }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 21" fill={color}>
            <path d="M15.625 4.96484L4.375 16.2148" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15.625 16.2148L4.375 4.96484" stroke="#EDDCDC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}