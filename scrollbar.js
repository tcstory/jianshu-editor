/**
 * Created by tcstory on 3/27/16.
 */

function createScrollBar(opts) {
    "use strict";

    if (typeof opts.target === 'undefined') {
        throw new Error('缺少必填参数')
    } else if (typeof opts.wrapper === 'undefined') {
        var target = opts.target;
        target.addEventListener('wheel', handleWheel1);
        if (opts.touch) {
            target.addEventListener('touchstart', function (ev) {
                handleTouchMove1.curPos = ev.targetTouches[0].clientY;
            });
            target.addEventListener('touchmove', handleTouchMove1);
        }
    } else {
        var wrapper = opts.wrapper;
        var target = opts.target;
        setDefaultValue(opts);
        var timestamp = Date.now();
        var scrollBar = document.createElement('div');
        scrollBar.className = 'scrollBar__tc' + timestamp;
        wrapper.appendChild(scrollBar);
        var slider = document.createElement('div');
        slider.className = 'slider__tc' + timestamp;
        scrollBar.appendChild(slider);
        target.addEventListener('wheel', handleWheel2);
        if (opts.touch) {
            target.addEventListener('touchstart', function (ev) {
                handleTouchMove2.curPos = ev.targetTouches[0].clientY;
            });
            target.addEventListener('touchmove', handleTouchMove2);
        }
        injectCSS(timestamp, opts);
    }


    function activateScrollBar() {
        clearTimeout(activateScrollBar.timeId);
        scrollBar.classList.add('active');
        activateScrollBar.timeId = setTimeout(function () {
            scrollBar.classList.remove('active');
        }, 50);
    }

    function handleWheel1(ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        target.scrollTop += ev.deltaY;
    }

    function handleWheel2(ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        activateScrollBar();
        var distance = target.scrollHeight - target.clientHeight;
        var scrollTop = target.scrollTop;
        target.scrollTop = scrollTop + ev.deltaY;
        slider.style.height = Math.ceil((scrollTop / distance) * 100) + '%';
    }

    function handleTouchMove1(ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        if((ev.targetTouches[0].clientY - handleTouchMove1.curPos) > 0) {
            var deltaY = 30;
        } else {
            var deltaY = -30;
        }
        handleTouchMove1.curPos = ev.targetTouches[0].clientY;
        target.scrollTop -= deltaY;
    }

    function handleTouchMove2(ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        activateScrollBar();
        if((ev.targetTouches[0].clientY - handleTouchMove2.curPos) > 0) {
            var deltaY = 30;
        } else {
            var deltaY = -30;
        }
        handleTouchMove2.curPos = ev.targetTouches[0].clientY;
        var distance = target.scrollHeight - target.clientHeight;
        var scrollTop = target.scrollTop;
        target.scrollTop = scrollTop - deltaY;
        slider.style.height = Math.ceil((scrollTop / distance) * 100) + '%';
    }

    function setDefaultValue(opts) {
        opts.backgroundColor = opts.backgroundColor || '#E3E3E3';
        opts.opacity = opts.opacity || 0.6;
        opts.color = opts.color || '#EF6851';
        if (opts.showScrollBar !== false) {
            opts.showScrollBar = 'visible';
        } else {
            opts.showScrollBar = 'hidden';
        }
    }

    function injectCSS(timestamp, opts) {
        var sliderStyleText =
            '.scrollBar__tc' + timestamp + ' {' +
            'background-color:' + opts.backgroundColor + ';' +
            'border-radius: .25rem;' +
            'opacity:' + opts.opacity + ';' +
            '-webkit-transition: opacity 300ms;' +
            'transition: opacity 300ms;' +
            'height: -webkit-calc(100% - .5rem);' +
            'height: calc(100% - .5rem);' +
            'width:.5rem;' +
            'position: absolute;' +
            'right: .25rem;' +
            'top: .25rem;' +
            'visibility:' + opts.showScrollBar + ';' +
            '}' +
            '.scrollBar__tc' + timestamp + '.active {' +
            'opacity: 1;' +
            '}' +
            '.scrollBar__tc' + timestamp + ' .slider__tc' + timestamp + ' {' +
            'background-color:' + opts.color + ';' +
            'border-radius: .25rem;' +
            'cursor: pointer;' +
            '}';
        var sliderStyle = document.createElement('style');
        sliderStyle.type = 'text/css';
        sliderStyle.appendChild(document.createTextNode(sliderStyleText));
        document.head.appendChild(sliderStyle);
    }

}

if (typeof module !== 'undefined') {
    module.exports = createScrollBar;
}