misty.SetDefaultVolume(20);
//misty.Speak("<speak> Hi! My name is Misty. </speak>");

misty.Speak("<speak>" +
    "How do you say <lang xml:lang=\"fr-FR\">Bonjour le monde</lang> in English?"+
    "or <lang xml:lang=\"es\">Hola amigo</lang> in Spanish?"+
    "</speak>");
misty.Pause(10000);