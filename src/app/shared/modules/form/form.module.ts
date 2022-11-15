import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormComponent } from "./components/form/form.component";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [FormComponent],
  exports: [FormComponent]
})
export class FormModule {

}
