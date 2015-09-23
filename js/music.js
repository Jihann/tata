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
        this.musicAudio = null;
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

        _this.init(_this.settings.defaultIndex);

        this.btnPlay.click(function() {
            if (_this.musicAudio.paused) {
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
    };
    MusicPlayer.prototype = {
        init : function(index) {
            var self = this;
            self.musicAudio = self.audio.get(0);
            self.musicAudio.volume = self.settings.volume;
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
                            transform : "rotate("+ (loop === 360 ? loop=1 : loop+=1) +"deg)"
                        });
                        self.oloop = loop; //保存当前头像转动度数
                    }, 50);
                });
            });
        }
    };
    window["MusicPlayer"] = MusicPlayer;
})(jQuery, window, document);