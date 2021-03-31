
//2.分别实现观察者模式和发布订阅模式的demo
; (function () {
    // 观察者模式
    function Observer() {
        var monitors = {};

        this.on = function (eventType, cb) {
            if (typeof cb !== "function") {
                throw Error("传入的回调必须是 function 类型");
            }

            var callbacks = monitors[eventType];
            if (callbacks === void 0) {
                callbacks = [cb];
            } else {
                callbacks.push(cb);
            }

            monitors[eventType] = callbacks;
        }

        this.off = function (eventType, cb) {
            if (typeof cb !== "function") {
                throw Error("传入的回调必须是 function 类型");
            }

            var callbacks = monitors[eventType];

            if (callbacks === void 0) {
                throw Error("未声明 " + eventType + "事件");
            }

            monitors[eventType] = callbacks.filter(callback => callback !== cb);
        }

        this.emit = function (eventType, ...arge) {
            var callbacks = monitors[eventType];
            if (callbacks === void 0) {
                throw Error("未声明 " + eventType + "事件");
            }
            callbacks.forEach(cb => cb.apply(null, arge));
        }
    }


    // example
    var observer = new Observer();

    function handleClick(val) {
        console.log(val);
        observer.off("click", handleClick);
    }

    observer.on("click", handleClick);
    observer.emit("click", "触发点击事件");
    observer.emit("click", "再次触发点击事件");

    // --------------------------------------------------------------------------------------------------------------------------
    // 发布订阅模式
    function Publisher() {
        var monitors = {};

        function EventDispatch() {
            this.subs = [];
            this.addSub = function (cb) {
                if (typeof cb !== "function") {
                    throw Error("传入的回调必须是 function 类型");
                }
                this.subs.push(cb);
            }

            this.remove = function (cb) {
                if (typeof cb !== "function") {
                    throw Error("传入的回调必须是 function 类型");
                }
                this.subs = this.subs.filter(callback => callback !== cb);
            }

            this.notify = function (val) {
                this.subs.forEach(cb => cb.apply(null, val));
            }
        }

        this.emit = function (eventType, ...arge) {
            var eventDispatch = monitors[eventType];
            if (eventDispatch === void 0) {
                throw Error("未声明 " + eventType + "事件");
            }

            eventDispatch.notify(arge);
        }

        this.on = function (eventType, cb) {
            var eventDispatch = monitors[eventType];
            if (eventDispatch === void 0) {
                eventDispatch = new EventDispatch();
                eventDispatch.addSub(cb);
            } else {
                eventDispatch.remove(cb);
            }

            monitors[eventType] = eventDispatch;
        }

        this.off = function (eventType, cb) {
            var eventDispatch = monitors[eventType];
            if (eventDispatch === void 0) {
                throw Error("未声明 " + eventType + "事件");
            }

            eventDispatch.remove(cb);
        }

    }


    // example
    var publisher = new Publisher();

    function daily(val) {
        console.log(val);
        publisher.off("daily", daily);
    }
    publisher.on("daily", daily);
    publisher.emit("daily", "日报更新");
    publisher.emit("daily", "再次更新日报");


})();