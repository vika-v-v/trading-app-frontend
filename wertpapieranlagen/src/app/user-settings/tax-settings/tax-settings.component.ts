import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';

interface AccountValues {
  verlustverrechnungstopf: number;
  accountValue: number;
  freibetrag: number;
  steuersatz: number;
  soli: number;
  kirchensteuer: number;
}

@Component({
  selector: 'app-tax-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tax-settings.component.html',
  styleUrls: ['./tax-settings.component.css']
})

export class TaxSettingsComponent implements OnInit {
  steuersatz: number = 0;
  steuerfreibetrag: number = 0;
  soli: number = 0;
  kirchensteuer: number = 0;
  verlustverrechnungstopf: number = 0;
  kapitalgewinne_brutto: number = 340000;
  steuerbelastung: number = 0;
  kapitalgewinne_netto: number = 0;

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit() {
    this.fetchAccountValues();
  }

  fetchAccountValues() {
    this.userService.getAccountValue(this.http).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          const dataMap1 = response.data.dataMap1 as AccountValues;
          const historicalAccountValues = response.data.dataMap2.historicalAccountValues;

          this.verlustverrechnungstopf = +dataMap1.verlustverrechnungstopf.toFixed(2);
          this.steuersatz = +(dataMap1.steuersatz * 100).toFixed(2); // Umwandlung in Prozent
          this.soli = +(dataMap1.soli * 100).toFixed(2); // Umwandlung in Prozent
          this.kirchensteuer = +(dataMap1.kirchensteuer * 100).toFixed(2); // Umwandlung in Prozent
          this.steuerfreibetrag = +dataMap1.freibetrag.toFixed(2);

          // Optional: Initialisierung von kapitalgewinne_brutto und steuerbelastung basierend auf historischen Werten
          const today = new Date().toLocaleDateString('de-DE');
          if (historicalAccountValues && historicalAccountValues[today]) {
            this.kapitalgewinne_brutto = +historicalAccountValues[today].toFixed(2);
            this.calculateSteuerbelastung();
          }
        } else {
          console.error('Failed to fetch account values:', response.message);
        }
      },
      (error: any) => {
        console.error('Error fetching account values:', error);
      }
    );
  }

  toggleSteuerinfo() {
    const steuerinfo = document.getElementById('Steuerinfo');
    if (steuerinfo) {
      steuerinfo.style.display = steuerinfo.style.display === 'none' ? 'block' : 'none';
    }
  }

  onInputChange() {
    this.calculateSteuerbelastung();
  }

  calculateSteuerbelastung() {
    const zuVersteuerndeEinkommen = this.kapitalgewinne_brutto - this.verlustverrechnungstopf;
    const gesamtSteuersatz = this.steuersatz + this.soli + this.kirchensteuer;

    if (zuVersteuerndeEinkommen < this.steuerfreibetrag) {
      this.steuerbelastung = +(zuVersteuerndeEinkommen * gesamtSteuersatz / 100).toFixed(2);
    } else {
      this.steuerbelastung = +((zuVersteuerndeEinkommen - this.steuerfreibetrag) * gesamtSteuersatz / 100).toFixed(2);
    }
    this.kapitalgewinne_netto = +(this.kapitalgewinne_brutto - this.steuerbelastung).toFixed(2);
  }

  onReset() {
    this.steuersatz = 0;
    this.steuerfreibetrag = 0;
    this.soli = 0;
    this.kirchensteuer = 0;
    this.verlustverrechnungstopf = 0;
    this.kapitalgewinne_brutto = 0;
    this.steuerbelastung = 0;
    this.kapitalgewinne_netto = 0;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    // Hier könnten weitere Aktionen bei Formulareinreichung ausgeführt werden
    console.log('Form submitted!');
  }
}
