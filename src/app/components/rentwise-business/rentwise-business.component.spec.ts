import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentwiseBusinessComponent } from './rentwise-business.component';

describe('RentwiseBusinessComponent', () => {
  let component: RentwiseBusinessComponent;
  let fixture: ComponentFixture<RentwiseBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentwiseBusinessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentwiseBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
