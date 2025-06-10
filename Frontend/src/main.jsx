import { Children, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './app/store.js'
import { Toaster } from "./components/ui/sonner"
import { ThemeProvider } from "next-themes"
import { useLoadUserQuery } from './features/api/authapi'
import LoadingSpinner from './components/ui/LoadingSpinner'

const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();
  return <>{isLoading ? <LoadingSpinner/> : <>{children}</>}</>;
};
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider store={store}> 
      <Custom>
        <App />
        <Toaster />
      </Custom>
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
