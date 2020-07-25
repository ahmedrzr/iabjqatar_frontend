import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AdminResponse} from '../models/response.model/admin.response.model';
import {Observable} from 'rxjs';
import {UsersService} from '../main/services/users.service';

@Injectable()
export class UsersResolver implements Resolve<AdminResponse> {

    constructor(private usersService: UsersService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AdminResponse> | Promise<AdminResponse> | AdminResponse {
        return this.usersService.searchUser({search: ''}, 1);
    }
}
