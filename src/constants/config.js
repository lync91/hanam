const isDevEnv = process.env.NODE_ENV === 'development';

export default {
  // App Details
  appName: 'ReactNativeExpoStarterKit',

  // Build Configuration - eg. Debug or Release?
  isDevEnv,

  // Date Format
  dateFormat: 'Do MMM YYYY',

  // API
  apiBaseUrl: isDevEnv
    ? 'https://dogohanam.net/wp-json'
    : 'https://dogohanam.net/wp-json',
  WCapiBaseUrl: isDevEnv
    ? 'https://dogohanam.net/wp-json/wc'
    : 'https://dogohanam.net/wp-json/wc',
  WCKey: {
      username: "ck_8bdca0f0c1fb387b8b143cf6022d4b4146bd4a02",  //This could be your email
      password: "cs_352713eacaf8172fc6388ebaa3a8e05b072a8a34"
    },
  // Google Analytics - uses a 'dev' account while we're testing
  gaTrackingId: isDevEnv ? 'UA-84284256-2' : 'UA-84284256-1',
};
