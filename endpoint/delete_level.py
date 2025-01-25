from flask_restx import Resource, Namespace
from database import db
from model import Level

api = Namespace('delete_level', description='Operations related to deleting a level')

@api.route('/<string:id>')
class DeleteLevel(Resource):
    def delete(self, id):
        try:
            # Récupère dans la base de données un niveau par son 'id'
            level_to_delete = Level.query.get(id)
            if level_to_delete is None: # Si le niveau n'est pas trouvé renvoie une erreur
                return {'error': f'Level with ID {id} not found.'}, 404

            db.session.delete(level_to_delete) # Supprime le niveau trouvé
            db.session.commit() # Enregistre définitivement la modification dans la base de données

            return {'message': f'Level with ID {id} has been deleted successfully.'}, 200
        except Exception as e:
            # En cas d'erreur, annule toutes les modifications effectuées dans la session
            db.session.rollback()
            return {'error': str(e)}, 500
