import {
  Component,
  computed,
  inject,
  OnInit,
  resource,
  signal,
  Signal,
} from '@angular/core';
import { DateTime } from 'luxon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeService } from '../data-access/home.service';
import { TableComponent } from 'src/app/shared/ui/table/table.component';
import { getPreviousWeekdayDate } from 'src/app/shared/utils/utils';
import { AppConstants } from 'src/app/shared/utils/app-constants';


@Component({
  imports: [CommonModule, FormsModule, TableComponent],
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  dataService = inject(HomeService);
  currentDate = signal(this.getCurrentDate());
  columns = AppConstants.COLUMNS;

  indexResource = resource({
    request: () => ({ symbol: 'NIFTY', date: this.currentDate() }),
    loader: ({ request }) =>
      this.dataService.getIndexOiData(request.symbol, request.date),
  });

  oiGainerResource = resource({
    request: () => this.currentDate(),
    loader: ({ request }) => this.dataService.getOiGainersData(request),
  });

  oiLoserResouce = resource({
    request: () => this.currentDate(),
    loader: ({ request }) => this.dataService.getOiLosersData(request),
  });

  oiGainers = computed(() => this.oiGainerResource.value()?.data || []);
  oiLosers = computed(() => this.oiLoserResouce.value()?.data || []);
  indexData = computed(() => this.indexResource.value()?.data || []);

  getCurrentDate() {
    if (DateTime.now().weekday > 5) {
      const date = getPreviousWeekdayDate();
      return DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
    } else if (DateTime.now().hour < 23) {
      return DateTime.fromJSDate(getPreviousWeekdayDate()).toFormat(
        'yyyy-MM-dd'
      );
    } else {
      return DateTime.now().toFormat('yyyy-MM-dd');
    }
  }
}
