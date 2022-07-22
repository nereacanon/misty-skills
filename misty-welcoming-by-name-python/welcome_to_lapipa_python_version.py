from mistyPy.Robot import Robot
from mistyPy.Events import Events
from mistyPy.EventFilters import EventFilters
import json
misty=Robot(ip='192.168.128.86')




def start():
    misty.RegisterEvent("Face", Events.FaceRecognition,callback_function=FaceDetect)
    misty.StartFaceDetection()
    misty.StartFaceRecognition()



    
def FaceDetect(event):
    print(event)
    print(type(event))
    misty.StopFaceRecognition()
    misty.StopFaceDetection()
    Name=event['message']['personName']

    if Name=='unknown person':
        ##misty.Set("faceInFOV", true, false)
        misty.ChangeLED(148, 0, 211)
        misty.DisplayImage("e_Contempt.jpg")
        misty.Speak("Hello human, welcome to La Pipa! What's your name?")
        #misty.Stop(3500)

        #misty.RegisterEvent('FaceTraining',Events.FaceTraining,callback_function=FaceTraining)


    
    else:
        #misty.Set("faceInFOV", true, false);
        misty.ChangeLED(0, 0, 111)
        misty.DisplayImage("e_Joy2.jpg")
        string = 'Hi '+ Name+ ' we have met before'
        misty.Speak(string)

        #misty.MoveArm("both", -26, 100)
        #misty.Stop(1000)
        #misty.MoveArm("both", 90, 100)




