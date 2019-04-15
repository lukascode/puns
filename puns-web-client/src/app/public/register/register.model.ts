export class PlayerRegisterRequest {

  email: string;
  nick: string;
  password: string;

  constructor(email, nick, password) {
    this.email = email;
    this.nick = nick;
    this.password = password;
  }
}
