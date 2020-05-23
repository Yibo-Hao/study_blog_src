export default function myBind(context, ...args) {
  const fn = this;
  args = args ? args : [];
  return function newFn(...newFnArgs) {
      if (this instanceof newFn){
          return new fn(...args,...newFnArgs)
      }
    return fn.call(context, ...args, ...newFnArgs);
  };
}

