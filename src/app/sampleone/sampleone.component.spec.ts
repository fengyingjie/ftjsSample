import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleoneComponent } from './sampleone.component';

describe('SampleoneComponent', () => {
  let component: SampleoneComponent;
  let fixture: ComponentFixture<SampleoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
