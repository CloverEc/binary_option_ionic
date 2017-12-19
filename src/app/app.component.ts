import { Component } from '@angular/core';
import { Platform,IonicPage } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MyPage } from '../pages/my/my';
import { MenuController } from 'ionic-angular'; 
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(
      platform: Platform,
      statusBar: StatusBar,
      splashScreen: SplashScreen,
      public menuCtrl: MenuController
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  login(){
      this.menuCtrl.close();
      this.rootPage = LoginPage;
  }
  home(){
      this.menuCtrl.close();
      this.rootPage = HomePage;
  }
  my(){
      this.menuCtrl.close();
      this.rootPage = MyPage;
  }
}

