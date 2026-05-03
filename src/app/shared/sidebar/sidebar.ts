import { Component } from '@angular/core';
import { RouterLink, RouterModule, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isMobileMenuOpen = false;

  constructor(private router: Router) {
    // Cerramos el menú automáticamente al navegar en móviles
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isMobileMenuOpen = false;
    });
  }

  toggleMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}