import { ClerkProvider } from '@clerk/clerk-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { env } from './config/env'
import './index.css'

// Validation: Ensure critical environment variables are present
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