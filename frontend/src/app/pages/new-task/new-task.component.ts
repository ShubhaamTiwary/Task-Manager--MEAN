import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.scss'
})
export class NewTaskComponent implements OnInit {
  constructor(private TaskService: TaskService, private router: Router, private route: ActivatedRoute) { };

  listId:string='';

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.listId=params['listId'];
      })
  }

  createNewTask(title: string, listId: string =this.listId ) {
    this.TaskService.createTask(title, listId).subscribe((res: any) => {
      // console.log(res);
      this.router.navigate(['/lists',res._listId])
    })
  }
}
