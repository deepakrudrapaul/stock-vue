import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OiTableComponent } from './oi-table.component';

describe('OiTableComponent', () => {
  let component: OiTableComponent;
  let fixture: ComponentFixture<OiTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ OiTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OiTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
