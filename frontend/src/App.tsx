import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { setupAxiosInterceptors } from './services/api' // Updated import
import AppRoutes from './routes/'

function App() {
  const { getToken, isLoaded } = useAuth();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      // Pass the getToken function to the API service
      // This allows axios to call it dynamically before every request
      setupAxiosInterceptors(getToken);
      setAuthReady(true);
    }
  }, [isLoaded, getToken]);

  // Show a loading spinner while we wait for auth to initialize
  if (!isLoaded || !authReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading UMission...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppRoutes />
    </>
  )
}

export default App
