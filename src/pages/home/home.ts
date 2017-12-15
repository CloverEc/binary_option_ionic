import { Component,ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import {$WebSocket} from 'angular2-websocket/angular2-websocket'
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
  canvas: any
  nickname: ''
  x: any
  range: any
  @ViewChild('bitfinex') bitfinex;
  barChart: any;
  ws: any
  constructor(
      public navCtrl: NavController
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
                              buf['bitfinex'][0].push({
                                  x: response[3] * 1000, // タイムスタンプ（ミリ秒）
                                  y: response[4]         // 価格（米ドル）
                              });
                          }else{
                              buf['bitfinex'][1].push({
                                  x: response[3] * 1000, // タイムスタンプ（ミリ秒）
                                  y: 17000 
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



      },100)
  }
  ionViewWillLeave() {
  }


  clickHight(){
    
  }

  ionViewDidLoad() {
      this.data = {
      }
      this.canvas = <HTMLCanvasElement> document.getElementById(id);
      this.ctx = this.canvas.getContext('2d');
      Chart.types.Line.extend({
          name: "LineWithLine",
          draw: function () {
              Chart.types.Line.prototype.draw.apply(this, arguments);

              var point = this.datasets[0].points[this.options.lineAtIndex]
                  var scale = this.scale

                      this.chart.ctx.beginPath();
                  this.chart.ctx.moveTo(point.x, scale.startPoint + 24);
              this.chart.ctx.strokeStyle = '#ff0000';
              this.chart.ctx.lineTo(point.x, scale.endPoint);
              this.chart.ctx.stroke();

              this.chart.ctx.textAlign = 'center';
              this.chart.ctx.fillText("TODAY", point.x, scale.startPoint + 12);
          }
      });
      this.chart  = new Chart(this.ctx, {
          type: 'line',
          data: {
              datasets: [
                  {
                      data: [],
                      label: 'Buy',                     // 'buy' price data
                      borderColor: 'rgb(255, 99, 132)', // line color
                      backgroundColor: 'rgba(255, 99, 132, 0.5)', // fill color
                      pointRadius: 0,
                      borderCapStyle: 'round',
                      fill: true,                      // no fill
                      lineTension: 0,                    // straight line
                      scaleGridLineWidth : 1 
                  },
                  {
                      data: [],
                      label: 'Sell',                     // 'buy' price data
                      borderColor: 'rgb(54, 162, 235)', // line color
                      backgroundColor: 'rgba(54, 162, 235, 0.5)', // fill color
                      pointRadius: 0,
                      fill: true,                      // no fill
                      lineTension: 0,                    // straight line
                      scaleGridLineWidth : 1 
                  }
              ]
          },
          options: {
              scales: {
                  xAxes: [{
                      type: 'realtime',
                      gridLines: {
                          highlightVerticalLine: true,
                          highlightLineColor: "rgba(0, 0, 0, 1)",
                          lineWidth: 2,
                          color: "rgba(0, 0, 0, 0.1)"
                      }
                  }]
              },
              animation: {
                  duration: 100, // general animation time
              },
              plugins: {
                  streaming: {
                      duration: 20000, // 300000ミリ秒（5分）のデータを表示
                      onRefresh: function(chart) { // データ更新用コールバック
                          Array.prototype.push.apply(
                              chart.data.datasets[0].data, buf[id][0]
                          );           
                          Array.prototype.push.apply(
                              chart.data.datasets[1].data, buf[id][1]
                          );          
                          buf[id] = [[], []]; 
                      }
                  }
              }
          }
      });
      this.canvas.onclick = (evt) =>{
      }
  }
}
