// 4.promise原理的简单实现

(function () {

    window.Promise = function Promise(fn) {
        this.state = 0;
        this.value = void 0;
        this.callbacks = [];
        fn(resolve.bind(this), reject.bind(this));
    }

    var resolve = function resolve(value) {
        if (this.state !== 0) return;
        setTimeout(() => {
            this.state = 1;
            this.value = value;
            this.callbacks.forEach(callback => handle.call(this, callback));
        }, 0);
    }

    var reject = function reject(value) {
        if (this.state !== 0) return;
        setTimeout(() => {
            this.state = 2;
            this.value = value;
            this.callbacks.forEach(callback => handle.call(this, callback));
        }, 0);
    }


    var handle = function handle(callback) {
        if (this.state === 0) {
            this.callbacks.push(callback);
            return;
        }

        if (this.state === 1) {
            var result = this.value;
            if (typeof callback.onFulfilled === "function") {
                result = callback.onFulfilled(this.value);
            }
            callback.resolve(result);
            return;
        }

        if (this.state === 2) {
            var result = this.value;
            if (typeof callback.onRejected === "function") {
                result = callback.onRejected(this.value);
            }
            callback.reject(result);
            return;
        }
    }

    Promise.prototype.then = function (onFulfilled, onRejected) {
        var srlf = this;
        return new Promise(function (resolve, reject) {
            handle.call(srlf, {
                onFulfilled: onFulfilled,
                onRejected: onRejected,
                resolve: resolve,
                reject: reject
            });
        });
    }

    Promise.prototype.catch = function (onRejected) {
        return this.then(null, onRejected);
    }

})();

// example
new Promise(function (resolve, reject) {
    setTimeout(() => {
        reject("test");
    }, 1000);
}).then(function (val) {
    console.log(val);
    return "1223213"
}).catch(function (val) {
    console.log(val);
    return val;
}).then(function (val) {
    console.log(val);
}).catch(function (val) {
    console.log(val);
})
console.log(1);