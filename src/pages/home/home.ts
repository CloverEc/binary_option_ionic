import { Component,ViewChild } from '@angular/core';
import { NavController,ModalController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import {$WebSocket} from 'angular2-websocket/angular2-websocket'
import {LoginPage} from '../login/login'
import { RestProvider } from '../../providers/rest/rest'; 
declare let Chart: any
var id = 'bitfinex';
var buf = {}; 
buf[id] = [[],[]];

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  chart: any
  data: any
  ctx: any
  wsdata: any
  canvas: any
  isEnabled:boolean=false;
  nickname: ''
  x: any
  range: any
  @ViewChild('bitfinex') bitfinex;
  barChart: any;
  ws: any
  constructor(
      public navCtrl: NavController,
      public restProvider: RestProvider,
      public modalCtrl: ModalController
  ) {
      this.range = [ 1,2,3,4,5 ]
      this.x = []

      setTimeout(()=>{
          this.ws = new $WebSocket("wss://api.bitfinex.com/ws/")

          this.ws.onMessage(
              (msg: MessageEvent)=> {
                      var response = JSON.parse(msg.data);
                      if (response[1] === 'te') {    // メッセージタイプ 'te' だけを見る
                          if (response[5] > 0){
                             // if (this.chart.data.datasets[0].data.length < 20){
                                  //this.chart.data.datasets[0].data.shift();
                                  //this.chart.data.datasets[0].data.push({y: response[3],x: response[4]});
                                  //this.chart.annotation.options.annotations[0].value = response[4]
                                  //this.chart.update()
                             // }
                              buf['bitfinex'][0].push({
                                  x: response[3] * 1000, // タイムスタンプ（ミリ秒）
                                  y: response[4]         // 価格（米ドル）
                              });
                          }else{
                              buf['bitfinex'][1].push({
                                  x: response[3] * 1000, // タイムスタンプ（ミリ秒）
                                  y: 18761 
                              });
                          } 
                      }
                  },
              {autoApply: false}
          );
          let json = JSON.stringify({"event": "subscribe", "channel": "trades", "pair": "BTCUSD"})
          this.ws.send(json).subscribe(
              (msg)=> {
                  console.log("next", msg.data);
              },
              (msg)=> {
                  console.log("error", msg);
              },
              ()=> {
                  console.log("complete");
              }
          );



      },200)
  }
  ionViewWillLeave() {
  }


  clickHight(){
    
  }

  ionViewDidLoad() {
      this.isEnabled = true
      this.restProvider.getTimes()
          .then(data => {
              this.wsdata = data.wsdata;
              this.chart.data.datasets[0].data = data.wsdata;
              // this.chart.data.datasets[0].data.push(response[4]);
              // this.chart.annotation.options.annotations[0].value = response[4]
              this.chart.update()
              
       });
      this.data = {
          datasets: [{
              data: [{x: 10000,y: 19200}],
              borderColor: 'rgb(255, 99, 132)', // line color
              backgroundColor: 'rgba(255, 99, 132, 0.5)', // fill color
              pointRadius: 0,
              borderCapStyle: 'round',
              fill: true,                      // no fill
              lineTension: 0,                    // straight line
              scaleGridLineWidth : 1,
          }]
      }
      this.canvas = <HTMLCanvasElement> document.getElementById(id);
      this.ctx = this.canvas.getContext('2d');


         const verticalLinePlugin = {
             getLinePosition: function (chart, pointIndex) {
                 const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
                 const data = meta.data;
                 return data[pointIndex]._model.x;
             },
             renderVerticalLine: function (chartInstance, pointIndex,text) {
                 const lineLeftOffset = this.getLinePosition(chartInstance, pointIndex);
                 const scale = chartInstance.scales['y-axis-0'];
                 const context = chartInstance.chart.ctx;

                 // render vertical line
                 context.beginPath();
                 context.strokeStyle = '#ff0000';
                 context.moveTo(lineLeftOffset, scale.top);
                 context.lineTo(lineLeftOffset, scale.bottom);
                 context.stroke();
                 context.fillStyle = "#ff0000";
                 context.textAlign = 'center';
                 context.fillText(text, lineLeftOffset, (scale.bottom - scale.top) / 2 + scale.top);
             },

             afterDatasetsDraw: function (chart, easing) {
                 if (chart.config.lineAtIndex) {
                     chart.config.lineAtIndex.forEach(pointIndex => this.renderVerticalLine(chart, pointIndex.position,pointIndex.text));
                 }
             }
         };
         Chart.plugins.register(verticalLinePlugin);
         this.chart = new Chart(this.ctx, { 
             type: 'line',
             data: this.data,
             lineAtIndex: [],
             options: {
                 legend: {
                     display: false
                 },
                 animation: {
                     duration: 10,
                     easing: 'linear',
                 },
                 annotation: {
                     annotations: [{
                         type: 'line',
                         mode: 'horizontal',
                         scaleID: 'y-axis-0',
                         value: 18761,
                         borderColor: 'rgb(75, 192, 192)',
                         borderWidth: 1,
                         label: {
                             enabled: false,
                             content: 'Test label'
                         }
                     },
                     { 
                         type: 'line',
                         mode: 'horizontal',
                         scaleID: 'y-axis-0',
                         value: 18761,
                         borderColor: 'rgb(255, 99, 132, 0.2)',
                         borderWidth: 1,
                         label: {
                             enabled: false,
                             content: 'Test label'
                         }
                     }]
                 },
                 yAxes: [{
                     display: true
                 }]
             }
     })

      this.canvas.onclick = (evt) =>{
          // this.chart.annotation.options.annotations[0].value = 19610
          // this.chart.config.lineAtIndex = [1]
          // this.chart.update()
      }
  }

   loginModal() {
      let profileModal = this.modalCtrl.create(LoginPage);
      profileModal.present();
    }
}
