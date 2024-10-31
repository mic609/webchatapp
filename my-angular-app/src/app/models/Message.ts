import { User } from "./User";

export class Message {
    id: number;
    content: string;
    timestamp: Date;
    sender: User;
    receiver: User;

    constructor(id: number, content: string, timestamp: Date, sender: User, receiver: User) {
      this.id = id;
      this.content = content;
      this.timestamp = timestamp;
      this.sender = sender;
      this.receiver = receiver;
    }
  }