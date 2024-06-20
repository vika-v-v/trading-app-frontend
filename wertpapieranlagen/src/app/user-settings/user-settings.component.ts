import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { TaxSettingsComponent } from './tax-settings/tax-settings.component';
import { CommonModule } from '@angular/common';
import { ChangePasswordPageComponent } from './change-password-page/change-password-page.component';
import { AutoLogoutService } from '../services/auto-logout.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaxSettingsComponent,
    ChangePasswordPageComponent
  ],
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
  steuerrechnerShown = false;
  changePasswordShown = false;

  isEditing = false;
  originalData: any = {}; // Store original data
  updatedData: any = {}; // Store updated data
  name: string = '';
  address_a: string = '';
  address_b: string = '';
  phone: string = '';
  email: string = '';

  constructor(private router: Router, private userService: UserService, private autoLogoutService: AutoLogoutService, private http: HttpClient) {}

  ngOnInit(): void {
    this.userService.getUserData(this.http).subscribe((response: any) => {
      const data = response.data;
      this.name = (data.vorname && data.nachname) ? `${data.vorname} ${data.nachname}` : '';
      this.address_a = (data.strasse && data.hausnummer) ? `${data.strasse} ${data.hausnummer}` : '';
      this.address_b = (data.plz && data.ort) ? `${data.plz} ${data.ort}` : '';
      this.phone = data.telefonnummer || '';
      this.email = data.email || '';

      // Store original data for comparison
      this.originalData = {
        name: this.name,
        address_a: this.address_a,
        address_b: this.address_b,
        phone: this.phone,
        email: this.email
      };
    });
  }

  toggleEdit() {
    if (this.isEditing) {
      this.saveChanges();
    } else {
      this.isEditing = true;
    }
  }

  saveChanges() {
    // Reset updated data
    this.updatedData = {};

    // Compare each field with original data
    if (this.name !== this.originalData.name) {
      const [vorname, nachname] = this.name.split(' ');
      this.updatedData.vorname = vorname || undefined;
      this.updatedData.nachname = nachname || undefined;
    }
    if (this.address_a !== this.originalData.address_a) {
      const [strasse, hausnummer] = this.address_a.split(' ');
      this.updatedData.strasse = strasse || undefined;
      this.updatedData.hausnummer = hausnummer || undefined;
    }
    if (this.address_b !== this.originalData.address_b) {
      const [plz, ort] = this.address_b.split(' ');
      this.updatedData.plz = plz || undefined;
      this.updatedData.ort = ort || undefined;
    }
    if (this.phone !== this.originalData.phone) {
      this.updatedData.telefonnummer = this.phone || undefined;
    }
    if (this.email !== this.originalData.email) {
      this.updatedData.email = this.email || undefined;
    }

    // Send update request if there are changes
    if (Object.keys(this.updatedData).length > 0) {
      this.userService.updateUserData(this.http, this.updatedData).subscribe(response => {
        console.log('User data updated successfully:', response);
        // Update original data after successful update
        this.originalData = {
          name: this.name,
          address_a: this.address_a,
          address_b: this.address_b,
          phone: this.phone,
          email: this.email
        };
        this.isEditing = false; // Exit edit mode after save
      }, error => {
        console.error('Error updating user data:', error);
      });
    } else {
      this.isEditing = false; // Exit edit mode if no changes
    }
  }

  showSteuerrechner() {
    this.steuerrechnerShown = true;
    this.changePasswordShown = false;
  }

  hideSteuerrechner() {
    this.steuerrechnerShown = false;
  }

  showChangePassword() {
    this.changePasswordShown = true;
    this.steuerrechnerShown = false;
  }

  hideChangePassword() {
    this.changePasswordShown = false;
  }

  naviagateToLoginPage() {
    this.autoLogoutService.stop();
    this.router.navigate(['login-seite']);
    this.userService.setToken('');
  }
}
