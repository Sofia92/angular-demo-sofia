import {
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  Component,
  NgZone,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CongregationScrollEvent } from './congregation-scroll-event';
import { isElementsCross } from './util';

interface ISourceData {
  showState: boolean;
  id: number;
  label: string;
}
@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styles: [
    `
  .data-group{
    height: calc(100vh - 260px);
    font-size: 14px;
    overflow: auto;
    border: 1px solid #c4c4c4;
  }
  .placeholder {background: #f2f8ff; font-size: 12px;}
  `,
  ],
})
export class PerformanceComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
  public sourceData: ISourceData[];
  public activeDataSet: any;
  public pageWrapper: any;
  public congregationScrollEvent = new CongregationScrollEvent();
  public isLoading: boolean;

  constructor(private zone: NgZone) {
    this.sourceData = Object.keys(Array.from({ length: 300 })).map(
      (item, i) => {
        return { showState: true, id: i + 1, label: item };
      }
    );
    this.activeDataSet = new Set();
  }
  public ngOnInit(): void {
    this.sourceData.forEach((data) => this.activeDataSet.add(data.id));
    this.scrollContentIntoView();
  }

  public ngAfterViewInit(): void {
    this.pageWrapper = document.querySelector('.data-group');
    if (this.pageWrapper) {
      this.zone.runOutsideAngular(() => {
        fromEvent(this.pageWrapper, 'scroll')
          .pipe(debounceTime(200))
          .subscribe(() => {
            this.zone.run(() => {
              this.scrollContentIntoView();
            });
          });
      });
    }
    this.congregationScrollEvent.addScrollFun(this.zone, this.pageWrapper);
  }

  public ngAfterViewChecked(): void {
    if (!!this.sourceData.find((data) => this.activeDataSet.has(data.id))) {
      return;
    }
    this.activeDataSet.clear();
    this.sourceData.forEach((data) => this.activeDataSet.add(data.id));
  }

  public ngOnDestroy(): void {
    this.congregationScrollEvent.removeScrollFun(this.pageWrapper);
  }

  public scrollContentIntoView(): void {
    const dataGroup = document.querySelectorAll('.data-item');
    [].slice.call(dataGroup).forEach((data, index) => {
      const dataItem = data as Element;
      const cross = isElementsCross(this.pageWrapper, dataItem);
      const currentData = this.sourceData[index];
      const { height: dataItemHeight } = dataItem.getBoundingClientRect();
      if (!currentData || !currentData?.showState) {
        return;
      }
      console.log({ id: currentData.id, cross });
      if (cross) {
        this.activeDataSet.add(currentData.id);
      } else {
        dataItem['style']['min-height'] = `${dataItemHeight || 40}px`;
        this.activeDataSet.delete(currentData.id);
      }
    });
  }

  public checkDataActive(data: ISourceData): boolean {
    if (this.isLoading) {
      return true;
    }
    if (data.showState) {
      return this.activeDataSet.has(data.id);
    } else {
      return false;
    }
  }

  public checkShowPlaceholder(data: ISourceData): boolean {
    if (data.showState) {
      return !this.checkDataActive(data);
    } else {
      return false;
    }
  }
}
