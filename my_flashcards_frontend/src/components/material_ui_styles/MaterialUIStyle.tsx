import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-input': {
            color: 'white', // Zmiana koloru czcionki na biały
          },
        },
      },
    },
  },
});
export default theme
