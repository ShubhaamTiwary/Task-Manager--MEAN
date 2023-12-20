import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent implements OnInit {
  lists: any=[]
  tasks: any=[]
  constructor(private TaskService: TaskService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        // console.log(params)
        if (Object.keys(params).length > 0) {
          this.TaskService.getTasks(params['listId']).subscribe((tasks)=>{
            this.tasks=tasks;
          })
        }
      }
    )
    this.TaskService.getLists().subscribe((lists) => {
      this.lists = lists
      // console.log(this.lists);
    });
  }
}
