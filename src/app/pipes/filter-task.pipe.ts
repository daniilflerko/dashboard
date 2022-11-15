import { Pipe, PipeTransform } from '@angular/core';
import { TaskInterface } from '../shared/types/task.interface';

@Pipe({
  name: 'filterTask'
})
export class FilterTaskPipe implements PipeTransform {

  transform(tasks: TaskInterface[], search: string): TaskInterface[] {
    return tasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase()))
  }

}
