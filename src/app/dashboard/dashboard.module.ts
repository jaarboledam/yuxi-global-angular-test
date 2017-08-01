import { NgModule } from '@angular/core';
import { MdCardModule } from '@angular/material';

import { DashboardComponent } from './dashboard.component';
import { SummaryComponent } from './summary/summary.component';
import { ChallengesModule } from './challenges/challenges.module';

@NgModule({
    imports: [
        MdCardModule,
        ChallengesModule
    ],
    declarations: [
        DashboardComponent,
        SummaryComponent
    ],
    exports: [DashboardComponent]
})
export class DashboardModule { }
