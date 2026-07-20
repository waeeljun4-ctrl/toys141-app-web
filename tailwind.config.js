/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            colors: {
                // Bright, playful toy-store palette — white background, vivid coral-red accent
                accent: {
                    DEFAULT: '#FF5A36', // vivid coral-red — CTAs, active states, discount badges
                    light:   '#FF8666',
                    pale:    '#FFEEE8',
                    dark:    '#E1441F',
                },
                ink: {
                    DEFAULT: '#20242E', // cool charcoal-navy — text, dark surfaces
                    2:       '#2B303C',
                },
                cream: {
                    DEFAULT: '#FFFFFF', // clean white background
                    2:       '#F4F6F8',
                    3:       '#E7EBEF',
                },
                muted: '#6B7280', // secondary/neutral text
            },
            fontFamily: {
                cairo: ['Cairo', 'sans-serif'],
                display: ['"Baloo Bhaijaan 2"', 'Cairo', 'sans-serif'], // playful rounded headline font
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
};
