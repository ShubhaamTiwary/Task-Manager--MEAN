import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private WebReqService:WebRequestService) {}

  createList(title:string){
    return this.WebReqService.post('lists',{title});
  }

  updateList(id:string,title:string){
    return this.WebReqService.patch(`lists/${id}`,{title});
  }

  getLists(){
    return this.WebReqService.get('lists');
  }

  deleteList(id:string){
    return this.WebReqService.delete(`lists/${id}`);
  }
  
  deleteTask(listId:string,taskId:string){
    return this.WebReqService.delete(`lists/${listId}/tasks/${taskId}`);
  }

  getTasks(listId:string){
    return this.WebReqService.get(`lists/${listId}/tasks`);
  }

  createTask(title:string,listId:string){
    return this.WebReqService.post(`lists/${listId}/tasks`,{title});
  }

  completeTask(task:any){
    return this.WebReqService.patch(`lists/${task._listId}/tasks/${task._id}`,{
      completed:!task.completed
    })
  }

  
}
