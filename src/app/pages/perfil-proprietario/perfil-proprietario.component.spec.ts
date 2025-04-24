import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilProprietarioComponent } from './perfil-proprietario.component';

describe('PerfilProprietarioComponent', () => {
  let component: PerfilProprietarioComponent;
  let fixture: ComponentFixture<PerfilProprietarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilProprietarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilProprietarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
