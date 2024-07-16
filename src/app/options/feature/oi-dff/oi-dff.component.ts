import { Component, inject, OnInit } from '@angular/core';
import { OptionsService } from '../../data-access/options.service';
import { TableComponent } from '../../../shared/ui/table/table.component';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { DateTime } from 'luxon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-oi-dff',
  standalone: true,
  imports: [TableComponent, ChartModule, CalendarModule, CommonModule, FormsModule],
  templateUrl: './oi-dff.component.html',
  styleUrl: './oi-dff.component.scss'
})
export class OiDffComponent implements OnInit {

  isLoading: boolean = false;
  currentDate = new Date();
  oiList:any[] = []
  options = {}
  chartData = {}
  columns = [
    {
      label : 'Time',
      field: 'timestamp',
      dataType: 'time'
    },
    {
      label : 'Call Change',
      field: 'ceChange',
      dataType: 'number'
    },
    {
      label : 'Put Change',
      field: 'peChange',
      dataType: 'number'
    },
    {
      label : 'Diff',
      field: 'diff',
      dataType: 'number'
    },
    {
      label : 'PCR',
      field: 'pcr',
      dataType: 'string'
    },
    {
      label : 'Price',
      field: 'underlyingValue',
      dataType: 'string',
    }
  ];

  optionService = inject(OptionsService);

  ngOnInit(): void {
    console.log(this.currentDate)

    this.getOptionOIData("NIFTY", this.currentDate)
  }

  getOptionOIData(symbol: string, date: Date) {
    const fromDate  = DateTime.fromJSDate(this.currentDate).toFormat('yyyy-MM-dd');
    const toDate  = DateTime.fromJSDate(this.currentDate).plus({day:1}).toFormat('yyyy-MM-dd');
    this.optionService.getOptionOiData(symbol, fromDate ,toDate)?.then((res :any) => {
      this.oiList = res.data;
      this.generateChartData(res.data)
    });
  }

  onDateChange(event: any) {
    this.getOptionOIData("NIFTY", event)
  }

  generateChartData(oiData:any) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    let labels = []
    let data = []
    for(const item of oiData) {
      labels.push(DateTime.fromISO(item.timestamp).toFormat('hh:mm'));
      data.push(item.diff)
    }
    this.chartData = {
      labels: labels,
      datasets: [
          {
              label: 'OI Diff',
              data: data,
              fill: true,
              borderColor: documentStyle.getPropertyValue('--orange-500'),
              tension: 0.4,
              backgroundColor: 'rgba(255,167,38,0.2)'
          }
      ]
  };
  
  this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
          legend: {
              labels: {
                  color: textColor
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder
              }
          },
          y: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder
              }
          }
      }
  };
  }
}
