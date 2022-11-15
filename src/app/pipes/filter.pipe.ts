import { Pipe, PipeTransform } from '@angular/core';
import { BoardInterface } from '../shared/types/board.interface';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(boards: BoardInterface[], search: string): BoardInterface[] {
    return boards.filter(board => board.title.toLowerCase().includes(search.toLowerCase()))
  }

}
