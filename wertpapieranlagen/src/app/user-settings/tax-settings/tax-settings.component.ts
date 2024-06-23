import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tax-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tax-settings.component.html',
  styleUrls: ['./tax-settings.component.css']
})
export class TaxSettingsComponent implements OnInit {
  @Output() resetClicked = new EventEmitter<void>();

  steuersatz = 20.01;
  steuerfreibetrag = 1000;
  soli = 5.5;
  kirchensteuer = 6;
  verlustverrechnungstopf = 0;
  kapitalgewinne_brutto = 0;
  steuerbelastung = 0;
  kapitalgewinne_netto = 0;

  constructor(private userService: UserService, private http: HttpClient) {}


  ngOnInit() {
    this.fillVerlustverrechnungstopf();
    this.fillBruttoKapitalgewinne();
    this.calculateSteuerbelastung();
    this.fillNettoKapitalgewinne();
  }

  getAccountValue() {
    return this.userService.getAccountvalue(this.http).toPromise();
  }

  async fillVerlustverrechnungstopf() {
    try {
      const accountvalue = await this.getAccountValue();
      this.verlustverrechnungstopf = accountvalue.data.verlustverrechnungstopf;
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  }

  async fillBruttoKapitalgewinne() {
    try {
      const accountvalue = await this.getAccountValue();
      this.kapitalgewinne_brutto = accountvalue.data.accountValue;
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  }

  calculateSteuerbelastung() {
    const zuVersteuerndeEinkommen = this.kapitalgewinne_brutto - this.verlustverrechnungstopf;
    const gesamtSteuersatz = this.steuersatz + this.soli + this.kirchensteuer;
    
    if (zuVersteuerndeEinkommen < this.steuerfreibetrag) {
      this.steuerbelastung = zuVersteuerndeEinkommen * gesamtSteuersatz / 100;
    } else {
      this.steuerbelastung = (zuVersteuerndeEinkommen - this.steuerfreibetrag) * gesamtSteuersatz / 100;
    }
  }

  fillNettoKapitalgewinne() {
    // Hier sollte die Logik zur Bereitstellung der Daten implementiert werden
    this.kapitalgewinne_netto = this.kapitalgewinne_brutto - this.steuerbelastung; // Berechnung der Netto Kapitalgewinne
  }

  onReset() {
    this.resetClicked.emit();
    this.ngOnInit(); // Reset the values by reinitializing
  }

  toggleSteuerinfo() {
    const steuerinfo = document.getElementById('Steuerinfo');
    if (steuerinfo) {
      steuerinfo.style.display = steuerinfo.style.display === 'none' ? 'block' : 'none';
    }
  }

  onInputChange() {
    this.calculateSteuerbelastung();
    this.fillNettoKapitalgewinne();
  }
}
