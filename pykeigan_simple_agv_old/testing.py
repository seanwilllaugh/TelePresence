from flask import Flask, request, jsonify
from flask_cors import CORS
from twd import TWD
import threading
import logging

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Setup logging
logging.basicConfig(level=logging.INFO)

# Initialize the TWD robot
port_left = '/dev/serial/by-id/usb-FTDI_FT230X_Basic_UART_DM00KF8O-if00-port0'
port_right = '/dev/serial/by-id/usb-FTDI_FT230X_Basic_UART_DM00LPNT-if00-port0'
twd = TWD(port_left, port_right, wheel_d=101.6, tread=286.8)

RUN_CMD_INTERVAL = 0.05  # 0.1秒ごとに処理を行う
RUN_BASE_RPM = 50
STOP_AFTER_RPM = 10
STOP_AFTER_RPM1 = 5

# Global variables to store motor speeds
left_motor_speed = 0
right_motor_speed = 0

# Lock to ensure thread safety when updating motor speeds
motor_speed_lock = threading.Lock()
@app.route('/motor-control', methods=['POST'])
def motor_control():
    global left_motor_speed, right_motor_speed

    data = request.json
    joystick_command = data.get('joystickCommand')

    if joystick_command:
        update_motor_speeds(joystick_command)

    # Logging the motor control request
    logging.info(f"Received motor control request: left_speed={left_motor_speed}, right_speed={right_motor_speed}")

    # Control the robot using TWD class methods
    twd.run(left_motor_speed, right_motor_speed)

    return jsonify({"status": "success", "leftSpeed": left_motor_speed, "rightSpeed": right_motor_speed})

def update_motor_speeds(joystick_command):
    global left_motor_speed, right_motor_speed

    # Extract speed values from joystick command
    left_speed = joystick_command.get('leftMotorSpeed', 0)
    right_speed = joystick_command.get('rightMotorSpeed', 0)

    # Update global motor speed variables
    with motor_speed_lock:
        left_motor_speed = left_speed
        right_motor_speed = right_speed

@app.route('/health', methods=['GET'])
def health_check():
    # Logging each health check call
    logging.info("Health check endpoint was called.")
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    twd.enable()
    # twd.pivot_turn(10, 180, 10)

    # Start the server with logging
    logging.info("Starting Flask server for TWD robot control")
    app.run(host='0.0.0.0', port=5000)
