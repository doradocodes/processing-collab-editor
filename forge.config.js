require('dotenv').config();

const path = require('node:path');
const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: {
      unpack: '**/tools/**',  // Unpack the /tools directory
    },
    extraResource: [
      "./tools",
    ],
    osxSign: {
      hardenedRuntime: true,
      entitlements: 'entitlements.mac.plist',
      'entitlements-inherit': 'entitlements.mac.inherit.plist',
      'signature-flags': 'library',
      identity: process.env.APPLE_DEVELOPER_IDENTITY,
      'gatekeeper-assess': false,
      'pre-auto-entitlements': true,
      'deep': true,
    },
    extendInfo: {
      "NSDocumentsFolderUsageDescription": "We need access to your Documents folder to store your files."
    },
    osxNotarize: {
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID
    },
    appBundleId: "com.doradocodes.pce",
    icon: path.resolve(__dirname, 'assets/Processing_2021_logo_512x512.icns')
  },
  makers: [
    // Maker for Windows (.exe)
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'processing-collaborative-editor',
        setupIcon: './assets/Processing_2021_logo_512x512.ico'  // You can add an .ico file for Windows installer
      },
    },
    // Maker for Windows (.zip)
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux', 'win32'], // Add 'win32' for Windows builds
    },
    // Maker for Linux (.deb)
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'Your Name',
          homepage: 'https://yourwebsite.com',
        },
      },
    },
    // Maker for Linux (.rpm)
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          name: 'processing-collaborative-editor',
        },
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
