/******************************************************************************
*    Copyright 2020 Misty Robotics, Inc.
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
* 
* 	 **WARRANTY DISCLAIMER.**
* 
* 	 * General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY
* 	 ROBOTICS PROVIDES THIS SAMPLE SOFTWARE "AS-IS" AND DISCLAIMS ALL
* 	 WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY,
* 	 INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* 	 PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF
* 	 THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC
* 	 RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO
* 	 WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES
* 	 OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
* 	 * Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT
* 	 YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY
* 	 ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO
* 	 ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT,
* 	 COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE
* 	 OR PRODUCT.
* 
* 	 Please refer to the Misty Robotics End User License Agreement for further
* 	 information and full details:
* 	 	https://www.mistyrobotics.com/legal/end-user-license-agreement/
******************************************************************************/

// Misty Looks around when she does not see a human faces

misty.Set("faceInFOV", false, false);
misty.MoveArmDegrees("both", 90, 100);
misty.MoveHeadDegrees(0, 0, 0, 30);
misty.Speak("Hi! My name is Misty."); // Letting modules load after shutdown
misty.Pause(2000);

/*function _look_around(repeat = true) 
{
    if (!misty.Get("faceInFOV")) misty.MoveHeadDegrees(gaussianRandom(-20, 35), gaussianRandom(-35, 35), gaussianRandom(-75, 75), 300);
    if (repeat) misty.RegisterTimerEvent("look_around", getRandomInt(5, 10) * 1000, false);
}
misty.RegisterTimerEvent("look_around", 10, false);*/

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

// --------------------- Helper function ---------------------------

// Promise for waiting a specified amount of time
function sleep(ms) { 
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --------------------- Face Recognition ------------------------------

misty.Debug("Homing Head and Arms");
_timeoutToNormal();

misty.StartFaceRecognition();

function registerFaceDetection() 
{
    misty.AddPropertyTest("FaceDetect", "PersonName", "exists", "", "string");
    misty.RegisterEvent("FaceDetect", "FaceRecognition", 8000, true);
}

function _FaceDetect(data) 
{
    var faceDetected = data.PropertyTestResults[0].PropertyParent.Label;

    if (faceDetected == "unknown person") { // New person

        misty.Debug(JSON.stringify(data));
        misty.Set("faceInFOV", true, false);
        misty.ChangeLED(148, 0, 211);
        misty.DisplayImage("e_Joy2.jpg");
        misty.Speak("<speak> Hello human, welcome to La Pipa! What's your name? </speak>", postPauseMs = 50);
        //misty.Pause(2000);

        misty.AddReturnProperty("VoiceRecord", "Filename");
        misty.AddReturnProperty("VoiceRecord", "Success");
        misty.AddReturnProperty("VoiceRecord", "ErrorCode");
        misty.AddReturnProperty("VoiceRecord", "ErrorMessage");
        misty.RegisterEvent("VoiceRecord", "VoiceRecord", 10, false);

        misty.Debug("Recording audio..");
        misty.CaptureSpeech(false, true, 10000, 5000, null);

        misty.RegisterTimerEvent("timeoutToNormal", 5000, false);
    }
    
    else { // Registered face
        misty.Debug(JSON.stringify(data));
        misty.Set("faceInFOV", true, false);
        misty.ChangeLED(0, 0, 111);
        misty.DisplayImage("e_Joy2.jpg");
        misty.Speak("Hi " + faceDetected + ", we've met before! How are you?");

        // wave
        misty.MoveArmDegrees("both", -26, 100);
        misty.Pause(1000);
        misty.MoveArmDegrees("both", 90, 100);

        misty.RegisterTimerEvent("timeoutToNormal", 5000, false);
    }
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
        //misty.Debug("Successfully captured speech! Listen closely...");
        //misty.PlayAudio(filename, 50);
 
        misty.GetAudioFile(filename); // This goes to a callback function
     }
    // Otherwise, print the error message
    else {
       misty.Debug("Error: " + errorCode + ". " + errorMessage);
    }
}

function _GetAudioFile(data) {
    //misty.Debug(JSON.stringify(data)); // Check that audio is in Base64 encoding
    let base64 = data.Result.Base64;
    let apikey = APIKEY;
  
    misty.SendExternalRequest("POST", 
         "https://speech.googleapis.com/v1p1beta1/speech:recognize?key=" + apikey, 
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
  
async function _SendExternalRequest(data) {

    response = JSON.parse(data.Result.ResponseObject.Data);
    await sleep(3000); // Async; waiting for API response
    
    misty.Debug("We got:" + JSON.stringify(response));
    
    /* 
    This part overrides the value of the label
    associated to the recognized face
    
    The API response format is shown in the page below:
    https://cloud.google.com/speech-to-text/docs/basics#responses
    */

    misty.Debug("Value of label is: " + response.results[0].alternatives[0].transcript);
    misty.Speak("<speak> Thank you! Please stand still for a second. </speak>");
    misty.StartFaceTraining(response.results[0].alternatives[0].transcript);
    misty.Debug("Face training finished.");
    misty.ChangeLED(250, 0, 0);
}