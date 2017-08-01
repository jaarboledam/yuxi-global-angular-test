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
import { TeamChallengeModel } from './team-challenge.model';

@Component({
    selector: 'app-team-challenges',
    templateUrl: './team-challenges.component.html',
    styleUrls: ['./team-challenges.component.scss'],
    providers: [ ChallengesService, DashboardService ]
})
export class TeamChallengesComponent implements OnInit {

    @ViewChild(MdPaginator) paginator: MdPaginator;
    @ViewChild(MdSort) sort: MdSort;
    @ViewChild('filter') filter: ElementRef;

    displayedColumns = [
        'challengeName', 'challengeUser', 'challengeDate', 'challengeInvited', 'challengeEntries', 'challengeToReview', 'challengeActions'
    ];

    teamChallenges: TeamChallengeModel[];
    dataModel: DataModel;
    dataSource: Source | null;

    constructor(
        private _challengesService: ChallengesService,
        private _dashboardService: DashboardService
    ) { }

    ngOnInit() {
        this._challengesService.getTeamChallenges()
            .then(response => {
                this.teamChallenges = response.results;
                this._dashboardService.setTeamChallenges(this.teamChallenges);
                this.dataReady();
            });
    }

    dataReady() {
        this.dataModel = new DataModel(this.teamChallenges);
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
    challenges: TeamChallengeModel[];

    constructor(_data: TeamChallengeModel[]) {
        this.challenges = _data.slice();
        this.dataChange.next(this.challenges);
    }

    dataChange: BehaviorSubject<TeamChallengeModel[]> = new BehaviorSubject<TeamChallengeModel[]>([]);
    get data(): TeamChallengeModel[] { return this.dataChange.value; }
}

export class Source extends DataSource<any> {
    _filterChange = new BehaviorSubject('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }

    constructor(private _dataModel: DataModel, private _paginator: MdPaginator, private _sort: MdSort) {
        super();
    }

    connect(): Observable<TeamChallengeModel[]> {
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

    getSortedData(): TeamChallengeModel[] {
        const data = this._dataModel.data.slice().filter((item: TeamChallengeModel) => {
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
                case 'challengeDate': [propertyA, propertyB] = [a.modifiedDate, b.modifiedDate]; break;
                case 'challengeInvited': [propertyA, propertyB] = [a.numberInvited, b.numberInvited]; break;
                case 'challengeEntries': [propertyA, propertyB] = [a.numberOfEntries, b.numberOfEntries]; break;
                case 'challengeToReview': [propertyA, propertyB] = [a.numberToReview, b.numberToReview]; break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }

    disconnect() { }
}

// TODO: add ellipsis button functionality
// TODO: get real data length for paginator
