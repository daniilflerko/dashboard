import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'modal-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  constructor(private fb: FormBuilder) { }

  @Input() title: string = '';
  @Input() defaultText: string = 'Not defined';
  @Input() hasButton: boolean = false;
  @Input() buttonText: string = 'Submit';
  @Input() inputPlaceholder: string = '';
  @Input() inputType: string = 'input'; //or textarea

  @Output() handleSubmit = new EventEmitter<string>();

  isEditing: boolean = false;

  formBuilder = this.fb.group({
    title: ['']
  })

  activeEditing(): void{
    if(this.title) {
      this.formBuilder.patchValue({title: this.title})
    }
    this.isEditing = true
  }

  onSubmit(): void {
    if(this.formBuilder.value.title){
      this.handleSubmit.emit(this.formBuilder.value.title)
    }
    this.isEditing = false
    this.formBuilder.reset()
  }
}
