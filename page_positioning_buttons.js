// ==UserScript==
// @name           Page Positioning Buttons
// @author         Ziyu
// @namespace      http://userscripts.org/users/ziyu
// @description    Add links to go to top, bottom or a user specified position of each page.
// @include        *
// @grant          none
// ==/UserScript==

// "Forked" from http://userscripts.org/scripts/show/105473

(function (document, window) {
  'use strict';

  var numberOfPositions = 3;  // Sets number of positions
  var bottomMargin = '40%';  // Sets bottom margin to percentage of the page height

  var CSS_COMMON = 'cursor:pointer;width:36px;z-index:1000;';
  var CSS = {
    CONTAINER : CSS_COMMON + 'position:fixed;right:0px;',
    TOP_BUTTON : CSS_COMMON + 'height:36px;border-radius:5px 0 0 0;background:url(data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB+SURBVDhPY1i1atV/amAGahgCMoNhaIGlS5cKAp19BoRBbLJcj2QILDJINwzoAmMgfoclIkBixkS5DI8hMJcRNgxoSBoOl6CnNZBhaVhdBjWE1MSJahjQkA4KEmYH2GUrV66cSYEhYB+AzKBtFiHkQqKiH6Ro1CDCQTWgYQQAs81DU0G/83sAAAAASUVORK5CYII=) no-repeat scroll 50% 50% rgba(0, 0, 0, 0);',
    BTM_BUTTON : CSS_COMMON + 'height:36px;border-radius:0 0 0 5px;background:url(data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACPSURBVDhPY2DAAlatWvUfH8amB6vYqEGEg2pgw4iQ7cTKM6xcuXImsYpxqQOZAQ4woIIOCgzrQAl1oEFpZBiWhitFgwx7R4SBIDXYDYGZDFRgTMAwkCHGhBMRJMxwGUa8ITCbli5dKgg08AySN8+AxIhyCboiJMPIN4Qsm6miiYioxltawvSDYogohYTUAQC80UNTOht/YwAAAABJRU5ErkJggg==) no-repeat scroll 50% 50% rgba(0, 0, 0, 0);',
    POS_BUTTON_REC : CSS_COMMON + 'height:16px;background:url(data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuODc7gF0AAAB7SURBVChTY2CAglWrVokAcRUQb4LiaiAtBpMH00ABayB+DcT/0fBbIN8OpkgUhyKYpndAeXGQaSAr0E1C59eDFG4mQuF2kMItxCqsJUJhI8hEcSAGORiXOz8A5aRgPncAct5jUQxS5IwelhJAwUYg3gHEO4G4CW4SUCUAr5P12vViZpQAAAAASUVORK5CYII=) no-repeat scroll 50% 50% rgba(0, 0, 0, 0);',
    POS_BUTTON_RWD : CSS_COMMON + 'height:16px;background:url(data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuODc7gF0AAAB9SURBVChThc4xDkAwAEbhHsQgsRjsFgaDCziH+1hMJukBiMVgcCYhwmuiNCiSb1DvTwnx80gpHWTWjI8uCkxoHiGHHkrM2A5XyIGPCosR6LAVHAaosb4EOuxUGGP8iFTcnf/IS4rBMrhCvSBM0N8Gz9AYROrKY2APjUFInO9AjKU6HWDivAAAAABJRU5ErkJggg==) no-repeat scroll 50% 50% rgba(0, 0, 0, 0);'
  };

  var createPositionButton = function () {
    var position = 0,
        isset = 0,
        button = document.createElement('div');

    var setPosition = function (yOffset) {
      position = yOffset;
      isset = 1;

      return position;
    };

    var getPosition = function () {
      return position;
    };

    var rewind = function () {
      if(isset) {
        window.scrollTo(0, position);
      }
    };

    var record = function () {
      setPosition(window.pageYOffset);

      button.style.cssText = CSS.POS_BUTTON_RWD;
      button.removeEventListener('click', record, false);
      button.addEventListener('click', rewind, false);
    };

    button.style.cssText = CSS.POS_BUTTON_REC;
    button.addEventListener('click', record, false);

    return {
      button      : button,
      isset       : isset,
      getPosition : getPosition
    };
  };

  var buttons = function () {

    var intervalHandle = null,
        container = document.createElement('div'),
        positionButtonContainer = document.createElement('div');

    var pageGoToTop = function () {
      window.scrollTo(0, 0);
    };

    var pageGoToBottom = function () {
      window.scrollTo(0, 999999);
    };

    var pageScrollUp = function () {
      if (intervalHandle === null) {
        intervalHandle = setInterval(function(){window.scrollBy(0,-3);}, 60);
      }
    };

    var pageScrollDown = function () {
      if (intervalHandle === null) {
        intervalHandle = setInterval(function(){window.scrollBy(0,3);}, 60);
      }
    };

    var stopScroll = function () {
      clearInterval(intervalHandle);
      intervalHandle = null;
    };

    var addPos = function () {

      while (numberOfPositions--) {
        positionButtonContainer.appendChild(createPositionButton().button);
      }
    };

    var init = function () {

      var topButton = document.createElement('div'),
      btmButton = document.createElement('div');

      container.style.cssText = CSS.CONTAINER + 'bottom:' + bottomMargin;
      topButton.style.cssText = CSS.TOP_BUTTON;
      btmButton.style.cssText = CSS.BTM_BUTTON;

      topButton.addEventListener('click', pageGoToTop, false);
      topButton.addEventListener('mouseover', pageScrollUp, false);
      topButton.addEventListener('mouseout', stopScroll, false);

      btmButton.addEventListener('click', pageGoToBottom, false);
      btmButton.addEventListener('mouseover', pageScrollDown, false);
      btmButton.addEventListener('mouseout', stopScroll, false);

      container.appendChild(topButton);
      container.appendChild(positionButtonContainer);
      container.appendChild(btmButton);
      document.body.appendChild(container);

      addPos();
    };

    return {
      container : container,
      init      : init
    };
  };

  if (window.top == window.self) { // if not iframe

    var de = document.documentElement;
    if(de.scrollHeight > de.clientHeight && document.body) {
      buttons().init();
    }
  }

})(document, window);
