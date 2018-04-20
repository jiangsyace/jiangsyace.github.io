
//loadScript.js
(function (win, doc){
    var defaultSettings = {
        scriptUrl: "",
        callback: function(){}
    };

    var loadScript = function(options){
        if (!options) {
            throw new Error("请传入配置参数");
        }
        defaultSettings = Object.assign(defaultSettings, options);
        var stock_script = document.createElement("script");
        stock_script.src = defaultSettings.scriptUrl;
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(stock_script, s);

        stock_script.onload = function () {
            defaultSettings.callback();
        };
    }
    win.loadScript = loadScript;
})(window, document);