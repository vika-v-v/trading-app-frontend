import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { TaxSettingsComponent } from './tax-settings/tax-settings.component';
import { CommonModule } from '@angular/common';
import { ChangePasswordPageComponent } from './change-password-page/change-password-page.component';
import { AutoLogoutService } from '../services/auto-logout.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PopUpService } from '../services/pop-up.service';
import { PasswordUtilsService } from '../services/password-utils.service';

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

  isEditing = false;
  originalData: any = {}; // Store original data
  updatedData: any = {}; // Store updated data
  name: string = '';
  address_a: string = '';
  address_b: string = '';
  phone: string = '';
  email: string = '';


  kontoeinstellungenAngezeigt = true;
  steuereinstellungenAngezeigt = false;
  changePasswordShown = false;

  altesPasswort: string = '';
  neuesPasswort: string = '';
  neuesPasswortWiederholung: string = '';

  fehlermeldungPasswort: string = '';

  passwordStrengthText: string = 'Ungültig';
  passwordStrengthWidth: string = '0%';
  passwordStrengthColor: string = '#ddd';

  configuration = {
    kontoeinstellungen : [
      { label: 'Vorname', id: 'vorname', placeholder: 'Max', currentlyEditing: false, lastSavedValue: '', currentValue: ''},
      { label: 'Nachname', id: 'nachname', placeholder: 'Meyer', currentlyEditing: false, lastSavedValue: '', currentValue: '' },
      { label: 'Telefonnummer', id: 'telefonnummer', placeholder: '+490000000000', currentlyEditing: false, lastSavedValue: '', currentValue: '' },
      { label: 'E-Mail-Adresse', id: 'email', placeholder: 'max.meyer@me.de', currentlyEditing: false, lastSavedValue: '', currentValue: '', showInline: true },
      { label: 'Straße und Hausnummer', id: 'strasse_hausnummer', placeholder: 'Musterstrasse 1', currentlyEditing: false, lastSavedValue: '', currentValue: '' },
      { label: 'PLZ und Ort', id: 'plz_ort', placeholder: '33100 Musterstadt', currentlyEditing: false, lastSavedValue: '', currentValue: '', showInline: true }
    ]
  }

  constructor(private router: Router, private userService: UserService, private autoLogoutService: AutoLogoutService, private http: HttpClient, private popupService: PopUpService, private passwordUtils: PasswordUtilsService) {}

  ngOnInit(): void {
    this.userService.getUserData(this.http).subscribe((response: any) => {
      const data = response.data;

      this.configuration.kontoeinstellungen.find((setting: any) => setting.id === 'vorname')!.currentValue = data.vorname || '';
      this.configuration.kontoeinstellungen.find((setting: any) => setting.id === 'nachname')!.currentValue = data.nachname || '';
      this.configuration.kontoeinstellungen.find((setting: any) => setting.id === 'telefonnummer')!.currentValue = data.telefonnummer || '';
      this.configuration.kontoeinstellungen.find((setting: any) => setting.id === 'email')!.currentValue = data.email || '';
      this.configuration.kontoeinstellungen.find((setting: any) => setting.id === 'strasse_hausnummer')!.currentValue = data.strasse + ' ' + data.hausnummer || '';
      this.configuration.kontoeinstellungen.find((setting: any) => setting.id === 'plz_ort')!.currentValue = data.plz + ' ' + data.ort || '';

      this.configuration.kontoeinstellungen.forEach((setting: any) => {
        setting.lastSavedValue = setting.currentValue;
      });
    },
    error => {
      this.popupService.errorPopUp("Fehler beim Laden der Benutzerdaten: " + error.error.message);
    });
    /*
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
    });*/
  }

  saveData(updatedId: string, updatedValue: string) {
    if(updatedId === 'vorname') {
      this.saveVorname(updatedValue);
    }
    else if(updatedId === 'nachname') {
      this.saveNachname(updatedValue);
    }
    else if(updatedId === 'telefonnummer') {
      this.saveTelefonnummer(updatedValue);
    }
    else if(updatedId === 'email') {
      this.saveEmail(updatedValue);
    }
    else if(updatedId === 'strasse_hausnummer') {
      this.saveStrasseHausnummer(updatedValue);
    }
    else if(updatedId === 'plz_ort') {
      this.savePlzOrt(updatedValue);
    }
  }

  deleteAccount() {
    this.popupService.choicePopUp("Möchten Sie Ihr Konto wirklich löschen?").subscribe((response: any) => {
      if(response) {
        this.userService.deleteUser(this.http).subscribe(response => {
          this.popupService.infoPopUp("Konto erfolgreich gelöscht.");
          this.router.navigate(['login-seite']);
        },
        error => {
          this.popupService.errorPopUp("Fehler beim Löschen des Kontos: " + error.error.message);
        });
      }
    }
    );
  }

  passwortAendern() {
    const email = this.configuration.kontoeinstellungen.find((setting: any) => setting.id === 'email')!.lastSavedValue;
    this.userService.login(this.http, email, this.altesPasswort).subscribe((response: any) => {
      if(response.statusCode === 200) {
        if(this.neuesPasswort != this.neuesPasswortWiederholung) {
          this.fehlermeldungPasswort = "Die Passwörter stimmen nicht überein.";
          return;
        }

        if(this.altesPasswort == this.neuesPasswort) {
          this.fehlermeldungPasswort = "Das Passwort ist gleich geblieben.";
          return;
        }

        if(this.passwordUtils.checkPassword(this.neuesPasswort).isInvalid) {
          this.fehlermeldungPasswort = "Das neue Passwort ist zu schwach.";
          return;
        }

        this.userService.updateUserData(this.http, { password: this.neuesPasswort }).subscribe(response => {
          this.popupService.infoPopUp("Passwort erfolgreich geändert.");
          this.passwortAendernAbbrechen();
        },
        error => {
          this.popupService.errorPopUp("Fehler beim Ändern des Passworts: " + error.error.message);
          return;
        });

      }
    },
    error => {
      this.fehlermeldungPasswort = "Das alte Passwort ist falsch.";
    });
  }

  checkPassword(password: string) {
    this.passwordStrengthWidth = this.passwordUtils.checkPassword(password).width;
    this.passwordStrengthColor = this.passwordUtils.checkPassword(password).color;
    this.passwordStrengthText = this.passwordUtils.checkPassword(password).text;
    this.fehlermeldungPasswort = '';
  }

  passwortAendernAbbrechen() {
    this.changePasswordShown = false;

    this.passwordStrengthText = 'Ungültig';
    this.passwordStrengthWidth = '0%';
    this.passwordStrengthColor = '#ddd';
    this.altesPasswort = '';
    this.neuesPasswort = '';
    this.neuesPasswortWiederholung = '';
  }

  private savePlzOrt(updatedValue: string) {
    const lastSpaceIndex = updatedValue.lastIndexOf(' ');

    const plz = updatedValue.substring(0, lastSpaceIndex);
    const ort = updatedValue.substring(lastSpaceIndex + 1);

    let successfullyUpdated = 0;

    this.userService.updateUserData(this.http, { plz: plz }).subscribe(response => {
      successfullyUpdated++;
      if (successfullyUpdated === 2) {
        this.popupService.infoPopUp("PLZ und Ort erfolgreich geändert.");
      }
    },
      error => {
        this.popupService.errorPopUp("Fehler beim Ändern der PLZ: " + error.error.message);
      });

    this.userService.updateUserData(this.http, { ort: ort }).subscribe(response => {
      successfullyUpdated++;
      if (successfullyUpdated === 2) {
        this.popupService.infoPopUp("PLZ und Ort erfolgreich geändert.");
      }
    },
      error => {
        this.popupService.errorPopUp("Fehler beim Ändern des Ortes: " + error.error.message);
      });
  }

  private saveStrasseHausnummer(updatedValue: string) {
    const lastSpaceIndex = updatedValue.lastIndexOf(' ');

    const strasse = updatedValue.substring(0, lastSpaceIndex);
    const hausnummer = updatedValue.substring(lastSpaceIndex + 1);

    let successfullyUpdated = 0;

    this.userService.updateUserData(this.http, { strasse: strasse }).subscribe(response => {
      successfullyUpdated++;
      if (successfullyUpdated === 2) {
        this.popupService.infoPopUp("Straße und Hausnummer erfolgreich geändert.");
      }
    },
      error => {
        this.popupService.errorPopUp("Fehler beim Ändern der Straße: " + error.error.message);
      });

    this.userService.updateUserData(this.http, { hausnummer: hausnummer }).subscribe(response => {
      successfullyUpdated++;
      if (successfullyUpdated === 2) {
        this.popupService.infoPopUp("Straße und Hausnummer erfolgreich geändert.");
      }
    },
      error => {
        this.popupService.errorPopUp("Fehler beim Ändern der Hausnummer: " + error.error.message);
      });
  }

  private saveEmail(updatedValue: string) {
    this.userService.updateUserData(this.http, { email: updatedValue }).subscribe(response => {
      this.popupService.infoPopUp("E-Mail-Adresse erfolgreich geändert.");
    },
      error => {
        this.popupService.errorPopUp("Fehler beim Ändern der E-Mail-Adresse: " + error.error.message);
      });
  }

  private saveTelefonnummer(updatedValue: string) {
    this.userService.updateUserData(this.http, { telefonnummer: updatedValue }).subscribe(response => {
      this.popupService.infoPopUp("Telefonnummer erfolgreich geändert.");
    },
      error => {
        this.popupService.errorPopUp("Fehler beim Ändern der Telefonnummer: " + error.error.message);
      });
  }

  private saveNachname(updatedValue: string) {
    this.userService.updateUserData(this.http, { nachname: updatedValue }).subscribe(response => {
      this.popupService.infoPopUp("Nachname erfolgreich geändert.");
    },
      error => {
        this.popupService.errorPopUp("Fehler beim Ändern des Nachnamens: " + error.error.message);
      });
  }

  private saveVorname(updatedValue: string) {
    this.userService.updateUserData(this.http, { vorname: updatedValue }).subscribe(response => {
      this.popupService.infoPopUp("Vorname erfolgreich geändert.");
    },
      error => {
        this.popupService.errorPopUp("Fehler beim Ändern des Vornamens: " + error.error.message);
      });
  }

  //Wechsel zwischen Bearbeiten und nicht Bearbeiten
  toggleEdit() {
    if (this.isEditing) {
      this.saveChanges();
    } else {
      this.isEditing = true;
    }
  }

  //Änderungen werden gespeichert
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

  //Weiterleitung zur Anmeldung + Timer-Stopp + Token-Löschung
  naviagateToLoginPage() {
    this.autoLogoutService.stop();
    this.router.navigate(['login-seite']);
    this.userService.setToken('');
  }
}
