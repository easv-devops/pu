import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ExpensecardComponent} from "./expensecard/expensecard.component";
import {IonicModule} from "@ionic/angular";
import {CreateexpenseComponent} from "./createexpense/createexpense.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SettleComponent} from "./settle/settle.component";
import {GroupModule} from "../group/group.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    ExpensecardComponent,
    CreateexpenseComponent,
    SettleComponent
  ],
  exports: [
    ExpensecardComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ExpenseModule { }
