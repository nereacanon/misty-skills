misty.Debug("Starting streaming service..")

misty.EnableAvStreamingService()

port = "rtspd:1935"

misty.StartAvStreaming(port, 640, 480, null, null, null, null, null, null)

misty.Debug("Streaming enabled on port: " + port)