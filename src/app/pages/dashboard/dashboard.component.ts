import { Component, OnInit } from '@angular/core';
import { map, debounceTime } from 'rxjs/operators';
import Chart from 'chart.js';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from '../../services/auth.service';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  chartTasks: any;
  /** Based on the screen size, switch from standard to one column per row */
  topCards = [
    {
      icon: 'widgets',
      title: 'Items',
      subtitle: 0,
      class: 'text-warning',
      footer: {
        text: '',
        icon: 'alarm'
      }
    },
    {
      icon: 'my_location',
      title: 'Locations',
      subtitle: 0,
      class: 'text-success',
      footer: {
        text: '',
        icon: 'alarm'
      }
    },
    {
      icon: 'storage',
      title: 'Orders',
      subtitle: 0,
      class: 'text-primary',
      footer: {
        text: '',
        icon: 'alarm'
      }
    },
    {
      icon: 'emoji_emotions',
      title: 'Customers',
      subtitle: 0,
      class: 'text-secondary',
      footer: {
        text: '',
        icon: 'alarm'
      }
    }
  ];
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        this.utilities.log('is handset');
        return [
          { title: 'Card 1', cols: 2, rows: 1 },
          { title: 'Card 2', cols: 2, rows: 1 },
          { title: 'Card 3', cols: 2, rows: 1 },
          { title: 'Card 4', cols: 2, rows: 1 }
        ];
      }
      this.utilities.log('is not handset');
      return [
        { title: 'Card 1', cols: 1, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );
  taskChartFrom = new FormControl('');
  taskChartTo = new FormControl('');
  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService,
              private utilities: UtilitiesService, private dataProviderService: DataProviderService) {
    this.utilities.log('last url', this.authService.redirectUrl);
    this.taskChartFrom.setValue(this.utilities.formatDate(new Date(Date.now() - (365 * 24 * 60 * 60000)), 'YYYY-MM-DD'));
    this.taskChartTo.setValue(this.utilities.formatDate(new Date(), 'YYYY-MM-DD'));
    console.log('this.taskChartTo: ', this.taskChartTo.value);
    console.log('this.taskChartFrom: ', this.taskChartFrom.value);
    this.calculateTaskChart();
    this.taskChartFrom.valueChanges.pipe(debounceTime(1000)).subscribe(date => {
      console.log('this.taskChartFrom: ', date);
      this.calculateTaskChart();
    });
    this.taskChartTo.valueChanges.pipe(debounceTime(1000)).subscribe(date => {
      console.log('this.taskChartTo: ', date);
      this.calculateTaskChart();
    });
  }

  calculateTaskChart() {
    this.dataProviderService.getDashboardDataHeader(this.taskChartFrom.value, this.taskChartTo.value)
    .subscribe(result => {
      if (result) {
        this.generateData(result);
      }
      console.log('Results dashboard header data: ', result);
    });
    this.dataProviderService.getDashboardDataBody().subscribe(result => {
      console.log('Results dashboard body data: ', result);
    });
  }

  generateData(data: any) {
    const colors = [];
    const taskTypes = [
      {
        type: 'paused',
        data: {
          label: 'Paused Tasks',
          fill: false,
          borderColor: '#6c757d',
          backgroundColor: '#6c757d',
          pointBorderColor: '#6c757d',
          pointRadius: 1,
          pointHoverRadius: 1,
          pointBorderWidth: 1,
          borderWidth: 1,
          data: []
        }
      },
      {
        type: 'received',
        data: {
          label: 'Received Tasks',
          fill: false,
          borderColor: '#007bff',
          backgroundColor: '#007bff',
          pointBorderColor: '#007bff',
          pointRadius: 1,
          pointHoverRadius: 1,
          pointBorderWidth: 1,
          borderWidth: 1,
          data: []
        }
      },
      {
        type: 'planned',
        data: {
          label: 'Planned Tasks',
          fill: false,
          borderColor: '#6610f2',
          backgroundColor: '#6610f2',
          pointBorderColor: '#6610f2',
          pointRadius: 1,
          pointHoverRadius: 1,
          pointBorderWidth: 1,
          borderWidth: 1,
          data: []
        }
      },
      {
        type: 'active',
        data: {
          label: 'Active Tasks',
          fill: false,
          borderColor: '#e83e8c',
          backgroundColor: '#e83e8c',
          pointBorderColor: '#e83e8c',
          pointRadius: 1,
          pointHoverRadius: 1,
          pointBorderWidth: 1,
          borderWidth: 1,
          data: []
        }
      },
      {
        type: 'pending',
        data: {
          label: 'Pending Tasks',
          fill: false,
          borderColor: '#fd7e14',
          backgroundColor: '#fd7e14',
          pointBorderColor: '#fd7e14',
          pointRadius: 1,
          pointHoverRadius: 1,
          pointBorderWidth: 1,
          borderWidth: 1,
          data: []
        }
      },
      {
        type: 'complete',
        color: '',
        data: {
          label: 'Completed Tasks',
          fill: false,
          borderColor: '#28a745',
          backgroundColor: '#28a745',
          pointBorderColor: '#28a745',
          pointRadius: 1,
          pointHoverRadius: 1,
          pointBorderWidth: 1,
          borderWidth: 1,
          data: []
        }
      },
      {
        type: 'canceled',
        data: {
          label: 'Canceled Tasks',
          fill: false,
          borderColor: '#dc3545',
          backgroundColor: '#dc3545',
          pointBorderColor: '#dc3545',
          pointRadius: 1,
          pointHoverRadius: 1,
          pointBorderWidth: 1,
          borderWidth: 1,
          data: []
        }
      }
    ];
    const receivedIndex = taskTypes.findIndex(taskType => taskType.type === 'received');
    const plannedIndex = taskTypes.findIndex(taskType => taskType.type === 'planned');
    const activeIndex = taskTypes.findIndex(taskType => taskType.type === 'active');
    const pausedIndex = taskTypes.findIndex(taskType => taskType.type === 'paused');
    const completedIndex = taskTypes.findIndex(taskType => taskType.type === 'complete');
    const canceledIndex = taskTypes.findIndex(taskType => taskType.type === 'canceled');
    const pendingIndex = taskTypes.findIndex(taskType => taskType.type === 'pending');
    const receiveds = taskTypes[receivedIndex];
    const planneds = taskTypes[plannedIndex];
    const actives = taskTypes[activeIndex];
    const pauseds = taskTypes[pausedIndex];
    const completeds = taskTypes[completedIndex];
    const canceleds = taskTypes[canceledIndex];
    const pendings = taskTypes[pendingIndex];

    data.forEach(element => {
      // received
      receiveds.data.data.push({ t: new Date(element.period), y: element.received});
      // planned
      planneds.data.data.push({ t: new Date(element.period), y: element.planned});
      // active
      actives.data.data.push({ t: new Date(element.period), y: element.active});
      // paused
      pauseds.data.data.push({ t: new Date(element.period), y: element.paused});
      // complete
      completeds.data.data.push({ t: new Date(element.period), y: element.complete});
      // canceled
      canceleds.data.data.push({ t: new Date(element.period), y: element.cenceled});
      // pending
      pendings.data.data.push({ t: new Date(element.period), y: element.pending});
    });
    this.chartTasks.data.datasets = [].concat(pendings.data, actives.data, pauseds.data, completeds.data,
      canceleds.data, planneds.data, receiveds.data);
    if (data.length <= 750) {
      this.chartTasks.options.scales.xAxes[0].time.unit = 'year';
    }
    if (data.length <= 600) {
      this.chartTasks.options.scales.xAxes[0].time.unit = 'month';
    }
    if (data.length <= 366) {
      this.chartTasks.options.scales.xAxes[0].time.unit = 'month';
    }
    if (data.length <= 90) {
      this.chartTasks.options.scales.xAxes[0].time.unit = 'day';
    }
    console.log('new datasets', this.chartTasks.data.datasets);
    this.chartTasks.update();
  }

  ngOnInit() {
    const chartColor = "#FFFFFF";
    const canvas: any = document.getElementById('chartTasks');
    const ctx = canvas.getContext('2d');

    this.chartTasks = new Chart(ctx, {
      type: 'line',
      data: {
        // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        datasets: []
      },
      options: {
        legend: {
          display: true
        },
        tooltips: {
          enabled: true
        },
        scales: {
          yAxes: [{
            stepSize: 1,
            bounds: 'data',
            ticks: {
              fontColor: "#9f9f9f",
              beginAtZero: true,
              maxTicksLimit: 5,
              //padding: 20
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: "#ccc",
              color: 'rgba(255,255,255,0.05)'
            }
          }],
          xAxes: [{
            type: 'time',
            distribution: 'series',
            time: {
              unit: 'month'
            },
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: "transparent",
              display: false,
            },
            ticks: {
              source: 'auto',
              padding: 20,
              fontColor: "#9f9f9f"
            }
          }]
        },
      }
    });
  }
}
/**
 * {
fill: false,
borderColor: "#6bd098",
backgroundColor: "#6bd098",
pointBorderColor: "#6bd098",
pointRadius: 4,
pointHoverRadius: 4,
pointBorderWidth: 8,
borderWidth: 3,
data: [
  {
  t: new Date('2020-01-01'),
  y: 25
  },
  {
    t: new Date('2020-01-02'),
    y: 310
  },
  {
    t: new Date('2020-01-03'),
    y: 316,
  },
  {
  t: new Date('2020-01-04'),
  y: 316,
  },
  {
  t: new Date('2020-01-05'),
  y: 345,
  },
  {
  t: new Date('2020-01-06'),
  y: 346,
  },
  {
  t: new Date('2020-01-07'),
  y: 350,
  }]
},
{
fill: false,
borderColor: "#f17e5d",
backgroundColor: "#f17e5d",
pointBorderColor: "#f17e5d",
pointRadius: 4,
pointHoverRadius: 4,
pointBorderWidth: 8,
borderWidth: 3,
data: [
  {
  t: new Date('2020-01-01'),
  y: 36
  },
  {
    t: new Date('2020-01-02'),
    y: 320
  },
  {
    t: new Date('2020-01-03'),
    y: 356,
  },
  {
  t: new Date('2020-01-04'),
  y: 336,
  },
  {
  t: new Date('2020-01-05'),
  y: 356,
  },
  {
  t: new Date('2020-01-06'),
  y: 368,
  },
  {
  t: new Date('2020-01-07'),
  y: 370,
  }]
 */