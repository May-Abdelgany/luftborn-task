import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Modal } from './modal';

describe('Modal Component', () => {

  let component: Modal;
  let fixture: ComponentFixture<Modal>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [Modal]
    }).compileComponents();

    fixture = TestBed.createComponent(Modal);
    component = fixture.componentInstance;

    /* ⭐ IMPORTANT */
    component.id = '1' as any;
    component.buttonName = 'Delete' as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* ⭐ THIS IS THE IMPORTANT TEST ⭐ */

  it('should cover action method', () => {

    spyOn(component.deletedTask, 'emit');

    component.action('1');   // ⭐ THIS IS WHAT COVERS YOUR METHOD

    expect(component.deletedTask.emit)
      .toHaveBeenCalledWith('1');
  });

});
