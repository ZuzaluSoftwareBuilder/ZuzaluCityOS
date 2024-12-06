import { extendTheme } from '@chakra-ui/react';

const chakraTheme = extendTheme({
    styles: {
        global: {
            ':root': {
                '--foreground-rgb': '0, 0, 0',
                '--background-start-rgb': '214, 219, 220',
                '--background-end-rgb': '255, 255, 255',
            },
            '@media (prefers-color-scheme: dark)': {
                ':root': {
                    '--foreground-rgb': '255, 255, 255',
                    '--background-start-rgb': '0, 0, 0',
                    '--background-end-rgb': '0, 0, 0',
                },
            },
            '*': {
                boxSizing: 'border-box',
            },
            body: {
                color: 'rgb(var(--foreground-rgb))',
                backgroundColor: '#222',
                margin: 0,
                fontFamily: 'Inter, sans-serif',
            },
            '::-webkit-scrollbar': {
                width: '0px',
            },
            '::-webkit-scrollbar-track': {
                width: '0px',
            },
        },
    },
});

export default chakraTheme;
