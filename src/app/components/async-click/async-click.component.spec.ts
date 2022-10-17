import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsyncClickComponent } from './async-click.component';

describe('AsyncClickComponent', () => {
  let component: AsyncClickComponent;
  let fixture: ComponentFixture<AsyncClickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsyncClickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsyncClickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
