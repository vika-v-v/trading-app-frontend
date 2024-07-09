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

  // Definiert was gerade angezeigt wird
  kontoeinstellungenAngezeigt = true;
  steuereinstellungenAngezeigt = false;
  changePasswordShown = false;

  // Passwort-Ändern-Variablen
  altesPasswort: string = '';
  neuesPasswort: string = '';
  neuesPasswortWiederholung: string = '';
  fehlermeldungPasswort: string = '';
  passwordStrengthText: string = 'Ungültig';
  passwordStrengthWidth: string = '0%';
  passwordStrengthColor: string = '#ddd';

  // Konfiguration der Kontoeinstellungen
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

  constructor(private router: Router, private userService: UserService, private autoLogoutService: AutoLogoutService, private popupService: PopUpService, private passwordUtils: PasswordUtilsService) {}

  // Initialisierung der Kontoeinstellungen: über ein Request die Daten des Benutzers holen
  ngOnInit(): void {
    this.userService.getUserData().subscribe((response: any) => {
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
  }

  // Daten für Kontoeinstellungen speichern
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

  // Kontoeinstellungen -> Button: Konto löschen
  deleteAccount() {
    this.popupService.choicePopUp("Möchten Sie Ihr Konto wirklich löschen?").subscribe((response: any) => {
      if(response) {
        this.userService.deleteUser().subscribe(response => {
          this.popupService.infoPopUp("Konto erfolgreich gelöscht.");
          this.naviagateToLoginPage();
        },
        error => {
          this.popupService.errorPopUp("Fehler beim Löschen des Kontos: " + error.error.message);
        });
      }
    }
    );
  }

  // Kontoeinstellungen -> Button: Passwort ändern
  passwortAendern() {
    const email = this.configuration.kontoeinstellungen.find((setting: any) => setting.id === 'email')!.lastSavedValue;
    this.userService.login(email, this.altesPasswort).subscribe((response: any) => {
      if(response.statusCode === 200) {
        // Validierung des neuen Passworts
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

        // Passwort ändern
        this.userService.updateUserData({ password: this.neuesPasswort }).subscribe(response => {
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

  // Methoden für den Passwort
  // ----
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

  hideChangePassword() {
    this.changePasswordShown = false;
  }
  // ----

  //Weiterleitung zur Anmeldung + Timer-Stopp + Token-Löschung
  naviagateToLoginPage() {
    this.autoLogoutService.stop();
    this.router.navigate(['login-seite']);
    this.userService.setToken('');
  }

  // Methoden zum Speichern vom Nutzereingaben
  // ----
  private savePlzOrt(updatedValue: string) {
    const lastSpaceIndex = updatedValue.lastIndexOf(' ');

    const plz = updatedValue.substring(0, lastSpaceIndex);
    const ort = updatedValue.substring(lastSpaceIndex + 1);

    let successfullyUpdated = 0;

    this.userService.updateUserData({ plz: plz }).subscribe(response => {
      successfullyUpdated++;
      if (successfullyUpdated === 2) {
        this.popupService.infoPopUp("PLZ und Ort erfolgreich geändert.");
      }
    },
      error => {
        this.popupService.errorPopUp("Fehler beim Ändern der PLZ: " + error.error.message);
      });

    this.userService.updateUserData({ ort: ort }).subscribe(response => {
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

    this.userService.updateUserData({ strasse: strasse }).subscribe(response => {
      successfullyUpdated++;
      if (successfullyUpdated === 2) {
        this.popupService.infoPopUp("Straße und Hausnummer erfolgreich geändert.");
      }
    },
      error => {
        this.popupService.errorPopUp("Fehler beim Ändern der Straße: " + error.error.message);
      });

    this.userService.updateUserData({ hausnummer: hausnummer }).subscribe(response => {
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
    this.userService.updateUserData({ email: updatedValue }).subscribe(response => {
      this.popupService.infoPopUp("E-Mail-Adresse erfolgreich geändert.");
    },
      error => {
        this.popupService.errorPopUp("Fehler beim Ändern der E-Mail-Adresse: " + error.error.message);
      });
  }

  private saveTelefonnummer(updatedValue: string) {
    this.userService.updateUserData({ telefonnummer: updatedValue }).subscribe(response => {
      this.popupService.infoPopUp("Telefonnummer erfolgreich geändert.");
    },
      error => {
        this.popupService.errorPopUp("Fehler beim Ändern der Telefonnummer: " + error.error.message);
      });
  }

  private saveNachname(updatedValue: string) {
    this.userService.updateUserData({ nachname: updatedValue }).subscribe(response => {
      this.popupService.infoPopUp("Nachname erfolgreich geändert.");
    },
      error => {
        this.popupService.errorPopUp("Fehler beim Ändern des Nachnamens: " + error.error.message);
      });
  }

  private saveVorname(updatedValue: string) {
    this.userService.updateUserData({ vorname: updatedValue }).subscribe(response => {
      this.popupService.infoPopUp("Vorname erfolgreich geändert.");
    },
      error => {
        this.popupService.errorPopUp("Fehler beim Ändern des Vornamens: " + error.error.message);
      });
  }
  // ----
}
