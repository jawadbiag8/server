import socketio
import cv2
import pyautogui
import numpy as np
import threading
import base64

# Initialize Socket.IO client
sio = socketio.Client()

# Connect to the server
sio.connect('http://localhost:3040')  # Replace with your server address

# Get screen resolution
screen_width, screen_height = pyautogui.size()

# Define the frame size
frame_size = (screen_width, screen_height)

# Define the video capture device
video_capture = cv2.VideoCapture(0)  # You may need to adjust the device index (e.g., 0, 1, etc.)

# Set the frame size
video_capture.set(cv2.CAP_PROP_FRAME_WIDTH, frame_size[0])
video_capture.set(cv2.CAP_PROP_FRAME_HEIGHT, frame_size[1])


@sio.event
def connect(sid, environ):
    print('Connected to server'+sid)


@sio.event
def disconnect():
    print('Disconnected from server')


# Function to emit the screen sharing stream
def emit_screen_share():
    print(sio.get_sid())
    while True:
        # Capture the screen frame
        # ret, frame = video_capture.read()
        screen_image = pyautogui.screenshot()

        # Convert the image to a NumPy array
        frame = cv2.cvtColor(np.array(screen_image), cv2.COLOR_RGB2BGR)

        # Convert the frame to JPEG
        ret, buffer = cv2.imencode('.jpg', frame)

        # Convert the buffer to bytes
        data = buffer.tobytes()
        # Convert the buffer to base64
        base64_data = base64.b64encode(data).decode('utf-8')

        # Emit the base64-encoded frame as an event to the server
        # sio.
        sio.emit('stream', base64_data)  # Emitting the base64 data to 'stream' event


        # Escape key to stop the screen sharing
        if cv2.waitKey(1) == 27:
            break


# Start the screen sharing thread
screen_share_thread = threading.Thread(target=emit_screen_share)
screen_share_thread.start()

# Event handler for receiving messages from the server (optional)
@sio.on('message')
def on_message(data):
    print('Received message:', data)


# Event handler for receiving server commands (optional)
@sio.on('command')
def on_command(data):
    print('Received command:', data)


# Keep the script running until interrupted
try:
    while True:
        pass
except KeyboardInterrupt:
    pass

# Disconnect from the server
sio.disconnect()

# Release the video capture device and destroy any OpenCV windows
video_capture.release()
cv2.destroyAllWindows()
