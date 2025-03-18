import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://accounts.google.com',
  // strict discovery document disallows urls which not start with issuers url
  strictDiscoveryDocumentValidation: false,
  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin,
  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: environment.googleClientID,
  // set the scope for the permissions the client should request
  scope: 'https://mail.google.com/',

  showDebugInformation: true,
};

export interface UserInfo {
  info: {
    sub: string
    email: string,
    name: string,
    picture: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  id_token = '';
  userProfileSubject = new Subject<UserInfo>()

  constructor(private readonly oAuthService: OAuthService, private readonly httpClient: HttpClient) {
    // configure oauth2 service
    oAuthService.configure(authCodeFlowConfig);
    // manually configure a logout url, because googles discovery document does not provide it
    oAuthService.logoutUrl = "https://www.google.com/accounts/Logout";
    // loading the discovery document from google, which contains all relevant URL for
    // the OAuth flow, e.g. login url
    oAuthService.loadDiscoveryDocument().then( () => {
      // This method just tries to parse the token(s) within the url when
      // the auth-server redirects the user back to the web-app
      // It doesn't send the user the the login page
      this.id_token = oAuthService.getIdToken();
      oAuthService.tryLoginImplicitFlow().then( () => {
        // when not logged in, redirecvt to google for login
        // else load user profile
        if (!oAuthService.hasValidAccessToken()) {
          oAuthService.initLoginFlow()
        } else {
          oAuthService.loadUserProfile().then( (userProfile) => {

            this.userProfileSubject.next(userProfile as UserInfo)
          })
        }

      })
    });
  }

  getEmailsByAPI(userId : string): Observable<any>{
    return this.httpClient.get(`${environment.api_url}gmail/GetMailList/${userId}`, { headers: this.authHeader() })
  }

  emails(userId: string): Observable<any> {
    return this.httpClient.get(`${environment.gmailApiUrl}/gmail/v1/users/${userId}/messages`, { headers: this.authHeader() })
  }

  getMail(userId: string, mailId: string): Observable<any> {
    return this.httpClient.get(`${environment.gmailApiUrl}/gmail/v1/users/${userId}/messages/${mailId}`, { headers: this.authHeader() })
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken()
  }

  signOut() {
    this.oAuthService.logOut()
  }

  private authHeader() : HttpHeaders {
    return new HttpHeaders ({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
    })
  }
}
