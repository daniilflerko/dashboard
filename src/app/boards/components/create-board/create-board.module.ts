import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FocusDirective } from "src/app/directives/focus.directive";
import { CreateBoardComponent } from "./create-board.component";


@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [CreateBoardComponent, FocusDirective],
  exports: [CreateBoardComponent]
})
export class CreateBoardModule {

}
