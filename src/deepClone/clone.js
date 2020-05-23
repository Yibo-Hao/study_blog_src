class Clone {
  cache = [];
  deepClone(source) {
    if (source instanceof Object) {
      let cacheDist = this.findCache(source);
      if (cacheDist) {
        return cacheDist;
      } else {
        let dist;
        if (source instanceof Array) {
          dist = [];
          for (let key in source) {
            dist[key] = this.deepClone(source[key]);
          }
        } else if (source instanceof Function) {
          dist = function() {
            console.log(source === a);
            return source.bind(this)(...arguments);
          };
        } else if (source instanceof RegExp) {
          dist = new RegExp(source.source, source.flags);
        } else if (source instanceof Date) {
          dist = new Date(source);
        } else {
          dist = {};
          this.cache.push([source, dist]);
          for (let key in source) {
            if (source.hasOwnProperty(key)) {
              dist[key] = this.deepClone(source[key]);
            }
          }
        }
        return dist;
      }
    } else return source;
  }
  findCache(source) {
    for (let i = 0; i < this.cache.length; i++) {
      if (this.cache[i][0] === source) {
        return this.cache[i][1];
      }
    }
    return undefined;
  }
}

let data3 = proxy({ data:{n:0} });
function proxy({data}) {
  let obj = {};
  Object.defineProperty(obj,"n",{
    get() {
      return data.n
    },
    set(value) {
      data.n = value
    }
  });
  return obj
}