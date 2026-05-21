import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eduhub.app',
  appName: 'EDUHUB',
  webDir: 'out',
  server: {
    // For development — point to your live server
    // Remove this for production builds
    url: 'http://192.168.1.100:3000',  // Replace with your PC's local IP
    cleartext: true,
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#030712',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#030712',
      showSpinner: false,
    },
  },
  android: {
    backgroundColor: '#030712',
    allowMixedContent: true,
  },
  ios: {
    backgroundColor: '#030712',
    contentInset: 'automatic',
  },
};

export default config;
