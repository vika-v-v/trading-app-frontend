import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidePanel } from '../side-panel.enum';
import { UserService } from '../../services/user.service';
import { UserSettingsComponent } from '../../user-settings/user-settings.component';

@Component({
  selector: 'app-non-depot-existing',
  standalone: true,
  imports: [CommonModule, UserSettingsComponent],  // UserSettingsComponent hier importieren
  templateUrl: './non-depot-existing.component.html',
  styleUrls: ['./non-depot-existing.component.css']
})
export class NonDepotExistingComponent {
  SidePanel = SidePanel;
  _showSidePanel: boolean | null = null;
  sidePanel: SidePanel | null = null;

  constructor(private userService: UserService) {}

  showSidePanel(name: SidePanel) {
    this._showSidePanel = true;
    this.sidePanel = name;
  }

  hideSidePanel() {
    this._showSidePanel = false;
  }
}
