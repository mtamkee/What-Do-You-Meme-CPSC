import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WdymComponent } from './wdym.component';


describe('WdymComponent', () => {
  let component: WdymComponent;
  let fixture: ComponentFixture<WdymComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WdymComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WdymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
