let fun_loadCSS = function loadCSS() {
    console.log("webkitAnimationStart");
    let basCSSDiv = document.querySelector(".bas-danmaku-item--css .bas-danmaku-item-inner");
    if (basCSSDiv) {
        document.body.removeEventListener("webkitAnimationStart", fun_loadCSS);
        let cssText = basCSSDiv.innerHTML.replace(/&nbsp;/g, " ");
        console.log(cssText);
        let cssElem = document.createElement("style");
        cssElem.setAttribute("type", "text/css");
        cssElem.innerHTML = cssText;
        document.head.appendChild(cssElem);
    }
};
window.onload = function () {
    document.body.addEventListener("webkitAnimationStart", fun_loadCSS);
};
