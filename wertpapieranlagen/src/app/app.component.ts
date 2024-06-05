import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { LoginSeiteComponent } from './login-seite/login-seite.component';
import { PopUpComponent } from './pop-up/pop-up.component';
import { PopUpService } from './services/pop-up.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PopUpComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'wertpapieranlagen';
  popUpVisible: boolean = false;

  constructor(private router: Router, private popUpService: PopUpService) {
    this.router.navigate(['login-seite']);
  }

  ngOnInit() {
    this.popUpService.popUpVisible$.subscribe(visible => {
      this.popUpVisible = visible;
    });
  }
}
