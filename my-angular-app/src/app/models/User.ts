import { Authority } from "./Authority";

export class User {
    id: number;
    username: string;
    password: string;
    enabled: boolean;
    authorities: Authority[];
  
    constructor(id: number, username: string, password: string, enabled: boolean, authorities: Authority[]) {
      this.id = id;
      this.username = username;
      this.password = password;
      this.enabled = enabled;
      this.authorities = authorities;
    }
  }