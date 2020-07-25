import {User} from '../data.model/user.model';

export interface UserSearchResponseModel {
    hasNext: Boolean;
    hasPrev: Boolean;
    itemCount: number;
    next: number;
    page: number;
    pageCounter: number;
    perPage: number
    prev: number;
    totalPages: number;
    users: User[];
}
