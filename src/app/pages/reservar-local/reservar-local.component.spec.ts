import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservarLocalComponent } from './reservar-local.component';

describe('ReservarLocalComponent', () => {
  let component: ReservarLocalComponent;
  let fixture: ComponentFixture<ReservarLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservarLocalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservarLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
