import { ChallengeModel } from '../shared/challenge.model';

export class MyChallengeModel extends ChallengeModel {
    id: number;
    overallScore: number;
    completedDate: string;

    constructor(object: any) {
        super();
        this.name = object.name;
        this.userFullName = object.userFullName;
        this.modifiedDate = object.modifiedDate;
        this.id = object.id;
        this.overallScore = object.overallScore;
        this.completedDate = object.completedDate;
    }
}
