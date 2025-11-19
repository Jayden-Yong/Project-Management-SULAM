interface EnvConfig {
    apiUrl: string;
    appName: string;
    appVersion: string;
    clerkPublishableKey: string;
    environment: string;
}

// env parsers
function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key]
  
  if (value === undefined || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    console.warn(`Environment variable ${key} is not set`)
    return ''
  }
  
  return value
}

function getEnvBool(key: string, defaultValue: boolean = false): boolean {
  const value = import.meta.env[key]
  
  if (value === undefined || value === '') {
    return defaultValue
  }
  
  return value === 'true' || value === '1'
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = import.meta.env[key]
  
  if (value === undefined || value === '') {
    return defaultValue
  }
  
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

export const env: EnvConfig = {
    apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:8000'),
    appName: getEnvVar('VITE_APP_NAME', 'MyApp'),
    appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
    clerkPublishableKey: getEnvVar('VITE_CLERK_PUBLISHABLE_KEY', ''),
    environment: getEnvVar('MODE', 'development'),
}

export const {
    apiUrl,
    appName,
    appVersion,
    clerkPublishableKey,
    environment
} = env