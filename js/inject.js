let cssElem = null;
let animationDelayMap = {};
let fun_loadCSS = function loadCSS() {
    console.log("webkitAnimationStart");
    let basCSSDiv = document.querySelector(".bas-danmaku-item--css .bas-danmaku-item-inner");
    if (basCSSDiv) {
        document.body.removeEventListener("webkitAnimationStart", fun_loadCSS);
        let cssText = basCSSDiv.innerHTML.replace(/&nbsp;/g, " ");
        console.log(cssText);
        cssElem = document.createElement("style");
        cssElem.setAttribute("type", "text/css");
        cssElem.innerHTML = cssText;
        document.head.appendChild(cssElem);

        let cssRules = cssElem.sheet.cssRules;
        for (let index = 0; index < cssRules.length; index++) {
            const cssRule = cssRules[index];
            if (cssRule.selectorText && cssRule.selectorText.indexOf("_css") != -1) {
                animationDelayMap[cssRule.selectorText] = cssRule.style.animationDelay;
            }
        }
    }
};
let fun_basRedelay = function basRedelay() {
    console.log("basRedelay");
    let basDelayMarkDiv = document.querySelector(".bas-danmaku-item--delayMark");
    if (!basDelayMarkDiv) {
        return;
    }
    let basDelayMarkDiv_delay = basDelayMarkDiv.style.animationDelay;
    if (basDelayMarkDiv_delay) {
        console.log("basDelayMarkDiv_delay:" + basDelayMarkDiv_delay);
        let cssRules = cssElem.sheet.cssRules;
        for (let index = 0; index < cssRules.length; index++) {
            const cssRule = cssRules[index];
            if (cssRule.selectorText && cssRule.selectorText.indexOf("_css") != -1) {
                if (cssRule.style.animationDelay) {
                    cssRule.style.animationDelay =
                        parseFloat(
                            animationDelayMap[cssRule.selectorText].substring(
                                0,
                                animationDelayMap[cssRule.selectorText].length - 1
                            )
                        ) +
                        parseFloat(basDelayMarkDiv_delay.substring(0, basDelayMarkDiv_delay.length - 1)) +
                        "s";
                }
            }
        }
    }
};
window.onload = function () {
    document.body.addEventListener("webkitAnimationStart", fun_loadCSS);
    document.body.addEventListener("keydown", fun_basRedelay);
    document.getElementById("bilibiliPlayer").addEventListener("click", fun_basRedelay);
    document.addEventListener("keydown", keydown);

    var main_canvas = document.querySelector(".bilibili-player-video-bas-danmaku");
    // var left = main_canvas.getBoundingClientRect().left;
    // var top = main_canvas.getBoundingClientRect().top;
    var mydiv = document.getElementById("box");
    mydiv = document.createElement("div");
    mydiv.setAttribute("id", "pos-info");
    main_canvas.appendChild(mydiv);
    mydiv.style.position = "absolute";
    mydiv.style.lineHeight = "25px";
    mydiv.style.fontSize = "22px";
    mydiv.style.fontFamily = '"Microsoft YaHei"';
    mydiv.style.color = "#fff";
    mydiv.style.display = "block";
    mydiv.style.width = "400px";
    mydiv.style.height = "200px";
    mydiv.style.left = "10px";
    mydiv.style.top = "50px";
};
var int = self.setInterval("get_pos()", 20);
var num_perfect = 0;
var num_great = 0;
var num_bad = 0;
var num_miss = 0;
var keydown_str = "";
var line_top = 0;
var track_top = [];
function get_pos() {
    var info_str = "";
    const track_path = document.querySelector('div[class*="Line_path"]');
    if (track_path) {
        line_top = parseInt(track_path.getBoundingClientRect().top);
        info_str = info_str + "Line_top:    " + line_top + "<br>";
    } else {
        line_top = 0;
        info_str = info_str + "Line_top:    none<br>";
    }
    for (let i = 1; i <= 4; i++) {
        const track_path = document.querySelector('div[class*="Track' + i + '_path"]');
        if (track_path) {
            track_top[i] = parseInt(track_path.getBoundingClientRect().top);
            if (track_top[i] - line_top > 70) {
                note_del(track_path, 3);
                num_miss++;
            }
            info_str = info_str + "Track" + i + "_top:  " + track_top[i] + "<br>";
        } else {
            track_top[i] = 0;
            info_str = info_str + "Track" + i + "_top:  none<br>";
        }
    }
    var myhint = document.getElementById("pos-info");
    if (myhint) {
        myhint.innerHTML =
            info_str +
            "Perfect:" +
            num_perfect +
            "<br>Great:  " +
            num_great +
            "<br>Bad:    " +
            num_bad +
            "<br>Miss:   " +
            num_miss +
            "<br><br>" +
            keydown_str;
    }
}
function keydown(event) {
    switch (event.keyCode) {
        case 72: //h
            keydown_str = "按下H，Track1点击<br>";
            key_judge(1);
            break;
        case 74: //j
            keydown_str = "按下J，Track2点击<br>";
            key_judge(2);
            break;
        case 75: //k
            keydown_str = "按下K，Track3点击<br>";
            key_judge(3);
            break;
        case 76: //l
            keydown_str = "按下L，Track4点击<br>";
            key_judge(4);
            break;
    }
}
function key_judge(i) {
    console.log(track_top[i], line_top);
    const distance = Math.abs(track_top[i] - line_top);
    const track_path = document.querySelector('div[class*="Track' + i + '_path"]');
    if (distance < 30) {
        note_del(track_path, 0);
        num_perfect++;
    } else if (distance < 60) {
        note_del(track_path, 1);
        num_great++;
    } else if (distance < 90) {
        note_del(track_path, 2);
        num_bad++;
    } else {
        num_bad++;
    }
}
function note_del(noteNode, level) {
    var main_canvas = document.querySelector(".bilibili-player-video-bas-danmaku");
    const noteNode_bound = noteNode.getBoundingClientRect();
    const top = parseInt((noteNode_bound.bottom + noteNode_bound.top) / 2 - main_canvas.getBoundingClientRect().top);
    const left = parseInt((noteNode_bound.right + noteNode_bound.left) / 2 - main_canvas.getBoundingClientRect().left);
    var elem = document.createElement("b");
    switch (level) {
        case 0:
            elem.style.color = "#FF4900";
            break;
        case 1:
            elem.style.color = "#C800FF";
            break;
        case 2:
            elem.style.color = "#00FF82";
            break;
        default:
            elem.style.color = "#fff";
            break;
    }
    elem.style.zIndex = 10;
    elem.style.position = "absolute";
    elem.style.select = "none";
    elem.style.left = left + "px";
    elem.style.top = top + "px";
    elem.innerText = "□";
    elem.style.fontSize = "150px";
    elem.className = "note-hide";
    main_canvas.appendChild(elem);
    setTimeout(function () {
        elem.parentNode.removeChild(elem);
    }, 7000);

    noteNode.parentNode.removeChild(noteNode);
}
