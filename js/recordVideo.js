(function () {
    var params = {},
        r = /([^&=]+)=?([^&]*)/g;

    function d(s) {
        return decodeURIComponent(s.replace(/\+/g, ' '));
    }

    var match, search = window.location.search;
    while (match = r.exec(search.substring(1))) {
        params[d(match[1])] = d(match[2]);

        if (d(match[2]) === 'true' || d(match[2]) === 'false') {
            params[d(match[1])] = d(match[2]) === 'true' ? true : false;
        }
    }

    window.params = params;
})();

function intallFirefoxScreenCapturingExtension() {
    InstallTrigger.install({
        'Foo': {
            // URL: 'https://addons.mozilla.org/en-US/firefox/addon/enable-screen-capturing/',
            URL: 'https://addons.mozilla.org/firefox/downloads/file/355418/enable_screen_capturing_in_firefox-1.0.006-fx.xpi?src=cb-dl-hotness',
            toString: function () {
                return this.URL;
            }
        }
    });
}

// attrubutes modified
/*
var videoDuration;

var recordingDIV = document.querySelector('.recordrtc');
var recordingMedia;
var recordingPlayer = recordingDIV.querySelector('video');
var mediaContainerFormat;
*/

window.onbeforeunload = function () {
    recordingDIV.querySelector('button').disabled = false;
    recordingMedia.disabled = false;
    mediaContainerFormat.disabled = false;
};

