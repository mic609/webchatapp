import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPaswordRequireComponent } from './new-pasword-require.component';

describe('NewPaswordRequireComponent', () => {
  let component: NewPaswordRequireComponent;
  let fixture: ComponentFixture<NewPaswordRequireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPaswordRequireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPaswordRequireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
