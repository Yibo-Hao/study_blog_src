class EventHub {
  private cache: {[key:string]:Array<(...data) => void>} = {};
  on(eventName: string, fn: (data: unknown)=>void) {
    this.cache[eventName] = this.cache[eventName] || [];
    this.cache[eventName].push(fn);
  }
  emit(eventName: string, ...data) {
    (this.cache[eventName] || []).forEach(fn => {
      fn(...data);
    });
  }
  off(eventName: string, fn) {
    this.cache[eventName] = this.cache[eventName] || [];
    let index = undefined;
    for (let i = 0; i < this.cache[eventName].length; i++) {
      if (this.cache[eventName][i] === fn) {
        index = i;
        break;
      }
    }
    if (index === undefined) {
      return;
    } else {
      this.cache[eventName].splice(index, 1);
    }
  }
}

export default EventHub;
