from flask_restx import Resource, Namespace, fields
from database import db
from model import Level

api = Namespace('update_level', description='Operations related to updating a level')

level_model = api.model('Level', {
    'name': fields.String(required=True, description='The name of the level'),
    'cube_size': fields.Integer(required=True, description='The size of the level'),
    'faces_data': fields.Raw(required=True, description='The configuration of the level')
})

@api.route('/<string:id>')
class UpdateLevel(Resource):
    @api.expect(level_model, validate=True)
    def put(self, id):
        try:
            # Récupère dans la base de données un niveau par son 'id'
            level_to_update = Level.query.get(id)
            if level_to_update is None: # Si le niveau n'est pas trouvé renvoie une erreur
                return {'error': f'Level with ID {id} not found.'}, 404

             # Récupère les données de la requête
            data = api.payload

            # Met à jour les infos du niveau trouvé par les infos de la requête
            level_to_update.name = data.get('name')
            level_to_update.cube_size = data.get('cube_size')
            level_to_update.faces_data = data.get('faces_data')

            # Enregistre les modifications dans la base de données
            db.session.commit()

            return {
                'message': f'Level with ID {id} has been updated successfully.',
                'level': level_to_update.to_dict()
            }, 200
        except Exception as e:
            # En cas d'erreur, annule toutes les modifications effectuées dans la session
            db.session.rollback()
            return {'error': str(e)}, 500
