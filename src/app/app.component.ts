import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuSuperiorComponent } from './components/menu-superior/menu-superior.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuSuperiorComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'EasySpace';
}
