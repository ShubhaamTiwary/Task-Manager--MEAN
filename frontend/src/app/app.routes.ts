import { Routes } from '@angular/router';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { AppComponent } from './app.component';
import { NewListComponent } from './pages/new-list/new-list.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { EditListComponent } from './pages/edit-list/edit-list.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';

export const routes: Routes = [
    { path: '',redirectTo:'/lists',pathMatch:'full' },
    { path: 'new-list', component: NewListComponent, },
    { path: 'login', component: LoginPageComponent, },
    { path: 'signup', component: SignupPageComponent, },
    {path: 'edit-list/:listId', component: EditListComponent, },
    {path: 'lists/:listId/edit-task/:taskId', component: EditTaskComponent, },
    { path: 'lists/:listId/new-task', component: NewTaskComponent, },
    {path:'lists',component:TaskViewComponent},
    {path:'lists/:listId',component:TaskViewComponent},
];
