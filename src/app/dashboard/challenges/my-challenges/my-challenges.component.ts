import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataSource } from '@angular/cdk';
import { MdPaginator, MdSort } from '@angular/material';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

import { DashboardService } from '../../shared/dashboard.service';
import { ChallengesService } from '../shared/challenges.service';
import { MyChallengeModel } from './my-challenge.model';

@Component({
    selector: 'app-my-challenges',
    templateUrl: './my-challenges.component.html',
    styleUrls: ['./my-challenges.component.scss'],
    providers: [ ChallengesService, DashboardService ]
})
export class MyChallengesComponent implements OnInit {

    @ViewChild(MdPaginator) paginator: MdPaginator;
    @ViewChild(MdSort) sort: MdSort;
    @ViewChild('filter') filter: ElementRef;

    displayedColumns = [
        'challengeName', 'challengeUser', 'challengeScore', 'challengeInvitedDate', 'challengeCompletedDate'
    ];

    myChallenges: MyChallengeModel[];
    dataModel: DataModel;
    dataSource: Source | null;

    constructor(
        private _challengesService: ChallengesService,
        private _dashboardService: DashboardService
    ) { }

    ngOnInit() {
        this._challengesService.getMyChallenges()
            .then(response => {
                this.myChallenges = response.results.map((item): MyChallengeModel => {
                    return new MyChallengeModel({
                        name: item.challengeName,
                        userFullName: item.challengerFirstName + ' ' + item.challengerLastName,
                        modifiedDate: item.modifiedDate,
                        id: item.id,
                        overallScore: item.overallScore,
                        completedDate: item.completedDate
                    });
                });

                this._dashboardService.setMyChallenges(this.myChallenges);
                this.dataReady();
            });
    }

    dataReady() {
        this.dataModel = new DataModel(this.myChallenges);
        this.dataSource = new Source(this.dataModel, this.paginator, this.sort);

        Observable.fromEvent(this.filter.nativeElement, 'keyup')
            .debounceTime(150)
            .distinctUntilChanged()
            .subscribe(() => {
                if (!this.dataSource) { return; }
                this.dataSource.filter = this.filter.nativeElement.value;
            });
    }

}

export class DataModel {
    challenges: MyChallengeModel[];

    constructor(_data: MyChallengeModel[]) {
        this.challenges = _data.slice();
        this.dataChange.next(this.challenges);
    }

    dataChange: BehaviorSubject<MyChallengeModel[]> = new BehaviorSubject<MyChallengeModel[]>([]);
    get data(): MyChallengeModel[] { return this.dataChange.value; }
}

export class Source extends DataSource<any> {
    _filterChange = new BehaviorSubject('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }

    constructor(private _dataModel: DataModel, private _paginator: MdPaginator, private _sort: MdSort) {
        super();
    }

    connect(): Observable<MyChallengeModel[]> {
        const displayDataChanges = [
            this._dataModel.dataChange,
            this._paginator.page,
            this._sort.mdSortChange,
            this._filterChange,
        ];

        return Observable.merge(...displayDataChanges).map(() => {
            const data = this.getSortedData();

            const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
            return data.splice(startIndex, this._paginator.pageSize);
        });
    }

    getSortedData(): MyChallengeModel[] {
        const data = this._dataModel.data.slice().filter((item: MyChallengeModel) => {
            const searchStr = (item.name + item.userFullName).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });

        if (!this._sort.active || this._sort.direction === '') { return data; }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sort.active) {
                case 'challengeName': [propertyA, propertyB] = [a.name, b.name]; break;
                case 'challengeUser': [propertyA, propertyB] = [a.userFullName, b.userFullName]; break;
                case 'challengeScore': [propertyA, propertyB] = [a.overallScore, b.overallScore]; break;
                case 'challengeInvitedDate': [propertyA, propertyB] = [a.modifiedDate, b.modifiedDate]; break;
                case 'challengeCompletedDate': [propertyA, propertyB] = [a.completedDate, b.completedDate]; break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }

    disconnect() { }
}
