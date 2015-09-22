/**
 * Created by Jihann on 2015/9/22.
 */
(function() {
    var WINDOW_WIDTH = 1024;
    var WINDOW_HEIGHT = 768;
    var RADIUS = 8;
    var MARGIN_TOP = 60;
    var MARGIN_LEFT = 30;

    const endTime = new Date(2015, 8, 25, 18, 47, 52);
    var curShowTimeSeconds = 0;

    window.onload = function() {
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        canvas.width = WINDOW_WIDTH;
        canvas.height = WINDOW_HEIGHT;
        curShowTimeSeconds = getCurShowTimeSeconds();
        setInterval(
            function() {
                render(context);
                update();
            },
            50
        );
    }

    function getCurShowTimeSeconds() {
        var curTime = new Date();
        var ret = endTime.getTime() - curTime.getTime();
        ret = Math.round(ret/1000); //转为秒
        return ret >=0 ? ret : 0;
    }

    function update() {
        var nextSowTimeSeconds = getCurShowTimeSeconds();
        var nextHours = parseInt(nextSowTimeSeconds / 3600);
        var nextMinutes = parseInt((nextSowTimeSeconds - hours * 3600)/60);
        var nextSeconds = nextSowTimeSeconds % 60;

        var curHours = parseInt(curShowTimeSeconds / 3600);
        var curMinutes = parseInt((curShowTimeSeconds - hours * 3600)/60);
        var curSeconds = curShowTimeSeconds % 60;

        if (nextSeconds !== curSeconds) {
            curShowTimeSeconds = nextSowTimeSeconds;
        }
    }

    function render(cxt) {
        var hours = parseInt(curShowTimeSeconds / 3600);
        var minutes = parseInt((curShowTimeSeconds - hours * 3600)/60);
        var seconds = curShowTimeSeconds % 60;

        rederDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), cxt);
        rederDigit(MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP,parseInt(hours%10), cxt);
        rederDigit(MARGIN_LEFT + 30*(RADIUS+1), MARGIN_TOP, 10, cxt);

        rederDigit(MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP,parseInt(minutes/10), cxt);
        rederDigit(MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP,parseInt(minutes%10), cxt);
        rederDigit(MARGIN_LEFT + 69*(RADIUS+1), MARGIN_TOP, 10, cxt);

        rederDigit(MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP,parseInt(seconds/10), cxt);
        rederDigit(MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP,parseInt(seconds%10), cxt);
    }

    function rederDigit(x, y, num, cxt) {
        cxt.fillStyle = "rgb(0,102,153)";
        for (var i = 0; i < digit[num].length; i++) {
            for (var j = 0; j < digit[num][i].length; j++) {
                if (digit[num][i][j] === 1) {
                    cxt.beginPath();
                    cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1), y+i*2*(RADIUS+1)+(RADIUS+1), RADIUS, 0, 2*Math.PI);
                    cxt.closePath();
                    cxt.fill();
                }
            }
        }
    }
})();