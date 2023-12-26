import { Routes } from '@angular/router';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { AppComponent } from './app.component';
import { NewListComponent } from './pages/new-list/new-list.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

export const routes: Routes = [
    { path: '',redirectTo:'/lists',pathMatch:'full' },
    { path: 'new-list', component: NewListComponent, },
    { path: 'login', component: LoginPageComponent, },
    { path: 'lists/:listId/new-task', component: NewTaskComponent, },
    {path:'lists',component:TaskViewComponent},
    {path:'lists/:listId',component:TaskViewComponent},
];
