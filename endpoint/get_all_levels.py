from flask_restx import Resource, Namespace
from model import Level

api = Namespace('get_all_levels', description='Operations related to get levels infos')

@api.route('/')
class GetAllLevels(Resource):
    def get(self):
        """Retrieve all levels excluding 'faces_data'."""
        try:
            # Récupère tous les niveaux de la base de données
            levels = Level.query.all()
            # Transforme les données des niveaux en un format sérialisé pour l'affichage
            serialized_levels = [
                {
                    'id': level.id,
                    'name': level.name,
                    'cube_size': level.cube_size,
                    'created_at': level.created_at.isoformat(),
                    'updated_at': level.updated_at.isoformat()
                }
                for level in levels # Sérialise chaque niveau récupéré dans 'levels'
            ]
            return {"levels": serialized_levels}, 200
        except Exception as e:
            return {'error': str(e)}, 500
