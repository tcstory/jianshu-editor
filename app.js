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
                    title: '无标题文章1',
                    content: '我是文章1'
                },
                {
                    title: '无标题文章2',
                    content: '我是文章<span style="red">2</span>'
                },
                {
                    title: '无标题文章3',
                    content: '我是文章3'
                },
                {
                    title: '无标题文章4',
                    content: '我是文章4'
                },
                {
                    title: '无标题文章5',
                    content: '我是文章5'
                },
                {
                    title: '无标题文章6',
                    content: '我是文章6'
                },
                {
                    title: '无标题文章7',
                    content: '我是文章7'
                },
                {
                    title: '无标题文章8',
                    content: '我是文章8'
                },
                {
                    title: '无标题文章9',
                    content: '我是文章9'
                }
            ])
        }, 1000)
    }
};

var noteDOMs = [];
var editor;
var vm = new Vue({
    el: '#tc-writer',
    data: {
        isDrag: false,
        isMousedown: false,
        notes: [],
        curNote: {},
        curSelectedNote: {},
        curDraggedNote: {},
        openDropdownMenu: false,
        deltaY: -1,
        tcWriter: {
            top: -1,
            bottom: -1,
            scrollHeight: -1,
            heightOfWriteNoteBtn: -1,
            midOfNote: -1
        }

    },
    watch: {
        'curSelectedNote.content': function (newVal, oldVal) {
            editor.$txt.html(newVal);
        }
    },
    methods: {
        handleNoteMousedown: function (note, ev) {
            this.isMousedown = true;
            this.curNote = note;
            this.deltaY = ev.clientY - noteDOMs[note.pos].dom.getBoundingClientRect().top;
            this.openDropdownMenu = false;
        },
        handleWriteNewNote: function () {
            var note = {
                title: '',
                content: ''
            };
            this.notes.unshift(note);
            this._calcNotePos();
            this.curNote = note;
            this.curSelectedNote = note;
        },
        handleSettingIconClick: function () {
            this.openDropdownMenu = !this.openDropdownMenu;
        },
        handleSaveNote: function () {

        },
        handleDeleteNote: function (note) {
            this.notes.$remove(note);
            this._calcNotePos();
        },
        _clearDragInfo: function () {
            this.isDrag = false;
            noteDOMs[this.curDraggedNote.pos].dom.style.top = '';
            this.curDraggedNote = {};
        },
        _autoScroll: function (clientY) {
            if (clientY < (this.tcWriter.top + this.tcWriter.midOfNote)) {
                this.$els.notesWrapper.scrollTop -= 20;
            } else if (clientY > (this.tcWriter.bottom - this.tcWriter.midOfNote)) {
                this.$els.notesWrapper.scrollTop = this.$els.notesWrapper.scrollTop + 20;
            }
        },
        _calcNotePos: function () {
            var _myself = this;
            setTimeout(function () {
                var doms = _myself.$els.writer.querySelectorAll('.note');
                var mid = parseFloat(getComputedStyle(doms[0], null).height);
                _myself.tcWriter.midOfNote = mid;
                noteDOMs = [];
                for (var i = 0; i < doms.length; i++) {
                    noteDOMs.push({
                        delimiter: doms[i].offsetTop + mid / 2,
                        dom: doms[i]
                    });
                    _myself.notes[i].pos = i;
                }
                _myself.tcWriter.scrollHeight = _myself.$els.notesWrapper.scrollHeight;
            }, 0)
        },
        _handleMouseup: function () {
            var _myself = this;
            _myself.isMousedown = false;
            if (_myself.isDrag) {
                _myself.notes.$remove(_myself.curDraggedNote);
                var elems = _myself.$els.notesWrapper.children;
                var len = elems.length;
                var pos = -1;
                var d = 0;
                for (var i = 1; i < len; i++) {
                    if (elems[i].classList.contains('note-holder')) {
                        pos = i - 1;
                        break;
                    } else if (elems[i].classList.contains('drag')) {
                        d++;
                    }
                }
                _myself.notes.splice(pos - d, 0, _myself.curDraggedNote);
                _myself._calcNotePos();
                _myself._clearDragInfo();
                _myself.$els.notesWrapper.removeChild(noteHolderDIV);
            } else {
                _myself.curSelectedNote = _myself.curNote;
            }
        },
        _handleMousemove: function (ev) {
            var _myself = this;
            if (_myself.isMousedown) {
                _myself.isDrag = true;
                _myself.curDraggedNote = _myself.curNote;
                noteHolder.insert(noteDOMs[_myself.curDraggedNote.pos], noteDOMs);
                _myself._autoScroll(ev.clientY);
                var top = ev.clientY - _myself.tcWriter.top - _myself.deltaY + _myself.$els.notesWrapper.scrollTop;
                if (top < _myself.tcWriter.scrollHeight && top >= 0) {
                    noteDOMs[_myself.curDraggedNote.pos].dom.style.top = top + 'px';
                }
            }
        }
    },
    ready: function () {
        var _myself = this;

        editor = new wangEditor('editor');
        editor.config.menus = [
            'bold',
            'underline',
            'italic',
            'strikethrough',
            'forecolor',
            'bgcolor',
            'quote',
            'fontsize',
            'img'

        ];
        editor.onchange = function () {
            _myself.curSelectedNote.content = editor.$txt.html();
        };
        editor.create();
        createScrollBar({
            target: document.querySelector('#tc-writer .directory')
        });
        window.addEventListener('mousemove', function (ev) {
            _myself._handleMousemove(ev);
        });
        window.addEventListener('mouseup', function () {
            _myself._handleMouseup();
        });
        Data.getNotes(function (notes) {
            _myself.notes = notes;
            _myself.curNote = notes[0];
            _myself.curSelectedNote = notes[0];
            _myself._calcNotePos();
            setTimeout(function () {
                _myself.tcWriter.scrollHeight = _myself.$els.notesWrapper.scrollHeight;
                _myself.tcWriter.top = _myself.$els.writer.getBoundingClientRect().top;
                _myself.tcWriter.bottom = _myself.$els.writer.getBoundingClientRect().bottom;
                _myself.tcWriter.heightOfWriteNoteBtn = parseFloat(getComputedStyle(_myself.$els.writeNoteBtn, null).height);
            }, 0)
        })
    }
});


var noteHolderDIV = document.createElement('div');
noteHolderDIV.classList.add('note-holder');
var noteHolder = {
    timeId: -1,
    interval: 150,
    pos: -1,
    notesWrapper: document.querySelector('#tc-writer .directory'),
    insert: function (draggedNote, notes) {
        var _myself = this;
        if (_myself.timeId === -1) {
            _myself._addHolder(draggedNote, notes);
            _myself.timeId = setTimeout(function () {
                _myself.timeId = -1;
                _myself._addHolder(draggedNote, notes);
            }, _myself.interval);
        }
    },
    _addHolder: function (draggedNote, notes) {
        var len = notes.length;
        for (var i = 0; i < len; i++) {
            if (draggedNote.dom.offsetTop < notes[i].delimiter) {
                this.notesWrapper.insertBefore(noteHolderDIV, notes[i].dom);
                break;
            }
        }
        if (i === len) {
            this.notesWrapper.appendChild(noteHolderDIV);
        }
    }
};

// })();