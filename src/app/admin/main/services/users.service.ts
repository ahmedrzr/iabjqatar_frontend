import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AdminResponse} from '../../models/response.model/admin.response.model';

@Injectable()
export class UsersService {
    private enrollUserUrl = '/api/user/register';
    private usersUrl = '/api/users/all';
    private userActivateUrl = '/api/user/activate';
    private userDeleteUrl = '/api/user/user_delete';
    private userById = '/api/users/user';
    private updateUserUrl = '/api/users/user/update';
    private searchUsersUrl = '/api/users/search';

    constructor(private http: HttpClient) {
    }

    // SEARCH USERS
    searchUser(searchObj: any, page: number) {
        searchObj.page = page;
        return this.http.post<AdminResponse>(environment.BASE_URL + this.searchUsersUrl, searchObj);
    }

    // ACTIVATE/DEACTIVATE USER
    changeUserState(id: string, isActivate: Boolean) {
        const state = isActivate ? 1 : 0;
        return this.http.post<AdminResponse>(environment.BASE_URL + this.userActivateUrl, {id: id, status: state});
    }

    // GET USER BY ID TO EDIT
    getUserById(id: string) {
        return this.http.post<AdminResponse>(environment.BASE_URL + this.userById, {id: id});
    }

    // ENROLL USER
    enrollUser(enrollUserRequest: any) {
        return this.http.post<AdminResponse>(environment.BASE_URL + this.enrollUserUrl, enrollUserRequest,
            {
                reportProgress: true,
                observe: 'events'
            }
        )
    }

    // UPDATE USER
    updateUser(update: any) {
        return this.http.post<AdminResponse>(environment.BASE_URL + this.updateUserUrl, update,
            {
                reportProgress: true,
                observe: 'events'
            });
    }
}
