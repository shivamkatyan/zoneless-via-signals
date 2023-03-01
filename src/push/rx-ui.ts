import {ElementRef, Input, Injector, Output, ViewChild, ChangeDetectorRef} from '@angular/core'
import {Observable, BehaviorSubject, Subscription, of as value$, defer, fromEvent, bindCallback} from 'rxjs'
import {switchMap, share, filter} from 'rxjs/operators';
import {withState} from './state';

const querySlot = n => `ɵ__ngrx_query_${n}`
const outputSlot = n => `ɵ__ngrx_output_${n}`

export const fromEvent$ = (queryStream$, eventName, eventOptions?) => 
  queryStream$.pipe(
      switchMap((target:HTMLElement) => fromEvent(target, eventName, eventOptions))
  )

export function query$(ref){
  return (clz, propName) => {
    
    ViewChild(ref, {read: ElementRef})(clz, querySlot(propName));
    Object.defineProperty(clz, propName, {
      value: defer(() =>  {
        const c = this;
        return value$(c[querySlot(propName)].nativeElement)
      })
    });
  }
}

export function action$(options?){
  return (clz, propName ) => {

  }
}

export function prop$(...args:any[]){
  
  return (clz, propName) => {

  }
}

export function event$(){
  return (clz, propName) => {

  }
}

export function state$(){
  return (clz, propName) => {

  }
}



interface RxAction {
  type: string;
}

function getActions(){}

export function withNgRxUi(Base = withState()){
  const NgRxUiComponent = class extends Base {
    
    private _componentLifecycle$ = new Observable<RxAction>(sink => {
        this._next = sink.next.bind(sink);
        this._complete = sink.complete.bind(sink);
    }).pipe(share());

    ngOnInit$ = this._componentLifecycle$.pipe(filter(event => event.type === 'ngOnInit'));
    ngOnDestroy$ = this._componentLifecycle$.pipe(filter(event => event.type === 'ngOnInit'));

    private _componentSubscription = this._componentLifecycle$.subscribe();
    ngOnInit = () => this._next({type: 'ngOnDestroy'});
    ngOnDestroy = () => {
      this._next({type: 'ngOnDestroy'});
      this._complete();
    }
    _next = (action:any) => { throw new Error('should not fire!') }
    _complete = () => { throw new Error('should not fire!') }
  }

  return NgRxUiComponent;
}