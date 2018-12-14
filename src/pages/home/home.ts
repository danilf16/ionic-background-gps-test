import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';

declare var window;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  bgGeo: any;

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private geolocation: Geolocation,
    private backgroundMode: BackgroundMode
  ) {
    if (this.platform.is("cordova")) {
      this.platform.ready().then(() => {
        this.backgroundMode.setDefaults({
            title: 'Spot',
            text: "App is active",
            icon: 'ic_stat_icon',
            color: '808080' // hex format like 'F14F4D'
        });

        this.bgGeo = (<any>window).BackgroundGeolocation;
        this.initBackgroundGPS();
      });
    }
  }

  private initBackgroundGPS() {
    console.log("Init background GPS")

    this.geolocation.getCurrentPosition().then((resp) => {
      console.log("Current position: ", resp.coords);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    const config = {
      locationProvider: this.bgGeo.ACTIVITY_PROVIDER,
      desiredAccuracy: this.bgGeo.HIGH_ACCURACY,
      stationaryRadius: 2,
      distanceFilter: 2,
      notificationTitle: 'Spot.',
      notificationText: 'GPS tracking ON',
      debug: false,
      startOnBoot: false,
      stopOnTerminate: true,
      interval: 10000,
      fastestInterval: 2000,
      activitiesInterval: 10000,
      stopOnStillActivity: true,
      pauseLocationUpdates: false,
      saveBatteryOnBackground: false
    };

    this.bgGeo.configure(config);

    this.bgGeo.on('location', (location) => {
        console.log("Location: ", location);

        this.bgGeo.startTask((taskKey) => {
            this.bgGeo.endTask(taskKey);
        });
    });

    this.bgGeo.on('error', (error) => {
        console.log('[ERROR] BackgroundGeolocation error:', error.code, error.message);
    });

    this.bgGeo.on('start', (location) => {
        console.log('[INFO] START');
    });

    this.bgGeo.on('stop', (location) => {
        console.log('[INFO] STOP');
    });
  }

  switchOnBackgroundGPS() {
    console.log("Switch on GPS Tracking")

    if (this.platform.is("cordova")) {
      this.backgroundMode.enable();
      this.bgGeo.start();
    }
  }

  switchOffBackgroundGPS() {
    console.log("Switch off GPS Tracking")

    if (this.platform.is("cordova")) {
      this.bgGeo.stop();
      this.backgroundMode.disable();
    }
  }
}
