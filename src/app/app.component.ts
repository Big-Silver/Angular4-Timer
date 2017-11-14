import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { Configuration } from '../config/consts'

@Component({
  selector: 'app-root',
  providers: [Configuration],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private timer;
  private bg_timer;
  ticks:       number = 0;
  store_ticks: number = 0;
  bg_ticks:    number = 0;

  minutesDisplay: number = 0;
  hoursDisplay:   number = 0;
  secondsDisplay: number = 0;

  pre_time: number = 0;
  cur_time: number = 0;

  isPlayed: boolean = false;
  isPaused: boolean = false;
  sSTBtn:   boolean = false;
  sSPBtn:   boolean = false;
  sREBtn:   boolean = false;
  sWTBtn:   boolean = false;

  start_btn:  string = 'START';
  stop_btn:   string = 'STOP';
  reset_btn:  string = 'RESET';
  wait_btn:   string = 'WAIT';

  sub: Subscription;
  bg_sub: Subscription;

  constructor(private _config: Configuration) {}

  ngOnInit() {
    this.sSTBtn = true;
    this.bg_timer = Observable.timer(0, this._config.DEFAULT_WAIT_TIME);
    this.bg_sub = this.bg_timer.subscribe(
      e => {
        this.bg_ticks = e;
      }
    )
  }

  private startTimer() {
    this.sSTBtn = false;
    this.sSPBtn = true;
    this.sREBtn = true;
    this.sWTBtn = true;
    this.timer = Observable.timer(1, this._config.DEFAULT_TIME);
    if (!this.isPaused) {
      this.sub = this.timer.subscribe(
        t => {
          this.ticks = t;
          this.secondsDisplay = this.getSeconds(this.ticks);
          this.minutesDisplay = this.getMinutes(this.ticks);
          this.hoursDisplay = this.getHours(this.ticks);
        }
      );
    } else {
      this.start_btn = 'START';
      this.sub = this.timer.subscribe(
        t => {
          this.ticks = t + this.store_ticks;
          this.secondsDisplay = this.getSeconds(this.ticks);
          this.minutesDisplay = this.getMinutes(this.ticks);
          this.hoursDisplay = this.getHours(this.ticks);
        }
      )
    };
    this.isPlayed = true;
    this.isPaused = false;
  };

  private resetTimer() {
    this.sub.unsubscribe();
    this.start_btn = 'START';

    this.minutesDisplay  = 0;
    this.hoursDisplay    = 0;
    this.secondsDisplay  = 0;

    this.ticks        = 0;
    this.store_ticks  = 0;
    this.isPaused     = false;
    this.isPlayed     = false;

    this.sSTBtn = true;
    this.sSPBtn = false;
    this.sREBtn = false;
    this.sWTBtn = false;
  }

  private stopTimer() {
    this.sub.unsubscribe();
    this.start_btn = 'RESUME';

    this.isPlayed     = false;
    this.isPaused     = true;
    this.store_ticks  = this.ticks;

    this.sSTBtn = true;
    this.sSPBtn = false;
    this.sREBtn = true;
    this.sWTBtn = false;
  }

  private resumeTimer() {
    this.startTimer();
  }

  private waitTimer() {
    if (this.pre_time == 0) {
      this.pre_time = this.bg_ticks;
      return;
    } else {
      if (this.cur_time == 0) {
        this.cur_time = this.bg_ticks;
      } else {
        this.pre_time = this.cur_time;
        this.cur_time = this.bg_ticks;
      }
    }
    if (this.cur_time - this.pre_time < this._config.CLICK_TIME) {
      this.stopTimer();
      this.resumeTimer();
    }
  }

  private getSeconds(ticks: number) {
    return this.pad(ticks % this._config.DEFAULT_MINSEC_TIME);
  }

  private getMinutes(ticks: number) {
    return this.pad((Math.floor(ticks / this._config.DEFAULT_MINSEC_TIME)) % this._config.DEFAULT_MINSEC_TIME);
  }

  private getHours(ticks: number) {
    return this.pad(Math.floor((ticks / this._config.DEFAULT_MINSEC_TIME) / this._config.DEFAULT_MINSEC_TIME));
  }

  private pad(digit: any) {
    return digit <= this._config.CLOCK_DIGIT ? '0' + digit : digit;
  }

  // showStartBtn() {
  //   is
  // }
}
