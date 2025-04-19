import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestManageComponent } from './request-manage.component';

describe('RequestManageComponent', () => {
  let component: RequestManageComponent;
  let fixture: ComponentFixture<RequestManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestManageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
