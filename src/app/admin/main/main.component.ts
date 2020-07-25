import {AfterViewInit, Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Location, PopStateEvent} from '@angular/common';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import PerfectScrollbar from 'perfect-scrollbar';
import {GlobalService} from '../../shared/global.service';
import {PlaceholderDirective} from '../../shared/placeholder.directive';
import {LogoutComponent} from '../shared/logout/logout.component';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(PlaceholderDirective, {static: true}) hostRef: PlaceholderDirective;
    eventLogoutSub: Subscription;
    private _router: Subscription;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];

    constructor(public location: Location, private router: Router,
                private componentFactoryResolver: ComponentFactoryResolver,
                private globalService: GlobalService) {
    }

    ngOnInit() {
        console.log(this.router)
        const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

        if (isWindows) {
            // if we are on windows OS we activate the perfectScrollbar function

            document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
        } else {
            document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
        }
        const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
        const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

        this.location.subscribe((ev: PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        });
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                if (event.url != this.lastPoppedUrl) {
                    this.yScrollStack.push(window.scrollY);
                }
            } else if (event instanceof NavigationEnd) {
                if (event.url == this.lastPoppedUrl) {
                    this.lastPoppedUrl = undefined;
                    window.scrollTo(0, this.yScrollStack.pop());
                } else {
                    window.scrollTo(0, 0);
                }
            }
        });
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            elemMainPanel.scrollTop = 0;
            elemSidebar.scrollTop = 0;
        });
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            let ps = new PerfectScrollbar(elemMainPanel);
            ps = new PerfectScrollbar(elemSidebar);
        }

        this.globalService.globalModel.subscribe(() => {
            const logOutComponentRef = this.componentFactoryResolver.resolveComponentFactory(LogoutComponent);
            const hostResolverRef = this.hostRef.viewContainerRef;
            hostResolverRef.clear();
            const logOutComponentListener = hostResolverRef.createComponent(logOutComponentRef);
            this.eventLogoutSub = logOutComponentListener.instance.onYes
                .subscribe(() => {
                    hostResolverRef.clear();
                });
            this.eventLogoutSub = logOutComponentListener.instance.onNo
                .subscribe(() => {
                    hostResolverRef.clear();
                });
        })
    }

    ngAfterViewInit() {
        this.runOnRouteChange();
    }

    isMap(path) {
        // var titlee = this.location.prepareExternalUrl(this.location.path());
        // titlee = titlee.slice(1);
        // if (path == titlee) {
        //     return false;
        // } else {
        //     return true;
        // }
    }

    runOnRouteChange(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
            const ps = new PerfectScrollbar(elemMainPanel);
            ps.update();
        }
    }

    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }

    ngOnDestroy(): void {
        if (this.eventLogoutSub !== null) {
            this.eventLogoutSub.unsubscribe();
        }
    }


}
