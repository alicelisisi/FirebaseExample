var dragAndDrop;
(function (dragAndDrop) {
    function addDragListener(touchElementId, handleDragEvent) {
        if (!touchElementId || !handleDragEvent) {
            throw new Error("When calling addDragListener(touchElementId, handleDragEvent), you must pass two parameters");
        }
        let isMouseDown = false;
        function touchHandler(event) {
            let touch = event.changedTouches[0];
            handleEvent(event, event.type, touch.clientX, touch.clientY);
        }
        function mouseDownHandler(event) {
            isMouseDown = true;
            handleEvent(event, "touchstart", event.clientX, event.clientY);
        }
        function mouseMoveHandler(event) {
            if (isMouseDown) {
                handleEvent(event, "touchmove", event.clientX, event.clientY);
            }
        }
        function mouseUpHandler(event) {
            isMouseDown = false;
            handleEvent(event, "touchend", event.clientX, event.clientY);
        }
        function handleEvent(event, type, clientX, clientY) {
            // http://stackoverflow.com/questions/3413683/disabling-the-context-menu-on-long-taps-on-android
            // I also have:  touch-callout:none and user-select:none in main.css
            if (event.preventDefault) {
                event.preventDefault(); // Also prevents generating mouse events for touch.
            }
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            event.cancelBubble = true;
            event.returnValue = false;
            console.log("handleDragEvent:", type, clientX, clientY);
            handleDragEvent(type, clientX, clientY, event);
        }
        let gameArea = document.getElementById(touchElementId);
        if (!gameArea) {
            throw new Error("You must have <div id='" + touchElementId + "'>...</div>");
        }
        gameArea.addEventListener("touchstart", touchHandler, true);
        gameArea.addEventListener("touchmove", touchHandler, true);
        gameArea.addEventListener("touchend", touchHandler, true);
        gameArea.addEventListener("touchcancel", touchHandler, true);
        gameArea.addEventListener("touchleave", touchHandler, true);
        gameArea.addEventListener("mousedown", mouseDownHandler, true);
        gameArea.addEventListener("mousemove", mouseMoveHandler, true);
        gameArea.addEventListener("mouseup", mouseUpHandler, true);
    }
    function init() {
        let currentElement = null;
        let currentZIndex = 100;
        function endDrag() {
            if (currentElement != null) {
                currentElement.classList.remove('currentlyDragged');
                currentElement = null;
            }
        }
        function touchHandler(type, clientX, clientY, event) {
            if (type == "touchstart") {
                endDrag();
                currentElement = document.elementFromPoint(clientX, clientY);
                if (!currentElement.classList.contains('draggable')) {
                    currentElement = null;
                }
                else {
                    currentElement.classList.add('currentlyDragged');
                    currentElement.style.zIndex = '' + (++currentZIndex);
                }
            }
            if (currentElement != null) {
                currentElement.style.left = (clientX - currentElement.offsetWidth / 2) + 'px';
                currentElement.style.top = (clientY - currentElement.offsetHeight / 2) + 'px';
            }
            if (type == "touchend") {
                endDrag();
            }
        }
        addDragListener('draggableArea', touchHandler);
    }
    init();
})(dragAndDrop || (dragAndDrop = {}));
//# sourceMappingURL=dragAndDropHtmlExample.js.map