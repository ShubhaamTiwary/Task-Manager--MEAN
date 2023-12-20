import { Routes } from '@angular/router';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: '', component: TaskViewComponent, },
];
