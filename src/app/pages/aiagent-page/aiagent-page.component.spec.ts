import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiagentPageComponent } from './aiagent-page.component';

describe('AiagentPageComponent', () => {
  let component: AiagentPageComponent;
  let fixture: ComponentFixture<AiagentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiagentPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiagentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
