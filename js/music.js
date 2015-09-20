/**
 * Created by Jihann on 2015/9/19.
 */
;(function($, window, document, undefined) {
    var MusicPlayer = function() {
        var _this = this;
        this.document = document;
        this.index = 1;
        this.currentIndex = -1;
        this.musicList = musicList;
        this.musicAudio = null;

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
        this.btnList = this.music.find("div.icon-list");

        _this.init(_this.index);

        this.btnPlay.click(function() {
            if (_this.btnPlay.hasClass("play")) {
                _this.play("play");
                _this.selectClass("play");
            } else {
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
            var index = parseInt(_this.musicList.length * Math.random(), 10);
            if (index === _this.currentIndex) {
                index += 1;
            }
            _this.init(index); //通过随机数获取当前数据中的数据
            _this.currentIndex = index; //保存当前索引，由下面左右键自行加减
        });

        this.btnList.click(function() {
            _this.music.fadeOut();
        });

        this.musicAudio.addEventListener("ended", function() {
           _this.play("next");
        }, false);
    };
    MusicPlayer.prototype = {
        init : function(index) {
            var self = this;
            self.musicAudio = self.audio.get(0);
            self.musicAudio.volume = 0.2;
            self.starImg.attr("src", self.musicList[index]["img"]);
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
                if (this.currentIndex === -1) {
                    this.currentIndex = 0;
                } else if (this.currentIndex === 0) {
                    this.currentIndex = len - 1;
                } else {
                    this.currentIndex--;
                }
            } else if (status === "next") {
                if (this.currentIndex === -1) {
                    this.currentIndex = 0 + 2; //我是默认加载第2条数据
                } else if (this.currentIndex === (len - 1)) {
                    this.currentIndex = 0;
                } else {
                    this.currentIndex++;
                }
            }
            this.init(this.currentIndex);
        },
        selectClass : function(play) {
            if (play === "play") {
                this.btnPlay.removeClass("play").addClass("pause").text("=");
            } else if (play === "pause") {
                this.btnPlay.removeClass("pause").addClass("play").text("+");
            }
        }
    };
    window["MusicPlayer"] = MusicPlayer;
})(jQuery, window, document);