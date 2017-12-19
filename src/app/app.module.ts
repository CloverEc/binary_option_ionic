import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { MyPage } from '../pages/my/my';
import { HomePage } from '../pages/home/home';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import {Chart} from 'chart.js';
import { RestProvider } from '../providers/rest/rest'; 
import { HttpClientModule } from '@angular/common/http';

// const config: SocketIoConfig = { url: 'api.bitfinex.com', options: {} }

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    MyPage,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
   // SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    MyPage,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider
  ]
})
export class AppModule {}
