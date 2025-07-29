

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../pages/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, OnDestroy {
  stats = { employees: 0, onboarded: 0, offboarded: 0, departments: 0 };
  queue: any[] = [];
  showAllTasks = false;
  private refreshInterval: any;

  // Use environment variables for API URLs
  private empApi = environment.apiBaseUrl + environment.endpoints.employees;
  private deptApi = environment.apiBaseUrl + environment.endpoints.departments;
  private queueApi = environment.apiBaseUrl + environment.endpoints.tasks;
  private retryApi = environment.apiBaseUrl + environment.endpoints.tasks;  

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.loadStats();
      this.loadQueue();

      this.refreshInterval = setInterval(() => {
        if (this.auth.isLoggedIn()) {
          this.loadStats();
          this.loadQueue();
        }
      }, 5000);
    }
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  toggleShowAll() {
    this.showAllTasks = !this.showAllTasks;
    this.loadQueue();
  }

  loadStats() {
    this.http.get<any[]>(this.empApi).subscribe({
      next: (data) => {
        this.stats.employees = data.length;
        this.stats.onboarded = data.filter(e => e.status === 'onboarded').length;
        this.stats.offboarded = data.filter(e => e.status === 'offboarded').length;
      },
      error: (err) => console.error('Employees API Error:', err)
    });

    this.http.get<any[]>(this.deptApi).subscribe({
      next: (data) => (this.stats.departments = data.length),
      error: (err) => console.error('Departments API Error:', err)
    });
  }

  loadQueue() {
    this.http.get<any[]>(this.queueApi).subscribe({
      next: (data) => {
        const limitedData = this.showAllTasks ? data : data.slice(0, 5);

        const taskMap = new Map<number, any>();
        this.queue.forEach(task => {
          taskMap.set(task.id, task);
        });

        this.queue = limitedData.map(task => {
          const existing = taskMap.get(task.id);
          const retryVisible = existing?.retryVisible || false;

          // Show retry after 10s only for new pending tasks
          if (task.status === 'pending' && !retryVisible) {
            setTimeout(() => {
              const match = this.queue.find(t => t.id === task.id);
              if (match) {
                match.retryVisible = true;
              }
            }, 10000);
          }

          return { ...task, retryVisible };
        });
      },
      error: (err) => console.error('Queue API Error:', err)
    });
  }

  retryTask(task: any) {
    this.http.post(this.retryApi + task.id + '/retry/', {}).subscribe({
      next: () => {
        console.log('Retrying task:', task.id);
        this.loadQueue();
      },
      error: (err) => console.error('Retry failed:', err)
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'pending': return 'badge bg-secondary';
      case 'processing': return 'badge bg-info';
      case 'success': return 'badge bg-success';
      case 'failed': return 'badge bg-danger';
      default: return 'badge bg-light';
    }
  }

  trackByTaskId(index: number, task: any) {
    return task.id;
  }
}
