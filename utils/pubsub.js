import EventsEmitter from 'events';
import uuid from 'uuid';

export const REGISTER_ASYNC = 'REGISTER_ASYNC';
export const FINISH_ASYNC = 'FINISH_ASYNC';
export const ALL_PROCESS_FINISH = 'ALL_PROCESS_FINISH';
export const VERIFY_ALL_PROCESS = 'VERIFY_ALL_PROCESS';

export default class PubSub extends EventsEmitter {

  constructor () {
    super();
    this.listAsync = [];
    this.on(REGISTER_ASYNC, this._registerAsync);
    this.on(FINISH_ASYNC, this._finishAsync);
    this.on(VERIFY_ALL_PROCESS, this._verifyAllProcess);
  }

  publish (name, object) {
    return new Promise(resolve => {

      let customObject = {};

      if (name === REGISTER_ASYNC) {
        customObject.id = uuid.v1();
      }

      this.emit(name, Object.assign({}, object, customObject));

      resolve(customObject.id ? customObject.id : undefined);
    });
  }

  _registerAsync ({ id }) {
    this.listAsync.push(id);
  }

  _finishAsync (id) {
    this.listAsync.splice(this.listAsync.indexOf(id), 1);
    this.emit(VERIFY_ALL_PROCESS);
  }
  
  _verifyAllProcess () {
    if (this.listAsync.length === 0) {
      this.emit(ALL_PROCESS_FINISH);
    }
  }

}

export const instance = new PubSub();