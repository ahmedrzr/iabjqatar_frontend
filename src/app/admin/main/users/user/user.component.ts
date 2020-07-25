import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {User} from '../../../models/data.model/user.model';
import {UsersService} from '../../services/users.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    @ViewChild('userStatus', {read: ElementRef}) userStatus: ElementRef;
    @Input() users: User[] = [];
    BASE_UTL = environment.BASE_URL;

    constructor(private usersService: UsersService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
    }

    getAvatar(path: string) {
        return this.BASE_UTL + path;
    }

    isStatusChanged(id: string, prevStatus: number) {
        const status = (prevStatus !== 0);
        if (status !== this.userStatus.nativeElement.checked) {
            this.usersService.changeUserState(id, this.userStatus.nativeElement.checked)
                .subscribe(response => {
                    if (response.success) {
                        console.log('STATUS CHANGED');
                    } else {
                        console.log('NOT CHANGED ERROR');
                    }
                }, error => {
                    console.log('ERROR')
                })
        }
    }

    onEditUser(id: string) {
        this.router.navigate(['../', 'edit', id], {relativeTo: this.activatedRoute}).then(r => {
        })
    }

    onDelete() {
    }

}
