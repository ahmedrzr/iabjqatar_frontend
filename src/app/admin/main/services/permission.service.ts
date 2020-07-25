import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AdminResponse} from '../../models/response.model/admin.response.model';
import {environment} from '../../../../environments/environment';

@Injectable()
export class PermissionService {
    private groupRegistrationUrl = '/api/group/register';
    private registeredGroupsUrl = '/api/group/all';

    constructor(private http: HttpClient) {
    }

    // REGISTER NEW GROUP
    registerGroup(groupName: string) {
        return this.http.post<AdminResponse>(environment.BASE_URL + this.groupRegistrationUrl, groupName,
            {}
        )
    }

    // GET ALL REGISTERED GROUPS
    getRegisteredGroups() {
        return this.http.get<AdminResponse>(environment.BASE_URL + this.registeredGroupsUrl);
    }

}
