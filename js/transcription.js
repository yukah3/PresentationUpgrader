var final_transcript = '';
var complete_transcript = '';
var recognizing = false;

//            var language = 'ja-JP';
var language = 'en-US';

//var textBox = document.getElementById('result_text').innerHTML;

$(document).ready(function () {

    // check that your browser supports the API
    if (!('webkitSpeechRecognition' in window)) {
        alert("Your Browser does not support the Speech API");

    } else {

        // Create the recognition object and define four event handlers (onstart, onerror, onend, onresult)

        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true; // keep processing input until stopped
        recognition.interimResults = true; // show interim results
        recognition.lang = language; // specify the language

        recognition.onstart = function () {
//            $('#instructions').html('Speak slowly and clearly');
        };

        recognition.onerror = function (event) {
            console.log("There was a recognition error...");
        };
        
        var inspeech=false;
        
        recognition.onresult = function (event) {
            var interim_transcript = '';
            inspeech=true;

            // Assemble the transcript from the array of results
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
//                    textBox = final_transcript;
//                    document.getElementById('result_text').innerHTML = event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
//                    document.getElementById('result_text').innerHTML += event.results[i][0].transcript;
                }
            }
            
            complete_transcript = final_transcript + interim_transcript;
            document.getElementById('result_text').innerHTML = complete_transcript;
            document.getElementById('result_text').scrollTop = document.getElementById('result_text').scrollHeight;

            console.log("interim:  " + interim_transcript);
            console.log("final:    " + final_transcript);
            inspeech=false;
        };


        $("#start_button").click(function (e) {
            e.preventDefault();

            if (recognizing) {
                recognizing = false;
                recognition.stop();
            } else {
                final_transcript = '';

                // Request access to the User's microphone and Start recognizing voice input
                recognizing = true;
                recognition.start();

//                $('#instructions').html('Allow the browser to use your Microphone');
//                $('#transcript').html('&nbsp;');
            }
        });


        setInterval(resetVoiceRecog, 30000);

        function resetVoiceRecog() {
            if (inspeech == false) {
                recognition.stop();
            }
        }

        recognition.onend = function (event) {
            if(recognizing == true){
                final_transcript += ' ';
                recognition.start();
            }

        }

    }
});