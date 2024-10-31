import { User } from "./User";

export class Authority {
    id: number;
    username: string;
    authority: string;
    user: User;

    constructor(id: number, username: string, authority: string, user: User) {
      this.id = id;
      this.username = username;
      this.user = user;
      this.authority = authority;
    }
  }