import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Params, Resolve, RouterStateSnapshot} from '@angular/router';
import {AdminResponse} from '../models/response.model/admin.response.model';
import {concat, forkJoin, Observable} from 'rxjs';
import {UsersService} from '../main/services/users.service';
import {PermissionService} from '../main/services/permission.service';
import {map} from 'rxjs/operators';

@Injectable()
export class UserResolver implements Resolve<any> {
    constructor(private usersService: UsersService,
                private permissionService: PermissionService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        const user = this.usersService.getUserById(route.params['id']);
        const groups = this.permissionService.getRegisteredGroups();

        return forkJoin([
            user,
            groups
        ]).pipe(map(result => {
            return {
                user: result[0],
                groups: result[1]
            };
        }));
    }

}
