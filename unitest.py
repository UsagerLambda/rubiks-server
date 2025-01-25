import unittest
from flask import Flask
from flask_restx import Api
from endpoint.create_level import api as create_api
from endpoint.delete_level import api as delete_api
from endpoint.update_level import api as update_api
from endpoint.get_level import api as get_api
from endpoint.get_all_levels import api as get_all_api

class TestLevelAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Configure the Flask application for testing."""
        cls.app = Flask(__name__)
        cls.api = Api(cls.app)

        # Add namespaces
        cls.api.add_namespace(create_api)
        cls.api.add_namespace(delete_api)
        cls.api.add_namespace(update_api)
        cls.api.add_namespace(get_api)
        cls.api.add_namespace(get_all_api)

        # Test client
        cls.client = cls.app.test_client()

    def setUp(self):
        """Reset levels before each test."""
        from temp_db import levels
        levels.clear()

    def test_create_level_success(self):
        """Test creating a new level successfully"""
        data = {
            'name': 'Level 1',
            'cube_size': 3,
            'faces_data': {
                'face_1': [1, 2, 3],
                'face_2': [1, 2, 3],
                'face_3': [1, 2, 3],
                'face_4': [1, 2, 3],
                'face_5': [1, 2, 3],
                'face_6': [1, 2, 3]
            }
        }

        response = self.client.post('/create_level/', json=data)
        self.assertEqual(response.status_code, 201)
        self.assertIn('level', response.json)
        
        level = response.json['level']
        self.assertIn('id', level)
        self.assertEqual(level['name'], 'Level 1')
        self.assertEqual(level['cube_size'], 3)
        
        # Store the created level ID for subsequent tests
        self.created_level_id = level['id']

    def test_create_level_with_different_data(self):
        """Test creating another level with different data"""
        data = {
            'name': 'Level 2',
            'cube_size': 6,
            'faces_data': {
                'face_1': [3, 2, 1],
                'face_2': [3, 2, 1],
                'face_3': [3, 2, 1],
                'face_4': [3, 2, 1],
                'face_5': [3, 2, 1],
                'face_6': [3, 2, 1]
            }
        }

        response = self.client.post('/create_level/', json=data)
        self.assertEqual(response.status_code, 201)
        self.assertIn('level', response.json)
        
        level = response.json['level']
        self.assertIn('id', level)
        self.assertEqual(level['name'], 'Level 2')
        self.assertEqual(level['cube_size'], 6)

    def test_get_level_success(self):
        """Test retrieving a level by ID"""
        # First, create a level
        create_data = {
            'name': 'Test Level',
            'cube_size': 3,
            'faces_data': {
                'face_1': [1, 2, 3],
                'face_2': [1, 2, 3],
                'face_3': [1, 2, 3],
                'face_4': [1, 2, 3],
                'face_5': [1, 2, 3],
                'face_6': [1, 2, 3]
            }
        }
        create_response = self.client.post('/create_level/', json=create_data)
        level_id = create_response.json['level']['id']

        # Then, get the level
        response = self.client.get(f'/get_level/{level_id}')
        self.assertEqual(response.status_code, 200)
        self.assertIn('level', response.json)
        
        level = response.json['level']
        self.assertEqual(level['id'], level_id)
        self.assertEqual(level['name'], 'Test Level')
        self.assertEqual(level['cube_size'], 3)

    def test_get_level_not_found(self):
        """Test retrieving a non-existent level"""
        response = self.client.get('/get_level/non_existent_id')
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json)

    def test_get_all_levels(self):
        """Test retrieving all levels"""
        # Create two levels
        create_data1 = {
            'name': 'Level A',
            'cube_size': 3,
            'faces_data': {
                'face_1': [1, 2, 3],
                'face_2': [1, 2, 3],
                'face_3': [1, 2, 3],
                'face_4': [1, 2, 3],
                'face_5': [1, 2, 3],
                'face_6': [1, 2, 3]
            }
        }
        create_data2 = {
            'name': 'Level B',
            'cube_size': 6,
            'faces_data': {
                'face_1': [3, 2, 1],
                'face_2': [3, 2, 1],
                'face_3': [3, 2, 1],
                'face_4': [3, 2, 1],
                'face_5': [3, 2, 1],
                'face_6': [3, 2, 1]
            }
        }
        
        self.client.post('/create_level/', json=create_data1)
        self.client.post('/create_level/', json=create_data2)

        # Get all levels
        response = self.client.get('/get_all_levels/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('levels', response.json)
        self.assertEqual(len(response.json['levels']), 2)

if __name__ == '__main__':
    unittest.main()
