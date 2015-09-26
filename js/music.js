/**
 * Created by Jihann on 2015/9/19.
 */
;(function($, window, document, undefined) {
    'use strict'
    var MusicPlayer = function() {
        var _this = this;

        this.settings = {
            defaultIndex : 0,  //默认歌曲播放序号
            volume : 0.2 //默认音量
        };
        this.document = document;
        this.currentIndex = 0; //当前音乐播放的序号
        this.musicList = musicList;
        //播放模式【single:单曲 all:全部 random:随机】
        this.playMode = "all";
        this.timer = "";
        this.oloop = 1; //当前头像转动度数

        this.music = $(".music-wrapper");
        this.starImg = this.music.find("div.star-img img");
        this.starName = this.music.find("div.star-info");
        this.musicName = this.music.find("span.music-name");
        this.audio = this.music.find("audio");
        this.btnPlay = this.music.find("div.btn-play");
        this.btnPrev = this.music.find("div.btn-prev");
        this.btnNext = this.music.find("div.btn-next");
        this.btnAma = this.music.find(".icon-ama");
        this.btnRandom = this.music.find(".icon-ran");
        this.btnSin = this.music.find(".icon-sin");
        this.btnList = this.music.find("div.icon-list");
        this.listInfo = $("div.music-list");
        this.progress = this.music.find("div.progress-bar");
        this.musCurTime = this.music.find("span.time-cur");
        this.musSumTime = this.music.find("span.time-sum");
        this.musicVolume = this.music.find("div.music-volume");

        this.musicAudio = this.audio.get(0); // 音频元素

        _this.musicAudio.volume = _this.settings.volume;
        _this.init(_this.settings.defaultIndex);

        this.btnPlay.click(function() {
            if (_this.musicAudio.paused) {
                clearInterval(_this.timer);
                _this.timer = setInterval(function(){//定时器
                    _this.starImg.css({
                        transform : "rotate("+ (_this.oloop===360 ? _this.oloop=1 : _this.oloop+=1) +"deg)"
                    });
                }, 50);
                _this.play("play");
                _this.selectClass("play");
            } else {
                clearInterval(_this.timer);
                _this.play("pause");
                _this.selectClass("pause");
            }
        });

        this.btnPrev.click(function() {
            _this.play("prev");
        });

        this.btnNext.click(function() {
            _this.play("next");
        });

        this.btnAma.click(function() {
            var self = $(this);
            if (self.hasClass("icon-ama-click")) {
                self.removeClass("icon-ama-click");
            } else {
                self.addClass("icon-ama-click");
            }
        });

        this.btnRandom.click(function() {
            _this.playMode = "random";
            _this.changeAction("random");
        });

        this.btnSin.click(function() {
            _this.playMode = "single";
            _this.changeAction("single");
        });

        this.btnList.click(function() {
           _this.listInfo.show().slideUp();
        });

        this.musicAudio.addEventListener("ended", function() {
            if (_this.playMode === "single") {
                _this.changeAction("single");
                _this.init(_this.currentIndex);
            } else if (_this.playMode === "random") {
                var index = parseInt(_this.musicList.length * Math.random(), 10);
                if (index === _this.currentIndex) {
                    index += 1;
                }
                _this.currentIndex = index; //保存当前索引，由下面左右键自行加减
                _this.init(_this.currentIndex);
            } else {
                _this.play("next");
            }
        }, false);

        //显示进度条
        this.musicAudio.addEventListener("timeupdate", function() {
            //获取歌曲播放的时间总长
            var duraTime  = _this.musicAudio.duration;//s
            if (duraTime && typeof duraTime === "number") {
                //获取进度条总宽度
                var progressWidth = _this.progress.width();
                var currTime = _this.musicAudio.currentTime;
                var scale = currTime / duraTime;
                var progressValue = progressWidth * scale;
                //显示进度时长和歌曲总时长
                _this.showTime(currTime, 1);
                _this.showTime(duraTime, 2);
                _this.progress.find("div.progress").width(progressValue + "px");
            }
        }, false);

        this.progress.on('click', function(e) {
            var clientX = e.clientX;
            var progressWidth = _this.progress.width();
            var progressValue = clientX - this.getBoundingClientRect().left;
            progressValue = progressValue && typeof progressValue === "number" && Math.ceil(progressValue);
            var val = progressValue / progressWidth * _this.musicAudio.duration;
            _this.progress.find("div.progress").width(progressValue + "px");
        });

        this.musicVolume.on('click', function(e) {
            var clientX = e.clientX;
            var volumeWidth = _this.musicVolume.width();
            var volumeValue = clientX - this.getBoundingClientRect().left;
            volumeValue = volumeValue && typeof volumeValue === "number" && Math.ceil(volumeValue);
            //默认显示音量宽度为 初始音量0.2 * 总宽度240 = 48px
            //音量进度条占总区域的百分比,音量大小在0.1和1.0之间
            _this.musicAudio.volume = volumeValue / volumeWidth;
            _this.musicVolume.find("div.volume").width(volumeValue + "px");
        });
    };
    MusicPlayer.prototype = {
        init : function(index) {
            var self = this;
            self.repeat.call(self, index);
            self.starName.text(self.musicList[index]["star"]);
            self.musicName.text(self.musicList[index]["name"]);
            self.audio.attr("src", self.musicList[index]["url"]);
            self.musicAudio.play();
            this.selectClass("play");
        },
        play : function(status) {
            var _this = this;
            if (status === "play") {
                _this.musicAudio.play();
            } else if (status === "pause") {
                _this.musicAudio.pause();
            } else if (status === "prev") {
                this.change("prev");
            } else if (status === "next") {
                this.change("next");
            }
        },
        change : function(status) {
            var len = this.musicList.length;
            if (status === "prev") {
                if (this.currentIndex === 0) {
                    this.currentIndex = len - 1;
                } else {
                    this.currentIndex--;
                }
            } else if (status === "next") {
                if (this.currentIndex === (len - 1)) {
                    this.currentIndex = 0;
                } else {
                    this.currentIndex++;
                }
            }
            this.init(this.currentIndex);
        },
        changeAction : function(playMode) {
            if (playMode === "single") {
                if (this.currentIndex === 0) {
                    this.currentIndex = 0;
                }
            } else if (playMode === "random") {
                var index = parseInt(this.musicList.length * Math.random(), 10);
                if (index === this.currentIndex) {
                    index += 1;
                }
                this.currentIndex = index; //保存当前索引，由下面左右键自行加减
            }
        },
        selectClass : function(play) {
            if (play === "play") {
                this.btnPlay.removeClass("play").addClass("pause").text("=");
            } else if (play === "pause") {
                this.btnPlay.removeClass("pause").addClass("play").text("+");
            }
        },
        repeat : function(index) {//让头像实现转动效果
            var self = this;
            clearInterval(self.timer);
            //当前头像慢慢消失，下一张延迟出现
            self.starImg.fadeOut(1000, function() {
                self.starImg.attr("src", self.musicList[index]["img"]);
                self.starImg.css({
                    transform : "rotate(0deg)"
                });
                self.starImg.fadeIn(200, function() {
                    var _this = $(this);
                    var loop = 1;
                    //再次清楚，否则会出现头像不断闪烁的问题
                    clearInterval(self.timer);
                    self.timer = setInterval(function(){//定时器
                        _this.css({
                            transform : "rotate("+ (loop===360 ? loop=1 : loop+=1) +"deg)"
                        });
                        self.oloop = loop; //保存当前头像转动度数
                    }, 50);
                });
            });
        },
        showTime : function(musicSeconds, num) {
            var time = this.getTime(musicSeconds);
            num && num === 1 && this.musCurTime.html(time['minute'] + ":" + time['seconds']);
            num && num === 2 && this.musSumTime.html(time['minute'] + ":" + time['seconds']);
        },
        getTime : function(musicSeconds) {
            var time = [];
            var minute, seconds;
            if (musicSeconds && typeof musicSeconds === "number") {
                minute = Math.floor((musicSeconds / 60) % 60);
                seconds = Math.floor(musicSeconds % 60);
            }
            minute = (minute < 10) ? "0" + minute : minute;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
            time['minute'] = minute;
            time['seconds'] = seconds;
            return time;
        }
    };
    window["MusicPlayer"] = MusicPlayer;
})(jQuery, window, document);