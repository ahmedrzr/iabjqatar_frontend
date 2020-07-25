import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AdminResponse} from '../models/response.model/admin.response.model';
import {Observable} from 'rxjs';
import {UsersService} from '../main/services/users.service';
import {PermissionService} from '../main/services/permission.service';

@Injectable()
export class UserTypesResolver implements Resolve<AdminResponse> {
    constructor(private groupService: PermissionService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AdminResponse> | Promise<AdminResponse> | AdminResponse {
        return this.groupService.getRegisteredGroups();
    }

}