/*

recordingDIV.querySelector('button').onclick = function () {
    var button = this;

    if (button.innerHTML === 'Stop Recording') {
        button.disabled = true;
        button.disableStateWaiting = true;
        setTimeout(function () {
            button.disabled = false;
            button.disableStateWaiting = false;
        }, 2 * 1000);

        button.innerHTML = 'Star Recording';

        function stopStream() {
            if (button.stream && button.stream.stop) {
                button.stream.stop();
                button.stream = null;
            }
        }

        if (button.recordRTC) {
            if (button.recordRTC.length) {
                button.recordRTC[0].stopRecording(function (url) {
                    if (!button.recordRTC[1]) {
                        button.recordingEndedCallback(url);
                        stopStream();
                        // modified! deleted
                        saveToServer(button.recordRTC[0]);
                        return;
                    }

                    button.recordRTC[1].stopRecording(function (url) {
                        button.recordingEndedCallback(url);
                        stopStream();
                    });
                });
            } else {
                button.recordRTC.stopRecording(function (url) {
                    button.recordingEndedCallback(url);
                    stopStream();
                    // modified! deleted
                    saveToServer(button.recordRTC);
                });
            }
        }

        return;
    }

    button.disabled = true;

    var commonConfig = {
        onMediaCaptured: function (stream) {
            button.stream = stream;
            if (button.mediaCapturedCallback) {
                button.mediaCapturedCallback();
            }

            button.innerHTML = 'Stop Recording';
            button.disabled = false;
        },
        onMediaStopped: function () {
            button.innerHTML = 'Start Recording';

            if (!button.disableStateWaiting) {
                button.disabled = false;
            }
        },
        onMediaCapturingFailed: function (error) {
            if (error.name === 'PermissionDeniedError' && !!navigator.mozGetUserMedia) {
                intallFirefoxScreenCapturingExtension();
            }

            commonConfig.onMediaStopped();
        }
    };

    var mimeType = 'video/webm';

    // modified!!
    function recordAudioPlusVideo() {
        captureAudioPlusVideo(commonConfig);

        button.mediaCapturedCallback = function () {

            if (typeof MediaRecorder === 'undefined') { // opera or chrome etc.
                button.recordRTC = [];

                if (!params.bufferSize) {
                    // it fixes audio issues whilst recording 720p
                    params.bufferSize = 16384;
                }

                var options = {
                    type: 'audio',
                    bufferSize: typeof params.bufferSize == 'undefined' ? 0 : parseInt(params.bufferSize),
                    sampleRate: typeof params.sampleRate == 'undefined' ? 44100 : parseInt(params.sampleRate),
                    leftChannel: params.leftChannel || false,
                    disableLogs: params.disableLogs || false,
                    recorderType: webrtcDetectedBrowser === 'edge' ? StereoAudioRecorder : null
                };

                if (typeof params.sampleRate == 'undefined') {
                    delete options.sampleRate;
                }

                // commentout from here
                var audioRecorder = RecordRTC(button.stream, options);

                var videoRecorder = RecordRTC(button.stream, {
                    type: 'video',
                    disableLogs: params.disableLogs || false,
                    canvas: {
                        width: params.canvas_width || 320,
                        height: params.canvas_height || 240
                    },
                    frameInterval: typeof params.frameInterval !== 'undefined' ? parseInt(params.frameInterval) : 20 // minimum time between pushing frames to Whammy (in milliseconds)
                });

                // to sync audio/video playbacks in browser!
                videoRecorder.initRecorder(function () {
                    audioRecorder.initRecorder(function () {
                        audioRecorder.startRecording();
                        videoRecorder.startRecording();
                    });
                });

                button.recordRTC.push(audioRecorder, videoRecorder);

                button.recordingEndedCallback = function () {
                    var audio = new Audio();
                    audio.src = audioRecorder.toURL();
                    audio.controls = true;
                    // audio.autoplay = true;
                    // changed!!!!
                    audio.autoplay = false;

                    audio.onloadedmetadata = function () {
                        recordingPlayer.src = videoRecorder.toURL();
                        recordingPlayer.play();
                    };

                    recordingPlayer.parentNode.appendChild(document.createElement('hr'));
                    recordingPlayer.parentNode.appendChild(audio);

                    if (audio.paused) audio.play();
                };
                return;
            }

            // the audio+video pushed
            button.recordRTC = RecordRTC(button.stream, {
                type: 'video',
                mimeType: mimeType,
                disableLogs: params.disableLogs || false,
                // bitsPerSecond: 25 * 8 * 1025 // 25 kbits/s
                getNativeBlob: false // enable it for longer recordings
            });

            button.recordingEndedCallback = function (url) {
                recordingPlayer.muted = false;
                recordingPlayer.removeAttribute('muted');
                recordingPlayer.src = url;
                //                            recordingPlayer.play();

                recordingPlayer.onended = function () {
                    recordingPlayer.pause();
                    recordingPlayer.src = URL.createObjectURL(button.recordRTC.blob);
                };
            };

            button.recordRTC.startRecording();
        };
    }
    recordAudioPlusVideo();
};

function captureAudioPlusVideo(config) {
    captureUserMedia({
        video: true,
        audio: true
    }, function (audioVideoStream) {
        recordingPlayer.srcObject = audioVideoStream;
        recordingPlayer.play();

        config.onMediaCaptured(audioVideoStream);

        audioVideoStream.onended = function () {
            config.onMediaStopped();
        };
    }, function (error) {
        config.onMediaCapturingFailed(error);
    });
}

function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
    var isBlackBerry = !!(/BB10|BlackBerry/i.test(navigator.userAgent || ''));
    if (isBlackBerry && !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia)) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        navigator.getUserMedia(mediaConstraints, successCallback, errorCallback);
        return;
    }

    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
}

function setMediaContainerFormat(arrayOfOptionsSupported) {
    var options = Array.prototype.slice.call(
        mediaContainerFormat.querySelectorAll('option')
    );

    var selectedItem;
    options.forEach(function (option) {
        option.disabled = true;

        if (arrayOfOptionsSupported.indexOf(option.value) !== -1) {
            option.disabled = false;

            if (!selectedItem) {
                option.selected = true;
                selectedItem = option;
            }
        }
    });
}

if (webrtcDetectedBrowser === 'edge') {
    // webp isn't supported in Microsoft Edge
    // neither MediaRecorder API
    // so lets disable both video/screen recording options

    console.warn('Neither MediaRecorder API nor webp is supported in Microsoft Edge. You cam merely record audio.');

    recordingMedia.innerHTML = '<option value="record-audio">Audio</option>';
    setMediaContainerFormat(['WAV']);
}

if (webrtcDetectedBrowser === 'firefox') {
    // Firefox implemented both MediaRecorder API as well as WebAudio API
    // Their MediaRecorder implementation supports both audio/video recording in single container format
    // Remember, we can't currently pass bit-rates or frame-rates values over MediaRecorder API (their implementation lakes these features)

    recordingMedia.innerHTML = '<option value="record-audio-plus-video">Audio+Video</option>' + '<option value="record-audio-plus-screen">Audio+Screen</option>' + recordingMedia.innerHTML;

    setMediaContainerFormat(['WebM', 'Mp4']);
}


if (webrtcDetectedBrowser === 'chrome') {
    if (typeof MediaRecorder === 'undefined') {
        console.info('This RecordRTC demo merely tries to playback recorded audio/video sync inside the browser. It still generates two separate files (WAV/WebM).');
    }
}

// modified
function saveToServer(recordRTC) {
    document.querySelector('#save_to_server').onclick = function () {
        if (!recordRTC) return alert('No recording found!');
        var audioVideoBlob = recordRTC.blob;


        // you can upload Blob to PHP/ASPNET server
        uploadBlob(audioVideoBlob);

        // you can even upload DataURL
        recordRTC.getDataURL(function (dataURL) {
            $.ajax({
                type: 'POST',
                url: 'save.php',
                data: {
                    dataURL: dataURL
                },
                contentType: 'application/json; charset=utf-8',
                success: function (msg) {
                    alert('Successfully uploaded.');
                },
                error: function (jqXHR, textStatus, errorMessage) {
                    alert('Error:' + JSON.stringify(errorMessage));
                }
            });
        });
    }

}

// modified 2
function uploadBlob(blob) {
    var formData = new FormData();
    formData.append('video-blob', blob);
    formData.append('video-filename', 'FileName.webm');
    $.ajax({
        url: "save.php",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            alert('Successfully uploaded.');
        },
        error: function (jqXHR, textStatus, errorMessage) {
            alert('Error:' + JSON.stringify(errorMessage));
        }
    });
}
*/