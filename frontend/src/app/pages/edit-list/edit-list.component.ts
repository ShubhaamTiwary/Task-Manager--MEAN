import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../task.service';

@Component({
  selector: 'app-edit-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './edit-list.component.html',
  styleUrl: './edit-list.component.scss'
})
export class EditListComponent implements OnInit {
  
  constructor(private route:ActivatedRoute,private TaskService:TaskService,private router:Router){}

  listId:string='';

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        // console.log(params)
        if (Object.keys(params).length > 0) {
          this.listId=params['listId'];
        }
      }
    )
  }


  updateList(title:string) {
    this.TaskService.updateList(this.listId,title).subscribe((req)=>{
      console.log('List Updated');
      this.router.navigateByUrl(`/lists/${this.listId}`)
    })
  }
}
