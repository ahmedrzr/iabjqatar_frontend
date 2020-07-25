import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {range} from 'rxjs';
import {toArray} from 'rxjs/operators';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
    @Input('dataSize') dataLength = 0;
    @Input('pageCounts') pageCounts = 0;
    @Input('hasPrev') hasPrev = false;
    @Input('hasNext') hasNext = false;
    @Input('pageCountArray') pageCountArray: Array<number> = [];
    @Input('currentActivePage') currentActivePage = 1;
    @Output('onNext') onNextEmitter = new EventEmitter<number>();
    @Output('onPrev') onPrevEmitter = new EventEmitter<number>();
    @Output('onSelectPage') onSelectPageEmitter = new EventEmitter<number>();

    constructor() {
    }

    ngOnInit(): void {
    }

    onSelectNext() {
        if (this.hasNext) {
            this.onNextEmitter.emit(this.currentActivePage + 1);
        }
    }


    onSelectPage(page: number) {
        this.onSelectPageEmitter.emit(page);
    }

    onSelectPrev() {
        if (this.hasPrev) {
            this.onPrevEmitter.emit(this.currentActivePage - 1);
        }
    }


    onGeneratePagination() {
        if (this.pageCounts > 3) {
            range(this.currentActivePage, 3)
                .pipe(toArray()).subscribe(values => {
                console.log(values)
                if ((values.indexOf(this.pageCounts)) < 0) {
                    this.pageCountArray = values;
                } else {
                    if (this.pageCountArray.indexOf(this.pageCounts) === -1) {
                        this.pageCountArray = values;
                    }
                }
            });
        } else if (this.pageCounts < 4) {
            range(this.currentActivePage, this.pageCounts)
                .pipe(toArray()).subscribe(values => {
                this.pageCountArray = values;
            });
        }
    }

}
