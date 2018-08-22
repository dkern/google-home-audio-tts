let Client = require('castv2-client').Client;
let DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
let googletts = require('google-tts-api');

/**
 * initialize device
 * @param {string} ip
 * @param {string} lang
 * @return {GoogleHomeAVT}
 */
function GoogleHomeAVT(ip, lang = 'en') {
    this.setIp(ip);
    this.setLanguage(lang);
    this.setRestoreVolume(true);
    this.setStreamType("BUFFERED");
    this.setTtsTimeout(1000);
    this.setTtsSpeed(1);
}

/**
 * set device ip
 * @type {string}
 * @return {GoogleHomeAVT}
 */
GoogleHomeAVT.prototype.setIp = function(ip) {
    this.ip = ip;
    return this;
};

/**
 * device device language
 * @type {string}
 * @return {GoogleHomeAVT}
 */
GoogleHomeAVT.prototype.setLanguage = function(language) {
    this.language = language;
    return this;
};

/**
 * set device volume
 * @param {number} volume
 * @return {GoogleHomeAVT}
 */
GoogleHomeAVT.prototype.setVolume = function(volume) {
    if (volume >= 0.0 && volume <= 1.0) {
        this.volume = volume;
    }

    return this;
};

/**
 * set device volume
 * @param {boolean} restore
 * @return {GoogleHomeAVT}
 */
GoogleHomeAVT.prototype.setRestoreVolume = function(restore) {
    this.restoreVolume = restore;
    return this;
};

/**
 * set stream type
 * @param {string} streamType
 * @return {GoogleHomeAVT}
 */
GoogleHomeAVT.prototype.setStreamType = function(streamType) {
    if (streamType === "BUFFERED" || streamType === "LIVE") {
        this.streamType = streamType;
    }

    return this;
};

/**
 * set tts timeout
 * @param {number} ttsTimeout
 * @return {GoogleHomeAVT}
 */
GoogleHomeAVT.prototype.setTtsTimeout = function(ttsTimeout) {
    this.ttsTimeout = ttsTimeout;
    return this;
};

/**
 * set tts voice speed
 * @param {number} ttsSpeed
 * @return {GoogleHomeAVT}
 */
GoogleHomeAVT.prototype.setTtsSpeed = function(ttsSpeed) {
    this.ttsSpeed = ttsSpeed;
    return this;
};

/**
 * let device play text to speech
 * @param {string} message
 * @param {function} [callback]
 * @return {GoogleHomeAVT}
 */
GoogleHomeAVT.prototype.tts = function(message, callback) {
    googletts(text, this.language, this.ttsSpeed, this.ttsTimeout).then(function(url) {
        this.audio(url, callback);
    }).catch(err => {
        console.error(err.stack);
    });

    return this;
};

/**
 * play audio file on device
 * @param {string} url
 * @param {function} [callback]
 * @return {GoogleHomeAVT}
 */
GoogleHomeAVT.prototype.audio = function(url, callback) {
    this.playOnDevice(url, callback);
    return this;
};

/**
 * play url on device
 * @access private
 * @param {string} url
 * @param {function} [callback]
 * @return {GoogleHomeAVT}
 */
GoogleHomeAVT.prototype.playOnDevice = function(url, callback) {
    let client = new Client();
    let volume = this.volume;
    let originalVolume;

    let closeClient = function() {
        if (this.restoreVolume && volume && originalVolume) {
            client.setVolume(originalVolume, () => {
                client.close();
            });
        } else {
            client.close();
        }
    };

    client.on('error', err => {
        console.log('Error: %s', err.message);
        closeClient();
        callback && callback(false);
    });

    client.connect(this.ip, () => {
        volume && client.getVolume((err, value) => {
            originalVolume = value;
            client.setVolume({level: volume}, (/*err, vol*/) => {});
        });

        client.launch(DefaultMediaReceiver, function(err, player) {
            let media = {
                contentId: url,
                contentType: 'audio/mp3',
                streamType: this.streamType
            };

            player.load(media, {autoplay: true}, (err/*, status*/) => {
                if (err) {
                    console.log('Error: %s', err.message);
                    closeClient();
                    callback && callback(false);
                }
 
                // restore volume after play
                if (this.restoreVolume && volume) {
                    player.on('status', status => {
                        switch(status.playerState) {
                            case 'BUFFERING':
                            case 'PLAYING':
                                break;
                            default:
                                // Finished. Restore volume level.
                                closeClient();
                                callback && callback(media);
                                break;
                        }
                    });
                }

                else {
                    closeClient();
                    callback && callback(media);
                }
            });
        });
    });

    return this;
};

module.export = GoogleHomeAVT;