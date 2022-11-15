import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modal.service';
import { BoardsComponent } from '../boards/boards.component';

@Component({
  selector: 'create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.scss']
})
export class CreateBoardComponent implements OnInit {
  constructor(private boardsComponent: BoardsComponent, private modalService: ModalService){}

  form = new FormGroup({
    title: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(4)
    ]),
    description: new FormControl<string>('',[
      Validators.required
    ])
  })
  ngOnInit(): void {


  }

  submit(){
    if(this.form.value.title?.length === 1 || this.form.value.title?.length === 2 || this.form.value.title?.length === 3 || !this.form.value.title){
      return
    }
    console.log(this.form.value)
    this.boardsComponent.createBoard(this.form.value.title as string, this.form.value.description as string)
  }

  get title(){
    return this.form.controls.title as FormControl
  }
}
