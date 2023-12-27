import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { ActivatedRoute, Params, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLinkActive, NgClass],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent implements OnInit {
  lists: any = []
  tasks: any = []
  selectedListId:string=''
  constructor(private TaskService: TaskService, private route: ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        // console.log(params)
        if (Object.keys(params).length > 0) {
          this.selectedListId=params['listId'];
          this.TaskService.getTasks(params['listId']).subscribe((tasks) => {
            this.tasks = tasks;
          })
        }
        else{
          this.tasks=undefined;
        }
      }
    )
    this.TaskService.getLists().subscribe((lists) => {
      this.lists = lists
      // console.log(this.lists);
    });
  }

  onTaskClick(task: any) {
    // console.log('Clicked!!');
    this.TaskService.completeTask(task).subscribe(() => {
      // console.log('Completed !!');
      task.completed = !task.completed;
    });
  }

  onDeleteListClick(){
   this.TaskService.deleteList(this.selectedListId).subscribe((res)=>{
    console.log('Delete Called',res);
    this.router.navigateByUrl('/lists');
   })
  }

  onTaskDeleteClick(id:string){
    this.TaskService.deleteTask(this.selectedListId,id).subscribe((res)=>{
      this.tasks=this.tasks.filter((item:any)=>{
        return item._id!==id
      });
      console.log('Delete Called on Task',res);
      // this.router.navigateByUrl('/lists');
     })
  }
}
