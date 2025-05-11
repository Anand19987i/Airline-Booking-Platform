/** @type {import('tailwindcss').Config} */
export const darkMode = 'class';
export const content = [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
    extend: {
        colors: {
            // Custom dark mode colors
            dark: {
                900: '#111827',
                800: '#1F2937',
                700: '#374151',
            },
            fontFamily: {
                montserrat: [
                    'Montserrat',
                    'sans-serif'
                ],
                poppins: [
                    'Poppins',
                    'sans-serif'
                ],
                b612: [
                    'b612',
                    'sans-serif'
                ]
              
            },
        },
    },
};
export const plugins = [];