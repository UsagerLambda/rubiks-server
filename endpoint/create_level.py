from flask_restx import Resource, Namespace, fields
from database import db
from model import Level

api = Namespace('create_level', description='Operations related to creating a level')

level_model = api.model('Level', {
    'name': fields.String(required=True, description='The name of the level'),
    'cube_size': fields.Integer(required=True, description='The size of the level'),
    'faces_data': fields.Raw(required=True, description='The configuration of the level as a JSON object')
})

@api.route('/')
class CreateLevel(Resource):
    @api.expect(level_model, validate=True)
    def post(self):
        """Create new level"""
        data = api.payload # Récupère les données de la requête
        try:
            # Vérifie si un niveau avec le même nom existe déjà dans la base de données
            existing_level = Level.query.filter_by(name=data['name']).first()
            if existing_level: # Si un niveau existe déjà, retourne une erreur
                return {'error': f"A level with the name '{data['name']}' already exists."}, 400

            # Crée une nouvelle instance de Level avec les informations fournies dans la requête
            level = Level(
                name=data['name'],
                cube_size=data['cube_size'],
                faces_data=data['faces_data']
            )
            db.session.add(level) # Prépare l'ajout de l'instance dans la base de données
            db.session.commit() # Enregistre définitivement l'instance dans la base de données

            return {
                'message': 'Level created successfully',
                'level': level.to_dict()
            }, 201
        except Exception as e:
            # En cas d'erreur, annule toutes les modifications effectuées dans la session
            db.session.rollback()
            return {'error': str(e)}, 400
