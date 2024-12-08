const { default: daisyui } = require('daisyui');

module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
          screens: {
              'xs': '375px', // Custom breakpoint for 375px
          },
      },
  },
    plugins: [require('daisyui')],
    daisyui:{
      themes:["light"]
    }
  };

  