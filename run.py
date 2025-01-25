from flask import Flask
from flask_restx import Api
from database import init_db
from flask_cors import CORS

from endpoint.create_level import api as create_api
from endpoint.delete_level import api as delete_api
from endpoint.update_level import api as update_api
from endpoint.get_level import api as get_api
from endpoint.get_all_levels import api as get_all_api


app = Flask(__name__)

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

# Create database tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run()
