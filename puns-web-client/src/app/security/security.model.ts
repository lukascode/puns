
export class UserCredentials {

    nick: string;
    password: string;

    constructor(nick, password) {
        this.nick = nick;
        this.password = password;
    }

}

export class ChangePassRequest {
  oldPass: string;
  newPass: string;

  constructor(oldPass, newPass) {
    this.oldPass = oldPass;
    this.newPass = newPass;
  }
}

export class AccessTokenResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    jti: string;
}
