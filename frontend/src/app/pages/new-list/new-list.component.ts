import { Component } from '@angular/core';
import { TaskService } from '../../task.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './new-list.component.html',
  styleUrl: './new-list.component.scss'
})
export class NewListComponent {
  constructor(private TaskService: TaskService, private router: Router) { };
  createNewList(title: string) {
    this.TaskService.createList(title).subscribe((res: any) => {
      // console.log(res);
      // We need to navigate back to the home page with the id of the newly created list
      this.router.navigate(['/lists', res._id])
    })
  }
}
