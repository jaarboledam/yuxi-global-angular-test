import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ChallengesService {

    constructor(private _http: Http) {}

    getTeamChallenges(): Promise<any> {
        return this._http.get('/assets/fake-data/TeamChallenges.json')
            .toPromise()
            .then((response: Response) => response.json())
            .catch((err: any) => Promise.reject(err.message || err));
    }

    getMyChallenges(): Promise<any> {
        return this._http.get('/assets/fake-data/MyChallenges.json')
            .toPromise()
            .then((response: Response) => response.json())
            .catch((err: any) => Promise.reject(err.message || err));
    }
}
