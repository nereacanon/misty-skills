misty.SetDefaultVolume(20);
//misty.Speak("<speak> Hi! My name is Misty. </speak>");

misty.Speak("Hi " + 
    "Jesús Templado".normalize('NFD').replace(/[\u0300-\u036f]/g, '') + 
    ", how are you?");
misty.Pause(10000);