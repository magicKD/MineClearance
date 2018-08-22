/**
 * 1.点击开始游戏-->动态生成100个小格-->100div
 * 2.leftClick 没有雷显示数字(代表以当前小格为中心周围8个小格的雷数)
 *   扩散周围8个都没雷-->直到周围有雷，显示数字非0
 *   遇到雷--gameOver
 * 3.rightClick 有标记-->取消标记 没标记->标记
 *   判断标记是否正确--10个都正确-显示成功
 *  
 */

var startBtn = document.getElementById("btn");
var box = document.getElementById("box");
var flagBox = document.getElementById("flagBox");
var mineNum; //雷数
var mineOver; //剩余雷数
var block;//所有小格子
var mineMap = [];//代表小格是都有雷
var alertBox = document.getElementById("alertBox");
var alertImg = document.getElementById("alertImg");
var closeBtn = document.getElementById("close");
var score = document.getElementById("score");
var startGameBool = true;

bindEvent();

function bindEvent() {
    startBtn.onclick = function(){
        box.innerHTML = null;
        if (startGameBool){
            box.style.display = "block";
            flagBox.style.display = "block";
            init();
            //startGameBool = false;
        }
    }
    //取消全局的右键事件
    box.oncontextmenu = function(){
        return false;
    }
    //box绑定事件
    box.onmousedown = function(e){
        var event = e.target;
        if (e.which == 1){ //点击左键
            leftClick(event);
        } else if (e.which == 3){ //右键
            rightClick(event);
        }
    }
    closeBtn.onclick = function(){
        alertBox.style.display = "none";
        flagBox.style.display = "none";
        box.style.display = "none";
        box.innerHTML = null; //清空以便重新加载
    }
}

function init(){
    mineNum = 10;
    mineOver = 10;
    score.innerHTML = mineOver;
    for (var i = 0; i < 10; i++){
        for (var j = 0; j < 10; j++){
            var con = document.createElement("div");
            con.classList.add("block");
            con.setAttribute("id", i + "-" + j);
            box.appendChild(con);
            mineMap.push({mine:0});
        }
    }
    block = document.getElementsByClassName("block");
    while (mineNum){
        var mineIndex = Math.floor(Math.random() * 100);
        if (mineMap[mineIndex].mine === 0){
            mineMap[mineIndex].mine = 1;
            block[mineIndex].classList.add("isLei");
            mineNum--;
        }
    }
}

function leftClick(dom){
    if (dom.classList.contains("flag")) return;
    var isLei = document.getElementsByClassName("isLei");
    if (dom && dom.classList.contains("isLei")){
        console.log("gameOver");
        for (var i = 0; i < isLei.length; i++){
            isLei[i].classList.add("show");
        }
        //延迟一小会在出现
        setTimeout(function(){
            alertBox.style.display = "block";
            //这是什么诡异的bug???
            // alertImg.style.backgroundImage = 'url("../img/over.jpg")';
        }, 800)
    } else {
        var n = 0;//计数雷数
        var posArr = dom && dom.getAttribute("id").split("-");
        var posX = posArr && +posArr[0];
        var posY = posArr && +posArr[1];
        dom && dom.classList.add("num");
        for (var i = posX - 1; i <= posX + 1; i++){
            for (var j = posY - 1; j <= posY+1; j++){
                var aroundBox = document.getElementById(i + "-" + j);
                if (aroundBox && aroundBox.classList.contains("isLei")){
                    n++;
                }
            }
        }
        // var txtNum = document.createElement("div")
        // txtNum.style.width = "49px";
        // txtNum.style.height= "49px";
        // txtNum.style.display = "inline";
        // txtNum.innerHTML = n;
        // dom && dom.appendChild(txtNum);
        dom && (dom.innerText = "" + n);
        // dom.innerHTML = n;
        if (n == 0){
            for (var i = posX - 1; i <= posX + 1; i++){
                for (var j = posY - 1; j <= posY + 1; j++){
                    var nearBox = document.getElementById(i + "-" + j);
                    if (nearBox && nearBox.length != 0){
                        if (!nearBox.classList.contains("check")){
                            nearBox.classList.add("check");
                            leftClick(nearBox);
                        }
                    }
                }
            }
        }
    }
}

function rightClick(dom){
    if (dom.classList.contains("num")){
        return ;
    }
    dom.classList.toggle("flag");
    if (dom.classList.contains("isLei") && dom.classList.contains("flag")){
        mineOver--;
    }
    if (dom.classList.contains("isLei") && !dom.classList.contains("flag")){
        mineOver++;
    }
    score.innerHTML = mineOver;
    if (mineOver == 0){
        alertBox.style.display = "block";
        // alertImg.style.backgroundImage = 'url("../img/success.png")';
    }
}