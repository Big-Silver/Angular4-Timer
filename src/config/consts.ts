import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public CLICK_TIME: number = 3;
    public DEFAULT_TIME: number = 1000;
    public DEFAULT_WAIT_TIME: number = 300;
    public DEFAULT_MINSEC_TIME: number = 60;
    public CLOCK_DIGIT: number = 9;
}
