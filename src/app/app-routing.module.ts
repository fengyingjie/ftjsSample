import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponentComponent } from './start-component/start-component.component';
import { SampleoneComponent } from './sampleone/sampleone.component';
import { Sample2Component } from './sample2/sample2.component';


const routes: Routes = [
  { path: '', component: StartComponentComponent },
  { path: 'sample1', component: SampleoneComponent },
  { path: 'sample2', component: Sample2Component }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
