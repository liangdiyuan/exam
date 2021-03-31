// 1.vue双向绑定原理的简单实现

; (function () {
    function VM(option) {
        var watcher = this.$watch = new Watcher();

        function init() {
            bindBatch(watcher, option.watch || {});
            observer(option.data || {});
        }

        function bindBatch($watch, obj) {
            var keys = Object.keys(obj);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var fn = obj[key];
                $watch.bind("article", fn);
            }
        }

        function observer(data, chainKey) {
            // 只实现对象监听
            if (getDataType(data) !== "object") return;

            const keys = Object.keys(data);
            for (const key of keys) {
                defineReactive(data, key, chainKey);
            }
        }

        function defineReactive(obj, key, chainKey = "") {
            chainKey = chainKey.length > 0 ? (chainKey + "." + key) : key;
            var val = obj[key];
            if (Array.isArray(val)) {
                // 处理数组逻辑
            } else {
                Object.defineProperty(obj, key, {
                    configurable: true,
                    enumerable: true,
                    get() {
                        return val;
                    },
                    set(newVal) {
                        if (val !== newVal) {
                            watcher.taskAlloter(chainKey, newVal, val);
                            if (getDataType(newVal) === "object") observer(newVal, chainKey);
                            val = newVal;
                        }
                    }
                });

                if (getDataType(val) === "object") observer(val, chainKey);
            }
        }

        function getDataType(val) {
            const rex = /(^\[object )(\w+)(\])$/;
            return Object.prototype.toString.call(val).replace(rex, "$2").toLowerCase();
        }

        function Watcher() {
            var subs = {};

            this.bind = function (key, cd) {
                if (typeof cd === "function") {
                    subs[key] = cd;
                } else {
                    console.error("watch对象内的值必须是函数");
                }
            }

            this.unbind = function (key) {
                delete subs[key];
            }

            this.taskAlloter = function (key, newVal, oldVal) {
                typeof subs[key] === "function" && subs[key](newVal, oldVal);
            }
        }

        init();
    }

    window.VM = VM;
})();
