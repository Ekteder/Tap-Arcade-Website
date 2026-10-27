export const SITE_CONFIG = {
  appName: import.meta.env.VITE_APP_NAME || 'Tap Arcade',
  developerName: import.meta.env.VITE_DEVELOPER_NAME || 'Ekteder',
  packageId: import.meta.env.VITE_PACKAGE_ID || 'com.ekteder.taparcade',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0',
  minAndroidVersion: import.meta.env.VITE_MIN_ANDROID_VERSION || 'Android 8.0+ (API 26–35)',
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'afrozanarail12@gmail.com',
  privacyPolicyUpdated: import.meta.env.VITE_PRIVACY_POLICY_UPDATED || 'October 2026',
  playStoreUrl:
    import.meta.env.VITE_PLAY_STORE_URL ||
    'https://play.google.com/store/apps/details?id=com.ekteder.taparcade',
  googlePrivacyUrl:
    import.meta.env.VITE_GOOGLE_PRIVACY_URL || 'https://policies.google.com/privacy',
};
