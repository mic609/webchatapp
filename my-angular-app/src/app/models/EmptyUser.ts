import { Authority } from "./Authority";
import { User } from "./User";

export const EMPTY_USER: User = {
    id: -1,
    username: 'guest',
    password: '',
    enabled: false,
    authorities: []
};
