import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "../auth/services/authGuard.service";
import { FilterTaskPipe } from "../pipes/filter-task.pipe";
import { FormModule } from "../shared/modules/form/form.module";
import { HeaderModule } from "../shared/modules/header/header.module";
import { ColumnsService } from "../shared/services/columns.service";
import { TasksService } from "../shared/services/tasks.service";
import { BoardComponent } from "./components/board/board.component";
import { TaskModalComponent } from "./components/task-modal/task-modal.component";
import { BoardService } from "./services/board.service";


const routes: Routes = [
  {
    path: 'boards/:boardId',
    component: BoardComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'tasks/:taskId',
        component: TaskModalComponent,
      }
    ]
  }
]

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), HeaderModule, FormsModule, FormModule, ReactiveFormsModule],
  declarations: [BoardComponent, FilterTaskPipe, TaskModalComponent],
  providers: [BoardService, ColumnsService, TasksService]
})

export class BoardModule{

}
