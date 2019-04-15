import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(translate: TranslateService) {
    translate.setDefaultLang('pl');
    translate.use('pl');
    moment.locale('pl');
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
