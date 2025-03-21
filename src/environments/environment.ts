// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  url: 'http://localhost:49730/',
  api_url: 'https://localhost:7024/api/',
  production: false,
  googleClientID: '280034515082-b648p37avjlb8n16jjci95ghuge7rra0.apps.googleusercontent.com',
  googleClientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  googleRedirectUrl: 'http://localhost:49730/auth/callback',
  gmailApiUrl: 'https://gmail.googleapis.com'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
