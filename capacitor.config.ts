import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lalit.privatenotesvault',
  appName: 'Private Notes Vault',
  webDir: '.output/public',
  server: {
    androidScheme: 'https'
  }
};

export default config;