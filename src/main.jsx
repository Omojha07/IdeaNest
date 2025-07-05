import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { shadesOfPurple } from '@clerk/themes'
import ContextProvider from '../src/pages/AI-Mentor/context/Context.jsx'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider
      appearance={{
        baseTheme: shadesOfPurple
      }}
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl='/'
    >
      <ContextProvider>
        <App />
      </ContextProvider>
    </ClerkProvider>
  </React.StrictMode>
)
