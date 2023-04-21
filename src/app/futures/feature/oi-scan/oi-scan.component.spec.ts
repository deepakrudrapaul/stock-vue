import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OiScanComponent } from './oi-scan.component';

describe('OiScanComponent', () => {
  let component: OiScanComponent;
  let fixture: ComponentFixture<OiScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ OiScanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OiScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
