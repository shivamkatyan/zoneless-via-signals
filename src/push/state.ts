import {Injector, ChangeDetectorRef} from '@angular/core'

type StateUpdateFn<S> = (previousState:S, props?:any) => S;



export function withState<S>(Base = class {}){
  return class extends Base {
    _pending = false;
    _queue = [];
    _cdr:ChangeDetectorRef;
    _stateInternal:S;
    initialState?:S;
    constructor(injector:Injector){
      super();
      this._cdr = injector.get(ChangeDetectorRef);
    }
    get state(){
      return this._stateInternal || this.initialState || {};
    }
    setState(partialStateOrUpdateFn:Partial<S> | StateUpdateFn<S>, callback?:() => void){
      
      this._scheduleSetState(this, partialStateOrUpdateFn, callback);
    }

    protected replaceState(newState:S){
      this._stateInternal = newState;
    }

    private _scheduleSetState(instance, partialStateOrUpdateFn:Partial<S> | StateUpdateFn<S>, callback){
      this._queue.push([instance, partialStateOrUpdateFn, callback]);
      this._scheduleUpdate();
    }

    private _render(){
      this._cdr.detectChanges();
    }

    private _update(){
      let currentState = this.state as S;
      while(this._queue.length > 0){
        let [instance, partialStateOrUpdateFn, callback] = this._queue.shift();
        if(typeof partialStateOrUpdateFn === 'function'){
          partialStateOrUpdateFn = partialStateOrUpdateFn.call(instance, currentState)
        }
        currentState = Object.assign({}, currentState, partialStateOrUpdateFn);

        if(callback){
          callback();
        }
      }
      this.replaceState(currentState);
      this._render();
    }

    private _scheduleUpdate(){
      if(this._pending){
        return;
      }
      this._pending = true;
      requestAnimationFrame(() => {
        this._pending = false;
        this._update();
      });
    }

  }
  
}