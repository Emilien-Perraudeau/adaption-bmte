import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentDateTime!: string;

  ngOnInit() {
    this.updateDateTime();
    // Mettez à jour l'heure toutes les secondes
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  private updateDateTime() {
    const currentDate = new Date();
    this.currentDateTime = currentDate.toLocaleTimeString(); // Vous pouvez également utiliser d'autres méthodes pour formater l'heure
  }
}
