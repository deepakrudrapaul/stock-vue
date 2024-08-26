import { Component, inject, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeService } from '../data-access/home.service';
import { TableComponent } from 'src/app/shared/ui/table/table.component';
import { getPreviousWeekdayDate } from 'src/app/shared/utils/utils';
import { AppConstants } from 'src/app/shared/utils/app-constants';
import { Stock } from 'src/app/shared/model/stock.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent],
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  dataService = inject(HomeService);

  currentDate = DateTime.now().toFormat('yyyy-MM-dd');
  columns = AppConstants.COLUMNS;

  oiLosersList: Stock[] = [];
  oiGainersList: Stock[] = [];
  indexOiList: Stock[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.setCurrentDate();
    this.getOiGainersData();
    this.getOiLosersData();
    this.getIndexOiData();
  }

  setCurrentDate() {
    if (DateTime.now().hour < 18) {
      this.currentDate = DateTime.fromJSDate(getPreviousWeekdayDate()).toFormat(
        'yyyy-MM-dd'
      );
    }
  }

  getLastTradingDate() {
    if (DateTime.now().weekday > 5) {
      const date = getPreviousWeekdayDate();
      this.currentDate = DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
    }
  }

  async getOiGainersData() {
    this.isLoading = true;
    this.dataService.getOiGainersData(this.currentDate)?.then((res) => {
      this.isLoading = false;
      this.oiGainersList = res.data as Stock[];
    });
  }

  async getOiLosersData() {
    this.isLoading = true;
    this.dataService.getOiLosersData(this.currentDate)?.then((res) => {
      this.isLoading = false;
      this.oiLosersList = res.data as Stock[];
    });
  }

  async getIndexOiData() {
    this.isLoading = true;
    await this.dataService
      .getIndexOiData('NIFTY', this.currentDate)
      ?.then((res) => {
        this.isLoading = false;
        this.indexOiList = res.data as Stock[];
      });
  }
}
