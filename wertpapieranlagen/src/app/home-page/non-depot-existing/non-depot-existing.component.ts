import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidePanel } from '../side-panel.enum';
import { UserService } from '../../services/user.service';
import { UserSettingsComponent } from '../../user-settings/user-settings.component';
import { DepotErstellenComponent } from '../depot-erstellen/depot-erstellen.component';

@Component({
  selector: 'app-non-depot-existing',
  standalone: true,
  imports: [CommonModule, UserSettingsComponent, DepotErstellenComponent],  // Import DepotErstellenComponent hier hinzufügen
  templateUrl: './non-depot-existing.component.html',
  styleUrls: ['./non-depot-existing.component.css']
})
export class NonDepotExistingComponent {
  SidePanel = SidePanel;
  _showSidePanel: boolean | null = null;
  sidePanel: SidePanel | null = null;

  @Output() showAddDepot: EventEmitter<void> = new EventEmitter<void>();

  constructor(private userService: UserService) {}

  showSidePanel(name: SidePanel) {
    this._showSidePanel = true;
    this.sidePanel = name;
    this.showAddDepot.emit();
  }

  hideSidePanel() {
    this._showSidePanel = false;
  }
}
