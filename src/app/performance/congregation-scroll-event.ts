export class CongregationScrollEvent {
  public addScrollFun(zone: any, pageWrapper): void {
    zone.runOutsideAngular(() => {
      if (pageWrapper) {
        pageWrapper.addEventListener('scroll', this.resetActivedState, false);
      }
    });
  }

  public removeScrollFun(pageWrapper): void {
    if (pageWrapper) {
      pageWrapper.removeEventListener('scroll', this.resetActivedState, false);
    }
  }

  public resetActivedState = () => {
    const congregationWrapper = document.querySelectorAll('#optionsWrap');
    if (!!congregationWrapper) {
      [].slice.call(congregationWrapper).forEach((cmp) => {
        const cmpItem = cmp as Element;
        cmpItem['style']['display'] = 'none';
      });
    }
  };
}
