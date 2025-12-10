import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { setAuthToken } from './services/api'
import AppRoutes from './routes/'

function App() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const setupToken = async () => {
      if (isSignedIn) {
        const token = await getToken();
        setAuthToken(token);
      } else {
        setAuthToken(null);
      }
    };
    setupToken();
  }, [isSignedIn, getToken]);

  return (
    <>
      <AppRoutes />
    </>
  )
}

export default App