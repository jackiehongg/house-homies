from server import app

if __name__ == '__main__':
    app.run(debug=False)
    # socketio.run(app, debug=True, port=10000)
