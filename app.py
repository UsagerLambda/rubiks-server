from flask import Flask, send_from_directory
from flask_restx import Api
from database import init_db
from flask_cors import CORS
import os


from endpoint.create_level import api as create_api
from endpoint.delete_level import api as delete_api
from endpoint.update_level import api as update_api
from endpoint.get_level import api as get_api
from endpoint.get_all_levels import api as get_all_api


app = Flask(__name__, static_folder='frontend')
CORS(app)


# Initialize database
db = init_db(app)


# Create API
api = Api(app)


# Add namespaces
api.add_namespace(create_api)
api.add_namespace(delete_api)
api.add_namespace(update_api)
api.add_namespace(get_api)
api.add_namespace(get_all_api)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
   if path != "" and os.path.exists(os.path.join('frontend', path)):
       return send_from_directory('frontend', path)
   else:
       return send_from_directory('frontend', 'index.html')


if __name__ == '__main__':
   # Create database tables
   with app.app_context():
       db.create_all()


   app.run(host='0.0.0.0', port=5123)
