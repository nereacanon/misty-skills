// Misty Looks around when she does not see a human faces

misty.Set("faceInFOV", false, false);
misty.MoveArmDegrees("both", 90, 100);

function _look_around(repeat = true) 
{
    if (!misty.Get("faceInFOV")) misty.MoveHeadDegrees(gaussianRandom(-20, 35), gaussianRandom(-35, 35), gaussianRandom(-75, 75), 300);
    if (repeat) misty.RegisterTimerEvent("look_around", getRandomInt(5, 10) * 1000, false);
}
misty.RegisterTimerEvent("look_around", 10, false);

function gaussianRand() 
{
    var u = v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5;
    if (num > 1 || num < 0) return gaussianRand();
    
    return num;
}

function gaussianRandom(start, end) 
{
    return Math.floor(start + gaussianRand() * (end - start + 1));
}


function getRandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//----------------------------------------------------------------------



// --------------------- Face Recognition ------------------------------

misty.Debug("Homing Head and Arms");
_timeoutToNormal();

misty.StartFaceRecognition();

function registerFaceDetection() 
{
    misty.AddPropertyTest("FaceDetect", "PersonName", "exists", "", "string");
    misty.RegisterEvent("FaceDetect", "FaceRecognition", 8000, true);
}

function _FaceDetect(data) {
        misty.Debug(JSON.stringify(data));
        misty.Set("faceInFOV", true, false);
        misty.ChangeLED(148, 0, 211);
        misty.DisplayImage("e_Joy2.jpg");
        misty.StartFaceTraining("My_Face_");
        misty.Speak("<speak> State your name. </speak>");

        misty.AddReturnProperty("VoiceRecord", "Filename");
        misty.AddReturnProperty("VoiceRecord", "Success");
        misty.AddReturnProperty("VoiceRecord", "ErrorCode");
        misty.AddReturnProperty("VoiceRecord", "ErrorMessage");
        misty.RegisterEvent("VoiceRecord", "VoiceRecord", 10, false);

        misty.Debug("Recording audio..")
        misty.CaptureSpeech(false, true, 10000, 5000, null);

        // wave
        misty.MoveArmDegrees("both", -26, 100);
        misty.Pause(1000);
        misty.MoveArmDegrees("both", 90, 100);

        misty.RegisterTimerEvent("timeoutToNormal", 3000, false);
}

registerFaceDetection();

function _timeoutToNormal() 
{
    misty.Set("faceInFOV", false, false);
    misty.Pause(100);
    // misty.MoveHeadDegrees(0.1, 0.1, 0.1, 40);
    misty.ChangeLED(0, 255, 0);
    misty.DisplayImage("e_DefaultContent.jpg");
}

function _VoiceRecord(data) {
    // Get data from AdditionalResults array
    var filename = data.AdditionalResults[0];
    var success = data.AdditionalResults[1];
    var errorCode = data.AdditionalResults[2];
    var errorMessage = data.AdditionalResults[3];
 
    // If speech capture is successful, call GetAudioFile with Base64 encoding
    if (success = true) {
       misty.Debug("Successfully captured speech! Listen closely...");
       misty.PlayAudio(filename, 100);

       misty.GetAudioFile(filename); // This goes to a callback function
    }
    // Otherwise, print the error message
    else {
       misty.Debug("Error: " + errorCode + ". " + errorMessage);
    }
}

function _GetAudioFile(data) {
  misty.Debug(JSON.stringify(data)); // Check that audio is in Base64 encoding
  let base64 = data.Result.Base64;

  misty.SendExternalRequest("POST", 
       "https://speech.googleapis.com/v1p1beta1/speech:recognize?key=AIzaSyDvQdxRejRW1RwiMd5rZW9TvuAAZuiQlQw", 
       null, null,
       JSON.stringify({
        "audio": {
          "content": base64
        },
        "config": {
          "enableAutomaticPunctuation": true,
          //"encoding": "LINEAR16", // not needed in .wav files
          "languageCode": "es-ES",
          "model": "command_and_search" // otra opción es "default"
        }
      })
      );
}

function _SendExternalRequest(data) {
  response = JSON.parse(data.Result.ResponseObject.Data)
  misty.Debug("We got:" + JSON.stringify(response))
}