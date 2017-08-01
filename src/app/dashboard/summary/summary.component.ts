import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../shared/dashboard.service';
import { TeamChallengeModel } from '../challenges/team-challenges/team-challenge.model';
import { MyChallengeModel } from '../challenges/my-challenges/my-challenge.model';

@Component({
    selector: 'app-dashboard-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
    providers: [ DashboardService ]
})
export class SummaryComponent implements OnInit {

    constructor(private _dashboardService: DashboardService) {
        this._dashboardService.getMyChallenges().subscribe((myChallenges: MyChallengeModel[]) => {
            console.log(myChallenges);
        });

        this._dashboardService.getTeamChallenges().subscribe((teamChallenges: TeamChallengeModel[]) => {
            console.log(teamChallenges);
        });
    }

    ngOnInit() {
    }

}
