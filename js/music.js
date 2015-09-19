/**
 * Created by Jihann on 2015/9/19.
 */
;(function($) {
    var MusicPlayer = function() {
        var _this = this;

        this.index = 1;
        this.musicList = musicList;
        this.musicAudio = null;
        this.music = $(".music-wrapper");
        this.starImg = this.music.find("div.star-img img");
        this.starName = this.music.find("div.star-info");
        this.musicName = this.music.find("span.music-name");
        this.audio = this.music.find("audio");
        this.btnPlay = this.music.find("div.btn-play");

        _this.init();
        this.btnPlay.click(function() {
            if (_this.btnPlay.hasClass("play")) {
                _this.play("play");
                _this.btnPlay.removeClass("play").addClass("pause").text("=");
            } else {
                _this.play("pause");
                _this.btnPlay.removeClass("pause").addClass("play").text("+");
            }
        });
    };
    MusicPlayer.prototype = {
        init : function() {
            var _this = this;
            this.musicAudio = this.audio.get(0);
            this.starImg.attr("src", this.musicList[this.index]["img"]);
            this.starName.text(this.musicList[this.index]["star"]);
            this.musicName.text(this.musicList[this.index]["name"]);
            this.audio.attr("src", this.musicList[this.index]["url"]);

        },
        play : function(status) {
            var _this = this;
            if (status === "play") {
                _this.musicAudio.play();
            } else {
                _this.musicAudio.pause();
            }
        }
    };

    window["MusicPlayer"] = MusicPlayer;
})(jQuery);