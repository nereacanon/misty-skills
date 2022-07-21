from mistyPy.Robot import Robot
from mistyPy.Events import Events
from mistyPy.EventFilters import EventFilters
import json
misty=Robot(ip='192.168.128.86')

misty.StartFaceRecognition()
misty.RegisterEvent("FaceDetect", Events.FaceRecognition, 8000,callback_function=FaceDetect)

def FaceDetect(face):
    x=json.loads(misty.GetKnownFaces().text)['results']
    if (face not in x ):
     #misty.Set("faceInFOV", true, false)
         misty.ChangeLED(148, 0, 211)
         misty.DisplayImage("e_Joy2.jpg")
         misty.Speak("Hello human, welcome to La Pipa! What's your name?")
         misty.Stop(3500)
    
    else:
        #misty.Set("faceInFOV", true, false);
        misty.ChangeLED(0, 0, 111)
        misty.DisplayImage("e_Joy2.jpg")
        misty.Speak("Hi ", face ,", we've met before! How are you?")

        misty.MoveArm("both", -26, 100)
        misty.Stop(1000)
        misty.MoveArm("both", 90, 100)
        


 
 
 





