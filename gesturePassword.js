var stop = Math.PI * 2;
var array = [];
var haveTouched = [];
var width = window.innerWidth;
var height = window.innerHeight;
var touches = [];
var inputCount = 0;
var firstHaveTouched = [];
var flag = false;

function initCanvas() {
    this.canvas = document.getElementById('myCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = width;
    this.canvas.height = height/2;
}

function drawCircle(x, y) {
    this.ctx.strokeStyle = "red";
    this.ctx.beginPath();
    this.ctx.arc(x, y, 10, 0, stop, true);
    this.ctx.stroke();
    this.ctx.closePath();
}

function drawBigCircle(x, y) {
    this.ctx.fillStyle = "orange";
    this.ctx.beginPath();
    this.ctx.arc(x, y, 20, 0, stop, true);
    this.ctx.fill();
    this.ctx.closePath();
}

function drawLine(startX, startY, toX, toY) {
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);


    this.ctx.lineTo(toX, toY - 61);
    this.ctx.closePath();
    this.ctx.stroke();
}

function initCircle() {
    var x = width;
    var y = height;
    for (var i = 1; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            array.push({x: x * i / 4, y: y * j / 8, isTouched: false});
        }
    }
    for (var i = 0; i < array.length; i++) {
        drawCircle(array[i].x, array[i].y);
    }
}

function startup() {
    var canvas = document.getElementById("myCanvas");
    canvas.addEventListener("touchstart", handleStart, false);
    canvas.addEventListener("touchmove", handleMove, false);
    canvas.addEventListener("touchend", handleEnd, false);
}

function clearLine() {
    if (touches.length > 0) {
        var touchesLength = touches.length - 1;
        var xyLength, xLength, yLength;
        var touchesX = touches[touchesLength].pageX;
        var touchesY = touches[touchesLength].pageY - 61;

        for (var i = 0; i < array.length; i++) {
            xLength = Math.abs(touchesX - array[i].x);
            yLength = Math.abs(touchesY - array[i].y);
            xyLength = Math.sqrt(xLength * xLength + yLength * yLength);
            if (xyLength > 10 || isExitHaveTouched(i)) {
                var ctx = canvas.getContext("2d");
                var haveTouchedLength = haveTouched.length - 1;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                judgeLineInCircle(touchesLength);
                if (haveTouchedLength >= 1) {
                    drawAllLines();
                }
                drawAllCircles();
            }
        }
    }
}

function handleEnd(e) {
    e.preventDefault();
    clearLine();
    if(inputCount >= 1 && !flag){
        document.getElementById('information').innerHTML = "<h4>请再次输入手势密码</h4>"
    }
    if (!flag) {
        if (haveTouched.length < 5 || haveTouched.length === 0) {
            document.getElementById("information").innerHTML = "<h4>密码太短至少需要5个点</h4>";
            inputCount --;
        }
        if (inputCount === 1) {
            firstHaveTouched = haveTouched;
            return;
        }

        if(firstHaveTouched.length > 0){
            if (firstHaveTouched.toString() === haveTouched.toString()) {
                document.getElementById('information').innerHTML = "<h4>密码设置成功</h4>";
                localStorage.setItem("password", JSON.stringify(firstHaveTouched));
            } else {
                document.getElementById('information').innerHTML = "<h4>两次输入不一致</h4>"
            }
        }
    }
    else {
        var password = JSON.parse(localStorage.getItem("password"));
        if (password.toString() === haveTouched.toString()) {
            document.getElementById('information').innerHTML = "<h4>密码正确！</h4>"
        } else {
            document.getElementById('information').innerHTML = "<h4>输入密码不正确！</h4>"
        }
    }
}

function handleStart(e) {
    inputCount++;
    document.getElementById("information").innerHTML = "<h4>请输入手势密码</h4>";
    if (inputCount > 1 && !flag) {
        document.getElementById('information').innerHTML = "<h4>请再次输入手势密码</h4>"
    }
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    array = [];
    initCircle();
    haveTouched = [];
    touches = [];
    e.preventDefault();
    var xyLength, xLength, yLength;
    var touchesX = e.touches[0].pageX;
    var touchesY = e.touches[0].pageY - 61;

    for (var i = 0; i < array.length; i++) {
        xLength = Math.abs(touchesX - array[i].x);
        yLength = Math.abs(touchesY - array[i].y);
        xyLength = Math.sqrt(xLength * xLength + yLength * yLength);
        if (xyLength < 10) {
            array[i].isTouched = true;
            drawBigCircle(array[i].x, array[i].y);
            haveTouched.push({x: array[i].x, y: array[i].y});
        }
    }
}

function isExitHaveTouched(j) {
    for (var i = 0; i < haveTouched.length; i++) {
        if (haveTouched[i].x === array[j].x && haveTouched[i].y === array[j].y) {
            return true;
        }
    }
    return false;
}

function drawAllLines() {
    for (var i = 0; i < haveTouched.length - 1; i++) {
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(haveTouched[i].x, haveTouched[i].y);
        this.ctx.lineTo(haveTouched[i + 1].x, haveTouched[i + 1].y);
        this.ctx.closePath();
        this.ctx.stroke();
    }
}

function judgeLineInCircle(length) {
    var xyLength, xLength, yLength;
    var touchesX = touches[length].pageX;
    var touchesY = touches[length].pageY - 61;

    for (var i = 0; i < array.length; i++) {
        xLength = Math.abs(touchesX - array[i].x);
        yLength = Math.abs(touchesY - array[i].y);
        xyLength = Math.sqrt(xLength * xLength + yLength * yLength);
        if (xyLength < 10 && !isExitHaveTouched(i)) {
            array[i].isTouched = true;
            drawBigCircle(array[i].x, array[i].y);
            haveTouched.push({x: array[i].x, y: array[i].y});
        }
    }
}

function drawAllCircles() {
    for (var i = 0; i < array.length; i++) {
        if (array[i].isTouched) {
            drawBigCircle(array[i].x, array[i].y);
        } else {

            drawCircle(array[i].x, array[i].y);
        }
    }

}

function handleMove(e) {
    e.preventDefault();
    touches = e.touches;
    if (haveTouched.length > 0) {
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        var touchesLength = e.touches.length - 1;
        var haveTouchedLength = haveTouched.length - 1;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        drawLine(haveTouched[haveTouchedLength].x, haveTouched[haveTouchedLength].y, e.touches[touchesLength].pageX, e.touches[touchesLength].pageY);
        judgeLineInCircle(touchesLength);
        if (haveTouchedLength >= 1) {
            drawAllLines();
        }
        drawAllCircles();
    }
}

initCanvas();
initCircle();
startup();

function verifyPassword() {
    flag = true;
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    array = [];
    initCircle();
    haveTouched = [];
    touches = [];
    inputCount--;
}
