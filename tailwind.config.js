// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'color-custom-foreground': 'var(--color-custom-foreground)',
        'color-custom': 'var(--color-custom)',
        'color-custom-gray': 'var(--color-custom-gray)',
        'color-custom-green': 'var(--color-custom-green)',
      },
      
    },
  },
  
};
