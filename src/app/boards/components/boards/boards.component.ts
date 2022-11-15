import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoardsService } from 'src/app/shared/services/boards.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { BoardInterface } from 'src/app/shared/types/board.interface';


@Component({
  selector: 'boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit{
  boards: BoardInterface[] = [];
  filter =''
  constructor(private boardsService: BoardsService, public modalService: ModalService){}

  ngOnInit(): void {
    this.boardsService.getBoards().subscribe((boards) => {
      this.boards = boards;
      console.log('boards:', boards)
    })
  }


  createBoard(title: string, description: string): void {
    console.log('title of current board:', title)
    console.log('description of board:', description)

    this.boardsService.createBoard(title, description).subscribe(createdBoard => {
      this.boards = [...this.boards, createdBoard];
      this.modalService.close()
    })
  }


}
