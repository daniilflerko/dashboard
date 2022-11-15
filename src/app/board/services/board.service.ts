import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { BoardInterface } from "src/app/shared/types/board.interface";
import { ColumnInterface } from "src/app/shared/types/column.interface";
import { TaskInterface } from "src/app/shared/types/task.interface";

@Injectable()
export class BoardService{
  constructor(){}
  board$ = new BehaviorSubject<BoardInterface | null>(null)
  columns$ = new BehaviorSubject<ColumnInterface[]>([])
  tasks$ = new BehaviorSubject<TaskInterface[]>([])

  setBoard(board: BoardInterface): void {
    this.board$.next(board)
  }

  setColumns(columns: ColumnInterface[]): void {
      this.columns$.next(columns);
  }

  addColumn(column: ColumnInterface){
    const updatedColumns = [...this.columns$.getValue(), column];
    this.columns$.next(updatedColumns);
  }

  setTasks(tasks: TaskInterface[]): void {
    this.tasks$.next(tasks)
  }

  addTask(task: TaskInterface): void {
    const updatedTasks = [...this.tasks$.getValue(), task]
    this.tasks$.next(updatedTasks)
  }


  leaveBoard(boardId: string): void {
    this.board$.next(null)
  }

  updateBoard(updatedBoard: BoardInterface): void {
    const board = this.board$.getValue()
    if(!board){
      throw new Error('board is null')
    }
    this.board$.next({...board, title: updatedBoard.title})
  }

  deleteColumn(columnId: string): void{
    const updatedColumns = this.columns$.getValue().filter(column => column.id !== columnId)
    this.columns$.next(updatedColumns)
  }

  deleteTask(taskId: string): void {
    const updatedTasks = this.tasks$.getValue().filter(task => task.id !== taskId)
    this.tasks$.next(updatedTasks)
  }

  // updateTask(updatedTask: TaskInterface): void {
  //   const updatedTasks = this.tasks$.getValue().map(task => {
  //     if(task.id === updatedTask.id){
  //       return { ...task, title: updatedTask.title, description: updatedTask.description, columnId: updatedTask.columnId }
  //     }
  //     return task
  //   })

  //   this.tasks$.next(updatedTasks)
  // }
}
