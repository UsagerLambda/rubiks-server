from flask_restx import Resource, Namespace
from model import Level

api = Namespace('get_level', description='Operations related to get level infos')

@api.route('/<string:id>')
class GetLevel(Resource):
    def get(self, id):
        try:
            # Récupère dans la base de données un niveau par son 'id'
            level = Level.query.get(id)
            if level is None: # Si le niveau n'est pas trouvé renvoie une erreur
                return {'error': f'Level with ID {id} not found.'}, 404

            # Renvoie le niveau trouvé
            return {'level': level.to_dict()}, 200
        except Exception as e:
            return {'error': str(e)}, 500
