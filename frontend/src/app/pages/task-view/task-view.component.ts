import { Component } from '@angular/core';
import { TaskService } from '../../task.service';

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent {
  constructor(private TaskService:TaskService){};

  createNewList(){
    console.log('click');
    this.TaskService.createList('testing').subscribe((res:any)=>{
      console.log(res);
    })
  }
}
