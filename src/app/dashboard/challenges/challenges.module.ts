import { NgModule } from '@angular/core';
import { CdkTableModule } from '@angular/cdk';
import { CommonModule } from '@angular/common';
import {
    MdTableModule,
    MdTabsModule,
    MdPaginatorModule,
    MdSortModule,
    MdInputModule,
    MdButtonModule,
    MdChipsModule } from '@angular/material';

import { ChallengesComponent } from './challenges.component';
import { TeamChallengesComponent } from './team-challenges/team-challenges.component';
import { MyChallengesComponent } from './my-challenges/my-challenges.component';


@NgModule({
    imports: [
        CommonModule,
        CdkTableModule,
        MdTableModule,
        MdTabsModule,
        MdPaginatorModule,
        MdSortModule,
        MdInputModule,
        MdButtonModule,
        MdChipsModule
    ],
    declarations: [
        ChallengesComponent,
        TeamChallengesComponent,
        MyChallengesComponent
    ],
    exports: [ChallengesComponent]
})
export class ChallengesModule { }
