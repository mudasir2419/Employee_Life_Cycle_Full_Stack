

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departments.html',
  styleUrls: ['./departments.css']
})
export class Departments implements OnInit {
  departments: any[] = [];
  newDept = { name: '', location: '' };
  editingDept: any = null;

  private apiUrl = environment.apiBaseUrl + environment.endpoints.departments;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => this.departments = data,
      error: (err) => console.error('Load departments error:', err)
    });
  }

  addDepartment() {
    if (this.newDept.name && this.newDept.location) {
      this.http.post(this.apiUrl, this.newDept).subscribe({
        next: () => {
          this.loadDepartments();
          this.newDept = { name: '', location: '' };
        },
        error: (err) => console.error('Add department error:', err)
      });
    }
  }

  deleteDepartment(id: number) {
    this.http.delete(this.apiUrl + id + '/').subscribe({
      next: () => this.loadDepartments(),
      error: (err) => console.error('Delete department error:', err)
    });
  }

  editDepartment(dept: any) {
    this.editingDept = { ...dept };
  }

  updateDepartment() {
    if (this.editingDept) {
      this.http.put(this.apiUrl + this.editingDept.id + '/', this.editingDept).subscribe({
        next: () => {
          this.loadDepartments();
          this.editingDept = null;
        },
        error: (err) => console.error('Update department error:', err)
      });
    }
  }

  cancelEdit() {
    this.editingDept = null;
  }
}


