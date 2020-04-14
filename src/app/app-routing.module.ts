import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponentComponent } from './start-component/start-component.component';
import { SampleoneComponent } from './sampleone/sampleone.component';


const routes: Routes = [
  { path: '', component: StartComponentComponent },
  { path: 'sampleOne', component: SampleoneComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
