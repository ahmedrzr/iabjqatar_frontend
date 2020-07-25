export interface User {
    activated: number;
    avatar: string;
    _id: string;
    email: string;
    name: string;
    password: string;
    user_type: {
        _id: string;
        group_name: string;
        groups_default: Boolean;
        group_modules: []
    }
}
