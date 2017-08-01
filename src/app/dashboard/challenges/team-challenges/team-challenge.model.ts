import { ChallengeModel } from '../shared/challenge.model';

export class TeamChallengeModel extends ChallengeModel {
    id: number;
    numberInvited: number;
    numberOfEntries: number;
    numberToReview: number;
}
