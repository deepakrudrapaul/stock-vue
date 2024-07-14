import { Component, inject, OnInit } from '@angular/core';
import { OptionsService } from '../../data-access/options.service';
import { TableComponent } from '../../../shared/ui/table/table.component';
import { ChartModule } from 'primeng/chart';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-oi-dff',
  standalone: true,
  imports: [TableComponent, ChartModule],
  templateUrl: './oi-dff.component.html',
  styleUrl: './oi-dff.component.scss'
})
export class OiDffComponent implements OnInit {

  isLoading: boolean = false;
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
    this.getOptionOIData("NIFTY", "2024-07-12")
  }

  getOptionOIData(symbol: string, date: any) {
    this.optionService.getOptionOiData(symbol, date)?.then((res :any) => {
      this.oiList = res.data;
      this.generateChartData(res.data)
    });
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
