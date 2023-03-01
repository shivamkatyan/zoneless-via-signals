import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';

import { Employee, EmployeeService } from './employee.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html'
})
export class AppComponent {
  employeeService = inject(EmployeeService);
  cdr = inject(ChangeDetectorRef);
  employees = signal<Employee[]>([]);

  constructor() {
    effect(() => {
      console.log('Inside effect(). Employee changed', this.employees());
    });
  }

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe((data) => {
      this.employees.set(data);
      this.cdr.detectChanges();
    });
  }
}
