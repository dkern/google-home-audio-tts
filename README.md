# Google Home Audio & TTS
[![GitHub version](https://badge.fury.io/gh/dkern%2Fgoogle-home-audio-tts.svg)](http://github.com/dkern/google-home-audio-tts)
[![NPM version](https://badge.fury.io/js/google-home-audio-tts.svg)](http://www.npmjs.org/package/google-home-audio-tts)
[![Dependency version](https://david-dm.org/dkern/google-home-audio-tts.png)](https://david-dm.org/dkern/google-home-audio-tts)

Library to play audio and text via [TTS](https://cloud.google.com/text-to-speech/) on Google Home devices.


## Table Of Contents
* [Installation](#installation)
* [Usage](#usage)
* [Configuration](#configuration)
* [Limitations](#limitations)
* [Bugs / Feature request](#bugs--feature-request)
* [License](#license)
* [Donation](#donation)


---


## Installation
Use [npm](http://npmjs.com) to install this module:

```SH
$ npm install google-home-audio-tts
```


## Usage
The library uses callback-style.
Just initialize a new instance for a single device, it can be reused at any time.

```JS
let GoogleHomeAVT = require('google-home-audio-tts');
let device = new GoogleHomeAVT('192.168.2.34', 'en');

// play text via tts
device.tts('Hello!', result => {
    // result:
    // - media object on success
    // - false on error
});

// play audio
device.audio('http://domain.com/file.mp3', result => {
    // result:
    // - media object on success
    // - false on error
});
```


## Configuration
Some options can be changed on any time:

```JS
device.setIp('192.168.2.123'); // change ip address
device.setLanguage('de'); // set language for tts
device.setVolume(1); // change volume before playback, value between 0 and 1
device.setRestoreVolume(true); // restore original volume after playback
device.setStreamType("BUFFERED"); // stream time, BUFFERED or LIVE
device.setTtsTimeout(1000); // set timeout for tts request
device.setTtsSpeed(1); // set tts playback speed
```


## Limitations
- This library explicit **don't** support MDNS!
Use fixed IP addresses for your devices.
MDNS causes problems on different systems. If there is really need to use MDNS, just add this before by yourself and pass the IP to this library.

- TTS texts has a limit of 200 characters.


## Bugs / Feature request
Please [report](http://github.com/dkern/google-home-audio-tts/issues) bugs and feel free to [ask](http://github.com/dkern/google-home-audio-tts/issues) for new features directly on GitHub.


## License
Minoss is dual-licensed under [MIT](http://www.opensource.org/licenses/mit-license.php) and [GPL-2.0](http://www.gnu.org/licenses/gpl-2.0.html) license.


## Donation
_You like to support me?_  
_You appreciate my work?_  
_You use it in commercial projects?_  
  
Feel free to make a little [donation](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=93XQ8EYMSWHC6)! :wink: