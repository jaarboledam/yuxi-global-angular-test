import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { TeamChallengeModel } from '../challenges/team-challenges/team-challenge.model';
import { MyChallengeModel } from '../challenges/my-challenges/my-challenge.model';

@Injectable()
export class DashboardService {
    private myChallenges: MyChallengeModel[];
    private teamChallenges: TeamChallengeModel[];

    private subjectMyChallenges: Subject<MyChallengeModel[]> = new Subject<MyChallengeModel[]>();
    private subjectTeamChallenges: Subject<TeamChallengeModel[]> = new Subject<TeamChallengeModel[]>();

    setMyChallenges(challenges: MyChallengeModel[]): void {
        this.myChallenges = challenges;
        this.subjectMyChallenges.next(this.myChallenges);
    }

    getMyChallenges(): Observable<MyChallengeModel[]> {
        return this.subjectMyChallenges.asObservable();
    }

    setTeamChallenges(challenges: TeamChallengeModel[]): void {
        this.teamChallenges = challenges;
        this.subjectTeamChallenges.next(this.teamChallenges);
    }

    getTeamChallenges(): Observable<TeamChallengeModel[]> {
        return this.subjectTeamChallenges.asObservable();
    }
}
