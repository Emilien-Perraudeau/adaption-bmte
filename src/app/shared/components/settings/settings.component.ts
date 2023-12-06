import { Component, OnInit } from '@angular/core';
import { SharedDataService} from "../../../services/shared-data.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  isExpertMode: boolean = false;
  selectedNumberOfCooks: string = '4';

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    this.isExpertMode = this.sharedDataService.getMode() === 'expert';
  }

  onExpertModeChange(): void {
    this.sharedDataService.setMode(this.isExpertMode ? 'expert' : 'novice');
  }

  selectNumberOfCooks(numberOfCooks: number): void {
    this.selectedNumberOfCooks = numberOfCooks.toString();
    // Add any additional logic you need here
  }
}
