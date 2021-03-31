// 3、分别实现节流和防抖的demo
; (function () {

    // 防抖
    window.debounce = function debounce(cb, delay) {
        var timer = null;
        return function () {
            var that = this;
            var arg = arguments;
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                typeof cb === "function" && cb.apply(that, arg);
                timer = null;
            }, delay);
        }
    }

    // 节流
    window.throttle = function throttle(cb, delay) {
        var valid = true;
        return function () {
            if (!valid) return;
            valid = false;
            var that = this;
            var arg = arguments;
            setTimeout(() => {
                typeof cb === "function" && cb.apply(that, arg);
                valid = true;
            }, delay);
        }

    }


})();