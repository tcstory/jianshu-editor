/**
 * Created by tcstory on 4/9/16.
 */

// ;(function () {
"use strict";

var Data = {
    getNotes: function (cb) {
        setTimeout(function () {
            cb([
                {
                    title: '无标题文章1'
                },
                {
                    title: '无标题文章2'
                },
                {
                    title: '无标题文章3'
                },
                {
                    title: '无标题文章4'
                },
                {
                    title: '无标题文章5'
                },
                {
                    title: '无标题文章6'
                },
                {
                    title: '无标题文章7'
                },
                {
                    title: '无标题文章8'
                },
                {
                    title: '无标题文章9'
                }
            ])
        }, 1000)
    }
};


var vm = new Vue({
    el: '#tc-writer',
    data: {
        isDrag: false,
        isMousedown: false,
        notes: [],
        curNote: {},
        curSelectedNote: {},
        curDraggedNote: {},
        deltaY: -1,
        tcWriter: {
            top: -1,
            bottom: -1,
            scrollHeight: -1,
            heightOfWriteNoteBtn: -1,
            midOfNote: -1
        }

    },
    methods: {
        handleNoteMousedown: function (note, ev) {
            this.isMousedown = true;
            this.curNote = note;
            this.deltaY = ev.clientY - note.dom.getBoundingClientRect().top;
        },
        _clearDragInfo: function () {
            this.isDrag = false;
            this.curDraggedNote.dom.style.top = '';
            this.curDraggedNote = {};
        },
        _autoScroll: function (clientY) {
            if (clientY < (this.tcWriter.top + this.tcWriter.midOfNote)) {
                this.$els.notesWrapper.scrollTop -=20;
            } else if (clientY > (this.tcWriter.bottom-this.tcWriter.midOfNote)) {
                this.$els.notesWrapper.scrollTop = this.$els.notesWrapper.scrollTop + 20;
            }
        },
        _calcNotePos: function () {
            var _myself = this;
            var notes = _myself.notes;
            setTimeout(function () {
                var noteDOMs = _myself.$els.writer.querySelectorAll('.note');
                var mid = parseFloat(getComputedStyle(noteDOMs[0], null).height);
                _myself.tcWriter.midOfNote = mid;
                if (Array.isArray(notes)) {
                    for (var i = 0; i < noteDOMs.length; i++) {
                        notes[i].delimiter = noteDOMs[i].offsetTop + mid / 2;
                        notes[i].dom = noteDOMs[i];
                    }
                }
            }, 0)
        }
    },
    ready: function () {
        var _myself = this;
        createScrollBar({
            target: document.querySelector('#tc-writer .directory')
        });
        _myself.tcWriter.top = _myself.$els.writer.getBoundingClientRect().top;
        _myself.tcWriter.bottom = _myself.$els.writer.getBoundingClientRect().bottom;
        _myself.tcWriter.heightOfWriteNoteBtn = parseFloat(getComputedStyle(_myself.$els.writeNoteBtn,null).height);
        window.addEventListener('mousemove', function (ev) {
            if (_myself.isMousedown) {
                _myself.isDrag = true;
                _myself.curDraggedNote = _myself.curNote;
                noteHolder.insert(_myself.curDraggedNote, _myself.notes, _myself.$els.notesWrapper);
                _myself._autoScroll(ev.clientY);
                var top = ev.clientY - _myself.tcWriter.top  - _myself.deltaY + _myself.$els.notesWrapper.scrollTop;
                if (top < _myself.tcWriter.scrollHeight && top >= 0) {
                    _myself.curDraggedNote.dom.style.top = top + 'px';
                }
            }
        });
        window.addEventListener('mouseup', function (ev) {
            if (_myself.isDrag) {
                _myself.isDrag = false;
                _myself._clearDragInfo();
                _myself.$els.notesWrapper.removeChild(noteHolderDIV);
            } else {
                _myself.curSelectedNote = _myself.curNote;
            }
            _myself.isMousedown = false;
        });
        Data.getNotes(function (notes) {
            _myself.notes = notes;
            _myself._calcNotePos();
            setTimeout(function () {
                _myself.tcWriter.scrollHeight = _myself.$els.notesWrapper.scrollHeight;
            },0)
        })
    }
});


var noteHolderDIV = document.createElement('div');
noteHolderDIV.classList.add('note-holder');
var noteHolder = {
    timeId: -1,
    interval: 150,
    insert: function (draggedNote, notes, notesWrapper) {
        var _myself = this;
        if (_myself.timeId === -1) {
            _myself._addHolder(draggedNote, notes, notesWrapper);
            _myself.timeId = setTimeout(function () {
                _myself.timeId = -1;
                _myself._addHolder(draggedNote, notes, notesWrapper);
            }, _myself.interval);
        }
    },
    _addHolder: function (draggedNote, notes, notesWrapper) {
        var len = notes.length;
        for (var i = 0; i < len; i++) {
            if (draggedNote.dom.offsetTop < notes[i].delimiter) {
                notesWrapper.insertBefore(noteHolderDIV, notes[i].dom);
                break;
            }
        }
        if (i === len) {
            notesWrapper.appendChild(noteHolderDIV);
        }
    }
};

// })();