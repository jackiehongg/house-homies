# from server import app

# if __name__ == '__main__':
#     app.run(debug=False)
#     socketio.run(app, debug=True, port=10000)

import eventlet
from eventlet import wsgi
from server import create_app

ip_addr = ('', 5001)

app = create_app()
wsgi.server(eventlet.listen(ip_addr), app)