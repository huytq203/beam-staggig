const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    // 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    fontFamily: {
      sans: ['Barlow', 'sans-serif']
    },
    screens: {
      'xs': '0px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px',
    },
    minHeight: {
      screen: "100vh",
      full: "100%",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
      0: "0",
      4: "1rem",
      8: "2rem",
      12: "3rem",
      16: "4rem",
    },
    borderWidth: {
      DEFAULT: "1px",
      0: "0",
      1: "1px",
      2: "2px",
      3: "3px",
      4: "4px",
      6: "6px",
      8: "8px",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#20B1AA",
        },
        subtext: {
          DEFAULT: "#4E4E4E"
        },
        main: '#208e91'
      },
      // fontFamily: {
      //   sans: ['var(--font-inter)', ...fontFamily.sans],
      // },
      maxWidth: {
        desktop: "1440px",
      },
      width: {
        60: "60px",
        100: "100px",
      },
      height: {
        100: "30rem"
      },
      zIndex: {
        '100': '100',
        '200': '200',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
  corePlugins: {
    preflight: false,
  }
}
