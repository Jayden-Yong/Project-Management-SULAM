import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { env } from './config/env'
import './index.css'
import App from './App'

// check if clerk key is set
if (!env.clerkPublishableKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in environment')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={env.clerkPublishableKey}
      afterSignOutUrl="/"
    >
        <App />
    </ClerkProvider>
  </StrictMode>,
)