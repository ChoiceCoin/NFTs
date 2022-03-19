import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import Routes from './components/routes'
import { AccountProvider } from './context/account';

const outerTheme = createTheme({
  palette: {
    secondary: {
      main: "#fff",
    },
  }
})

function App() {
  return (
    <ThemeProvider theme={outerTheme}>
      <BrowserRouter>
        <AccountProvider> 
          <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right'}}>
            <Routes />
          </SnackbarProvider>
        </AccountProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
