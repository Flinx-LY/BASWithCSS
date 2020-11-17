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
    let basDelayMarkDiv_delay = document.querySelector(".bas-danmaku-item--delayMark").style.animationDelay;
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
};
