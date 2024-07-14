import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OiDffComponent } from './oi-dff.component';

describe('OiDffComponent', () => {
  let component: OiDffComponent;
  let fixture: ComponentFixture<OiDffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OiDffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OiDffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
