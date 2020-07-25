import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UsersService} from '../../services/users.service';
import {AdminResponse} from '../../../models/response.model/admin.response.model';
import {UserSearchResponseModel} from '../../../models/response.model/UserSearch.Response.model';
import {User} from '../../../models/data.model/user.model';
import {range} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, tap, toArray} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
    searchForm: FormGroup;
    searchField: FormControl;
    users: User[] = [];
    pageCounts = 0;
    pageCountArray: Array<number> = [];
    currentActivePage = 0;
    hasNext: Boolean = false;
    hasPrev: Boolean = false;

    constructor(private fb: FormBuilder,
                private usersService: UsersService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
        this.searchField = new FormControl();
        this.searchForm = fb.group({search: this.searchField});
    }

    ngOnInit(): void {
        this.onSearch();
        this.activatedRoute.data.subscribe(usersResponse => {
            this.responseHandler(usersResponse.users);
        }, error => {
            console.log('ERROR');
        })
    }

    onSubmitSearch() {
        this.getSearchFilter()
            .then(filter => {
                this.getUsers(filter, 1)
            })
    }


    getUsers(searchFilter, page) {
        this.usersService.searchUser(searchFilter, page)
            .subscribe(response => {
                this.responseHandler(response);
            }, error => {
                console.log('ERROR :-) ' + error)
            })
    }

    onSelectPage(page) {
        this.getSearchFilter()
            .then(filter => {
                this.getUsers(filter, page)
            })

    }

    onSelectNext(page: number) {
        if (this.hasNext) {
            this.getSearchFilter()
                .then(filter => {
                    this.getUsers(filter, page)
                })
        }
    }

    onSelectPrev(page: number) {
        if (this.hasPrev) {
            this.getSearchFilter()
                .then(filter => {
                    this.getUsers(filter, page)
                })
        }
    }

    getSearchFilter() {
        return new Promise((resolve, reject) => {
            if (this.searchForm.get('search').value == null) {
                resolve({search: ''})
            } else {
                resolve(this.searchForm.value);
            }
        })
    }

    onSearch() {
        this.searchField.valueChanges
            .pipe(tap(value => console.log(this.searchForm.value)))
            .pipe(debounceTime(500),
                distinctUntilChanged(),
                switchMap(term => this.usersService.searchUser(this.searchForm.value, 1))
            ).subscribe((response => {
            this.responseHandler(response);
        }))
    }

    responseHandler(response: AdminResponse) {
        if (response.success) {
            const res = <UserSearchResponseModel>response.result;
            this.users = <User[]>response.result.users;
            this.pageCounts = res.totalPages;
            this.currentActivePage = res.page;
            this.hasNext = res.hasNext;
            this.hasPrev = res.hasPrev;
            this.onGeneratePagination();
        } else {
            console.log('ERROR ' + response.code)
        }
    }

    onGeneratePagination() {
        range(1, this.pageCounts)
            .pipe(toArray()).subscribe(values => {
            this.pageCountArray = values;
        });
    }

    onEnrollUser() {
        this.router.navigate(['../', 'enroll'], {relativeTo: this.activatedRoute}).then(r => {
        });
    }
}
