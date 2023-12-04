import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  isExpertMode: boolean = false;
  selectedNumberOfCooks: string = '4';

  constructor() { }

  ngOnInit(): void {
  }

  selectNumberOfCooks(numberOfCooks: number): void {
    this.selectedNumberOfCooks = numberOfCooks.toString();
    // Add any additional logic you need here
  }
}
