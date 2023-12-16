import { Component, OnInit } from '@angular/core';
import { SharedDataService} from "../../../services/shared-data.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  isExpertMode: boolean = false;
  isServeurMode: boolean = false;
  selectedNumberOfCooks: string = '4';

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    this.isExpertMode = this.sharedDataService.getMode() === 'expert';
  }

  onExpertModeChange(): void {
    this.sharedDataService.setMode(this.isExpertMode ? 'expert' : 'novice');
  }

  onServeurModeChange(): void {
    this.sharedDataService.setServeurMode(this.isServeurMode);
  }

  selectNumberOfCooks(numberOfCooks: number): void {
    // Check if numberOfCooks is within the allowed range
    if (numberOfCooks >= 1 && numberOfCooks <= 4) {
      this.selectedNumberOfCooks = numberOfCooks.toString();
      this.sharedDataService.numberOfCooks = numberOfCooks as 1 | 2 | 3 | 4;
    } else {
      console.error("Invalid numberOfCooks value. Must be in the range 1-4.");
    }
  }



}
