import { Component } from '@angular/core';
import { InstallReferrerResponse } from 'install-referrer';
import { AlertController, LoadingController, NavController } from 'ionic-angular';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public pluginConnected = false;
  public params: InstallReferrerResponse;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    const loader = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loader.present();

    const interval = setInterval(() => {
      if (cordova.plugins != undefined) {
        loader.dismiss();
        clearInterval(interval);
      }
    }, 100);
  }

  createAlert(title, message, handler) {
    const alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: 'Ok',
        handler: () => handler()
      }]
    })
    alert.present();
  }

  getParams() {
    cordova.plugins.InstallReferrer.getParams((params) => {
      this.createAlert('Success', 'Params received', () => { this.params = params; this.pluginConnected = false });
    },
    (err) => {
      this.createAlert('Error', err, () => { this.pluginConnected = false });
    });
  }

  close() {
    cordova.plugins.InstallReferrer.close(() => {
      this.pluginConnected = false;
      this.params = null;
    },
    err => {
      this.createAlert('Error', err, () => { this.pluginConnected = false });
    });
  }

  open() {
    cordova.plugins.InstallReferrer.open((success) => {
      this.createAlert('Success', 'Connected', () => { this.pluginConnected = true });
    },
    err => {
      let pluginStatus = false;
      if (err == 'Connection already started') {
        pluginStatus = true;
      }

      this.createAlert('Error', err, () => { this.pluginConnected = pluginStatus });
    });
  }

  isOpen() {
    cordova.plugins.InstallReferrer.isOpen((success) => {
      this.createAlert('Status', 'Client ' + (success ? 'connected' : 'disconnected'), () => { this.pluginConnected = success });
    },
    err => {
      this.createAlert('Error', err, () => { this.pluginConnected = false });
    });
  }

}
