from database import db
import uuid
from datetime import datetime
import json

class Level(db.Model):
    __tablename__ = 'levels'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    cube_size = db.Column(db.Integer, nullable=False)
    faces_data = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'cube_size': self.cube_size,
            'faces_data': self.faces_data,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
