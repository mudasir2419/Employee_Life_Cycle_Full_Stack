import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrls: ['./employees.css']
})
export class Employees implements OnInit {
  employees: any[] = [];
  departments: any[] = [];
  filteredEmployees: any[] = [];

  newEmployee = { name: '', email: '', date_of_joining: '', department: '', status: 'pending' };
  editingEmployee: any = null;
  filters = { department: '', status: '' };

  private empApi = environment.apiBaseUrl + environment.endpoints.employees;
  private deptApi = environment.apiBaseUrl + environment.endpoints.departments;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadDepartments();
  }

  loadEmployees() {
    this.http.get<any[]>(this.empApi).subscribe({
      next: (data) => {
        this.employees = data;
        this.applyFilters();
      },
      error: (err) => console.error('Load employees error:', err)
    });
  }

  loadDepartments() {
    this.http.get<any[]>(this.deptApi).subscribe({
      next: (data) => this.departments = data,
      error: (err) => console.error('Load departments error:', err)
    });
  }

  addEmployee() {
    this.http.post(this.empApi, this.newEmployee).subscribe({
      next: () => {
        this.loadEmployees();
        this.newEmployee = { name: '', email: '', date_of_joining: '', department: '', status: 'pending' };
      },
      error: (err) => console.error('Add employee error:', err)
    });
  }

  editEmployee(emp: any) {
    this.editingEmployee = { ...emp };
  }

  updateEmployee() {
    this.http.put(this.empApi + this.editingEmployee.id + '/', this.editingEmployee).subscribe({
      next: () => {
        this.loadEmployees();
        this.editingEmployee = null;
      },
      error: (err) => console.error('Update employee error:', err)
    });
  }

  deleteEmployee(id: number) {
    this.http.delete(this.empApi + id + '/').subscribe({
      next: () => this.loadEmployees(),
      error: (err) => console.error('Delete employee error:', err)
    });
  }

  applyFilters() {
    this.filteredEmployees = this.employees.filter(emp => {
      return (!this.filters.department || emp.department === this.filters.department) &&
             (!this.filters.status || emp.status === this.filters.status);
    });
  }


  changeStatus(empId: number, newStatus: string) {
    this.http.patch(this.empApi + empId + '/', { status: newStatus }).subscribe({
      next: () => this.loadEmployees(),
      error: (err) => console.error('Status update error:', err)
    });
  }
}


