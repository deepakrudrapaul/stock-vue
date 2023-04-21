import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OiBuildupComponent } from './oi-buildup.component';

describe('OiBuildupComponent', () => {
  let component: OiBuildupComponent;
  let fixture: ComponentFixture<OiBuildupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ OiBuildupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OiBuildupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
