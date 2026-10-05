const appConfig = require("./app.json").expo;
const iosUrlScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME;
const googleServicesFile = process.env.GOOGLE_SERVICES_FILE;
const googleServiceInfoFile = process.env.IOS_GOOGLE_SERVICES_FILE;

module.exports = {
  ...appConfig,
  android: {
    ...appConfig.android,
    ...(googleServicesFile ? { googleServicesFile } : {}),
  },
  ios: {
    ...appConfig.ios,
    ...(googleServiceInfoFile ? { googleServicesFile: googleServiceInfoFile } : {}),
  },
  plugins: iosUrlScheme
    ? [["@react-native-google-signin/google-signin", { iosUrlScheme }]]
    : [],
};