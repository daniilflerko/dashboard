import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "../auth/services/authGuard.service";

import { FilterPipe } from "../pipes/filter.pipe";
import { HeaderModule } from "../shared/modules/header/header.module";
import { ModalComponent } from "../shared/modules/modal/components/modal/modal.component";

import { BoardsService } from "../shared/services/boards.service";
import { BoardsComponent } from "./components/boards/boards.component";
import { CreateBoardModule } from "./components/create-board/create-board.module";



const routes: Routes = [
  {
    path: 'boards',
    component: BoardsComponent,
    canActivate: [AuthGuardService] //checking if user is not login then rederect to home page (if he is at boards for example and wont let to go into home page if not logged)
  }
]

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), HeaderModule, FormsModule, CreateBoardModule],
  declarations: [BoardsComponent, ModalComponent, FilterPipe, ],
  providers: [BoardsService]
})
export class BoardsModule {

}
