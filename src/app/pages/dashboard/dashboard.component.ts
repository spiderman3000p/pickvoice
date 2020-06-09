import { Component, OnInit } from '@angular/core';
import { map, debounceTime } from 'rxjs/operators';
import Chart from 'chart.js';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from '../../services/auth.service';
import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';
import { FormControl } from '@angular/forms';

const BODY_DUMMY_DATA = [
  {
    period: '2019-05-12',
    rootWork: '455646',
    state: 'WP',
    numberTask: '45',
    progress: 5
  },
  {
    period: '2019-05-12',
    rootWork: '455655',
    state: 'WP',
    numberTask: '455',
    progress: 55
  },
  {
    period: '2019-05-13',
    rootWork: '455646',
    state: 'PE',
    numberTask: '45',
    progress: 6
  },
  {
    period: '2019-05-14',
    rootWork: '455646',
    state: 'CP',
    numberTask: '45',
    progress: 100
  },
  {
    period: '2019-05-14',
    rootWork: '45545546',
    state: 'CP',
    numberTask: '485',
    progress: 100
  },
  {
    period: '2019-05-15',
    rootWork: '455646',
    state: 'CA',
    numberTask: '45',
    progress: 65
  },
  {
    period: '2019-05-16',
    rootWork: '455646',
    state: 'CP',
    numberTask: '45',
    progress: 100
  },
  {
    period: '2019-05-17',
    rootWork: '455646',
    state: 'WP',
    numberTask: '45',
    progress: 35
  },
  {
    period: '2019-05-18',
    rootWork: '455646',
    state: 'PE',
    numberTask: '45',
    progress: 5
  },
  {
    period: '2019-05-18',
    rootWork: '455646',
    state: 'PE',
    numberTask: '45',
    progress: 55
  }
];
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userData: any;
  chartTasks: any;
  chartPlannings: any;
  chartProgress: any;
  isHandset = false;
  tasksChartLabels = [
    {
      name: 'Pending Tasks',
      color: '#fd7e14'
    },
    {
      name: 'Active Tasks',
      color: '#e83e8c'
    },
    {
      name: 'Paused Tasks',
      color: '#6c757d'
    },
    {
      name: 'Completed Tasks',
      color: '#28a745'
    },
    {
      name: 'Canceled Tasks',
      color: '#dc3545'
    },
    {
      name: 'Planned Tasks',
      color: '#6610f2'
    },
    {
      name: 'Received Tasks',
      color: '#007bff'
    }
  ];
  planningProgressChartLabels = [
    {
      name: 'Pending',
      color: '#6c757d'
    },
    {
      name: 'In progress',
      color: '#007bff'
    },
    {
      name: 'Completed',
      color: '#6610f2'
    },
    {
      name: 'Canceled',
      color: '#e83e8c'
    }
  ];
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
        this.isHandset = true;
        this.utilities.log('is handset');
        return [
          { title: 'Card 1', cols: 2, rows: 1 },
          { title: 'Card 2', cols: 2, rows: 1 },
          { title: 'Card 3', cols: 2, rows: 1 },
          { title: 'Card 4', cols: 2, rows: 1 }
        ];
      }
      this.isHandset = false;
      this.utilities.log('is not handset');
      return [
        { title: 'Card 1', cols: 1, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );
  chartsFrom = new FormControl('');
  chartsTo = new FormControl('');
  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService,
              private utilities: UtilitiesService, private dataProviderService: DataProviderService) {
    // this.utilities.log('last url', this.authService.redirectUrl);
    this.chartsFrom.setValue(this.utilities.formatDate(new Date(Date.now() - (30 * 24 * 60 * 60000)), 'YYYY-MM-DD'));
    this.chartsTo.setValue(this.utilities.formatDate(new Date(), 'YYYY-MM-DD'));
    this.utilities.log('this.taskChartTo: ', this.chartsTo.value);
    this.utilities.log('this.taskChartFrom: ', this.chartsFrom.value);
  }

  initCharts() {
    this.calculateTasksChart();
    this.calculatePlanningsChart();
    this.chartsFrom.valueChanges.pipe(debounceTime(1000)).subscribe(date => {
      this.utilities.log('this.chartsFrom: ', date);
      this.calculateTasksChart();
      this.calculatePlanningsChart();
    });
    this.chartsTo.valueChanges.pipe(debounceTime(1000)).subscribe(date => {
      this.utilities.log('this.chartsTo: ', date);
      this.calculateTasksChart();
      this.calculatePlanningsChart();
    });
  }

  calculateTasksChart() {
    this.dataProviderService.getDashboardDataHeader(this.chartsFrom.value, this.chartsTo.value)
    .subscribe(result => {
      if (result) {
        this.generateTasksChartData(result);
      }
      this.utilities.log('Results dashboard header data: ', result);
    });
    this.dataProviderService.getDashboardDataBody().subscribe(result => {
      this.utilities.log('Results dashboard body data: ', result);
    });
  }

  calculatePlanningsChart() {
    this.dataProviderService.getDashboardDataBody(this.chartsFrom.value, this.chartsTo.value)
    .subscribe(result => {
      if (result) {
        this.generatePlanningsProgressChartData(BODY_DUMMY_DATA);
        this.generatePlanningsStatesChartData(BODY_DUMMY_DATA);
      }
      this.utilities.log('Results dashboard body data: ', result);
    });
  }

  generateTasksChartData(data: any) {
    const colors = [];
    const taskTypes = {
      paused: {
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
      },
      received: {
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
      },
      planned: {
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
      },
      active: {
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
      },
      pending: {
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
      },
      complete: {
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
      },
      canceled: {
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
    };
    data.forEach(element => {
      // received
      taskTypes.received.data.push({ t: new Date(element.period), y: element.received});
      // planned
      taskTypes.planned.data.push({ t: new Date(element.period), y: element.planned});
      // active
      taskTypes.active.data.push({ t: new Date(element.period), y: element.active});
      // paused
      taskTypes.paused.data.push({ t: new Date(element.period), y: element.paused});
      // complete
      taskTypes.complete.data.push({ t: new Date(element.period), y: element.complete});
      // canceled
      taskTypes.canceled.data.push({ t: new Date(element.period), y: element.cenceled});
      // pending
      taskTypes.pending.data.push({ t: new Date(element.period), y: element.pending});
    });
    this.chartTasks.data.datasets = [].concat(taskTypes.pending, taskTypes.active,
      taskTypes.paused, taskTypes.complete, taskTypes.canceled, taskTypes.planned,
      taskTypes.received);
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
    this.utilities.log('new datasets', this.chartTasks.data.datasets);
    this.chartTasks.update();
  }

  generatePlanningsProgressChartData(data: any) {
    const newData = [];
    const states = {
      PE: 0,
      WP: 0,
      CP: 0,
      CA: 0
    };
    const progressAverage = {
      PE: 0,
      WP: 0,
      CP: 0,
      CA: 0
    };
    const dateProgressAvg = {};
    data.forEach(element => {
        states[element.state]++;
        progressAverage[element.state] += element.progress;
        dateProgressAvg[element.period] = dateProgressAvg[element.period] ?
        dateProgressAvg[element.period] + element.progress : 0;
    });
    Object.keys(states).forEach(state => {
      progressAverage[state] = progressAverage[state] / states[state];
      newData.push(states[state]);
    });
    this.chartPlannings.data.datasets[0].data = newData;
    this.utilities.log('new plannings data set: ', this.chartPlannings.data.datasets[0]);
    this.chartPlannings.update();
  }

  generatePlanningsStatesChartData(data: any) {
    const colors = [];
    const planningStates = {
      PE: {
          label: 'Pending',
          fill: false,
          borderColor: '#6c757d',
          backgroundColor: '#6c757d',
          pointBorderColor: '#6c757d',
          pointRadius: 1,
          pointHoverRadius: 1,
          pointBorderWidth: 1,
          borderWidth: 1,
          data: []
      },
      WP: {
          label: 'In Progress',
          fill: false,
          borderColor: '#007bff',
          backgroundColor: '#007bff',
          pointBorderColor: '#007bff',
          pointRadius: 1,
          pointHoverRadius: 1,
          pointBorderWidth: 1,
          borderWidth: 1,
          data: []
      },
      CP: {
          label: 'Completed',
          fill: false,
          borderColor: '#6610f2',
          backgroundColor: '#6610f2',
          pointBorderColor: '#6610f2',
          pointRadius: 1,
          pointHoverRadius: 1,
          pointBorderWidth: 1,
          borderWidth: 1,
          data: []
      },
      CA: {
          label: 'Canceled',
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
    };
    const dates = {};
    data.forEach(element => {
      if (dates[element.period]) {
        if (dates[element.period][element.state]) {
          dates[element.period][element.state]++;
        } else {
          dates[element.period][element.state] = 1;
        }
      } else {
        dates[element.period] = {};
        Object.defineProperty(dates[element.period], element.state, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 1
        });
      }
    });
    this.utilities.log('colected dates: ', dates);
    let value;
    Object.keys(dates).forEach(key => {
      Object.keys(planningStates).forEach(state => {
        value = dates[key][state] ? dates[key][state] : 0;
        planningStates[state].data.push({ t: new Date(key), y: value});
      });
    });

    this.chartProgress.data.datasets = [].concat(planningStates.PE, planningStates.WP,
      planningStates.CP, planningStates.CA);

    if (data.length <= 750) {
      this.chartProgress.options.scales.xAxes[0].time.unit = 'year';
    }
    if (data.length <= 600) {
      this.chartProgress.options.scales.xAxes[0].time.unit = 'month';
    }
    if (data.length <= 366) {
      this.chartProgress.options.scales.xAxes[0].time.unit = 'month';
    }
    if (data.length <= 90) {
      this.chartProgress.options.scales.xAxes[0].time.unit = 'day';
    }
    this.utilities.log('new datasets chart progress: ', this.chartProgress.data.datasets);
    this.chartProgress.update();
  }

  ngOnInit() {
    // Char tasks-line
    const canvasTasks: any = document.getElementById('chartTasks');
    const ctxTasks = canvasTasks.getContext('2d');
    this.chartTasks = new Chart(ctxTasks, {
      type: 'line',
      data: {
        // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        datasets: []
      },
      options: {
        // responsive: true,
        // maintainAspectRatio: true,
        // aspectRatio: 1,
        legend: {
          display: false
        },
        tooltips: {
          enabled: true
        },
        scales: {
          yAxes: [{
            stepSize: 1,
            bounds: 'data',
            ticks: {
              fontColor: '#9f9f9f',
              beginAtZero: true,
              maxTicksLimit: 5,
              // padding: 20
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: '#ccc',
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
              zeroLineColor: 'transparent',
              display: false,
            },
            ticks: {
              source: 'auto',
              padding: 20,
              fontColor: '#9f9f9f'
            }
          }]
        },
      }
    });
    // Char picking plannings-pie
    const canvasPlannings: any = document.getElementById('chartPlannings');
    const ctxPlannings = canvasPlannings.getContext('2d');
    this.chartPlannings = new Chart(ctxPlannings, {
      ready: false,
      type: 'pie',
      data: {
        datasets: [{
          data: [0, 0, 0, 0],
          backgroundColor: ['#6c757d', '#007bff', '#6610f2', '#e83e8c']
        }],
        labels: ['Pending', 'In progress', 'Completed', 'Canceled']
      },
      options: {
        // responsive: true,
        // maintainAspectRatio: true,
        // aspectRatio: 1
      }
    });
    // chart progress with dates-line
    const canvasProgress: any = document.getElementById('chartProgress');
    const ctxProgress = canvasProgress.getContext('2d');
    this.chartProgress = new Chart(ctxProgress, {
      type: 'line',
      data: {
        // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        datasets: []
      },
      options: {
        // responsive: true,
        // maintainAspectRatio: true,
        // aspectRatio: 1,
        legend: {
          display: false
        },
        tooltips: {
          enabled: true
        },
        scales: {
          yAxes: [{
            stepSize: 1,
            bounds: 'data',
            ticks: {
              fontColor: '#9f9f9f',
              beginAtZero: true,
              maxTicksLimit: 5,
              // padding: 20
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: '#ccc',
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
              zeroLineColor: 'transparent',
              display: false,
            },
            ticks: {
              source: 'auto',
              padding: 20,
              fontColor: '#9f9f9f'
            }
          }]
        },
      }
    });
    const element = document.getElementById('date-filters');
    const elementPosition = element.offsetTop;
    document.querySelector('.mat-sidenav-content').addEventListener('scroll', function(event) {
      const posTop = this.scrollTop;
      // this.utilities.log('top distance: ', posTop);
      if (posTop > 90) {
        element.style.position = 'fixed';
        element.style.top = '0';
        if (!this.isHandSet) {
          element.style.width = '75%';
        } else {
          element.style.width = '90%';
        }
      } else {
        element.style.position = 'relative';
        element.style.top = 'auto';
        element.style.width = 'unset';
      }
    });
    this.initCharts();
  }
}
