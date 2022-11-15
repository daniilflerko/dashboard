import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { combineLatest, filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { BoardsService } from 'src/app/shared/services/boards.service';
import { ColumnsService } from 'src/app/shared/services/columns.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { TasksService } from 'src/app/shared/services/tasks.service';
import { BoardInterface } from 'src/app/shared/types/board.interface';
import { ColumnInterface } from 'src/app/shared/types/column.interface';
import { ColumnFormInterface } from 'src/app/shared/types/columnForm.interface';
import { SocketEventsEnum } from 'src/app/shared/types/socketEvents.enum';
import { TaskInterface } from 'src/app/shared/types/task.interface';
import { TaskFormInterface } from 'src/app/shared/types/taskForm.interface';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy{
  boardId: string
  filterTask =''
  data$: Observable<{
    board: BoardInterface;
    columns: ColumnInterface[];
    tasks: TaskInterface[]
  }>

  unSub$ = new Subject<void>()

  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private boardService: BoardService,
    private router: Router,
    private columnsService: ColumnsService,
    private socketService: SocketService,
    private tasksService: TasksService
    )
  {
    const boardId = this.route.snapshot.paramMap.get('boardId')

    if(!boardId){
      throw new Error('Cant fetch a board id')
    }

    this.boardId = boardId

    this.data$ = combineLatest([

      this.boardService.board$.pipe(filter(Boolean)),
      this.boardService.columns$,
      this.boardService.tasks$

    ]).pipe(map(([board, columns, tasks]) => ({board, columns, tasks})))
  }


  ngOnDestroy(): void {
    this.unSub$.next()
    this.unSub$.complete()
  }

  ngOnInit(): void {
    this.socketService.emit(SocketEventsEnum.boardsJoin, {
      boardId: this.boardId,
    });
    this.fetchData();
    this.initializeListeners();
  }

  initializeListeners(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && !event.url.includes('/boards/')) {
        this.boardService.leaveBoard(this.boardId);
      }
    });

    this.socketService
      .listen<ColumnInterface>(SocketEventsEnum.columnsCreated).pipe(takeUntil(this.unSub$))
      .subscribe((column) => {
        this.boardService.addColumn(column);
      });


    this.socketService
      .listen<BoardInterface>(SocketEventsEnum.boardsUpdated).pipe(takeUntil(this.unSub$))
      .subscribe((updatedBoard) => {
        this.boardService.updateBoard(updatedBoard);
      });


    this.socketService
      .listen<TaskInterface>(SocketEventsEnum.tasksCreated).pipe(takeUntil(this.unSub$))
      .subscribe((task) => {
        this.boardService.addTask(task);
      });

    this.socketService
      .listen<void>(SocketEventsEnum.boardsDeleted).pipe(takeUntil(this.unSub$))
      .subscribe(() => {
        this.router.navigateByUrl('/boards')
      });

    this.socketService
      .listen<string>(SocketEventsEnum.columnsDeleted).pipe(takeUntil(this.unSub$))
      .subscribe((columnId) => {
        this.boardService.deleteColumn(columnId);
      });

      this.socketService
      .listen<string>(SocketEventsEnum.tasksDeleted).pipe(takeUntil(this.unSub$))
      .subscribe((taskId) => {
        this.boardService.deleteTask(taskId);
      });

      // this.socketService
      // .listen<TaskInterface>(SocketEventsEnum.tasksUpdated).pipe(takeUntil(this.unSub$))
      // .subscribe((updatedTask) => {
      //   this.boardService.updateTask(updatedTask);
      // });
  }



  fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe((board) => {
      this.boardService.setBoard(board);
    });
    this.columnsService.getColumns(this.boardId).subscribe((columns) => {
      this.boardService.setColumns(columns);
    });
    this.tasksService.getTasks(this.boardId).subscribe((tasks) => {
      this.boardService.setTasks(tasks);
    });

  }

  createColumn(title: string): void {
      const columnForm: ColumnFormInterface = {
        title,
        boardId: this.boardId,
      };

      this.columnsService.createColumn(columnForm);
  }

  getTasks(columnId: string, tasks: TaskInterface[]): TaskInterface[] {
    return tasks.filter((task) => task.columnId === columnId);
  }


  createTask(title: string, columnId: string): void {
    const taskForm: TaskFormInterface = {
      title,
      boardId: this.boardId,
      columnId
    };
    this.tasksService.createTask(taskForm);
  }

  openTask(taskId: string): void {
    this.router.navigate(['boards', this.boardId, 'tasks', taskId])
  }

  updateBoardTitle(boardTitle: string): void {
    this.boardsService.updateBoard(this.boardId, {title: boardTitle})
  }

  deleteBoard(): void {
    if(confirm('Do you want to delete this board?')){
      this.boardsService.deleteBoard(this.boardId)
    }
  }

  deleteColumn(columnId: string): void {
    this.columnsService.deleteColumn(this.boardId, columnId)
  }

  deleteTask(columnId:string, taskId: string): void {
    this.tasksService.deleteTask(this.boardId, columnId, taskId)
  }
}

