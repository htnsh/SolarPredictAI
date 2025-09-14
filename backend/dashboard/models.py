from datetime import datetime
from bson import ObjectId
from authentication.mongodb import get_predictions_collection
import logging

logger = logging.getLogger(__name__)

class PredictionModel:
    """Model for managing solar power predictions in MongoDB"""
    
    @staticmethod
    def get_collection():
        """Get the predictions collection"""
        return get_predictions_collection()
    
    @staticmethod
    def create_prediction(user_id, input_data, prediction_result):
        """
        Create a new prediction record
        
        Args:
            user_id (str): User ID who made the prediction
            input_data (dict): Input parameters used for prediction
            prediction_result (dict): Prediction results from the model
            
        Returns:
            str: Prediction ID if successful, None if failed
        """
        try:
            collection = PredictionModel.get_collection()
            
            prediction_doc = {
                'user_id': user_id,
                'input_data': {
                    'location': input_data.get('location', ''),
                    'humidity': float(input_data.get('humidity', 0)),
                    'temperature': float(input_data.get('temperature', 0)),
                    'date': input_data.get('date', ''),
                    'time': input_data.get('time', ''),
                    'solarIrradiance': float(input_data.get('solarIrradiance', 0)),
                    'windSpeed': float(input_data.get('windSpeed', 0)),
                    'cloudCover': input_data.get('cloudCover', ''),
                    'panelArea': float(input_data.get('panelArea', 0)),
                    'tilt': float(input_data.get('tilt', 0)),
                    'azimuth': float(input_data.get('azimuth', 0))
                },
                'prediction': {
                    'predicted_power_generated': float(prediction_result.get('predicted_power_generated', 0)),
                    'input_parameters': prediction_result.get('input_parameters', {}),
                    'model_info': prediction_result.get('model_info', {})
                },
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            
            result = collection.insert_one(prediction_doc)
            logger.info(f"Prediction created successfully for user {user_id}: {result.inserted_id}")
            return str(result.inserted_id)
            
        except Exception as e:
            logger.error(f"Failed to create prediction for user {user_id}: {e}")
            return None
    
    @staticmethod
    def get_user_predictions(user_id, limit=10, skip=0):
        """
        Get predictions for a specific user
        
        Args:
            user_id (str): User ID
            limit (int): Maximum number of predictions to return
            skip (int): Number of predictions to skip (for pagination)
            
        Returns:
            list: List of prediction documents
        """
        try:
            collection = PredictionModel.get_collection()
            
            # Query for user-specific predictions, sorted by creation date (newest first)
            cursor = collection.find(
                {'user_id': user_id}
            ).sort('created_at', -1).skip(skip).limit(limit)
            
            predictions = []
            for doc in cursor:
                # Convert ObjectId to string for JSON serialization
                doc['_id'] = str(doc['_id'])
                doc['created_at'] = doc['created_at'].isoformat()
                doc['updated_at'] = doc['updated_at'].isoformat()
                predictions.append(doc)
            
            logger.info(f"Retrieved {len(predictions)} predictions for user {user_id}")
            return predictions
            
        except Exception as e:
            logger.error(f"Failed to get predictions for user {user_id}: {e}")
            return []
    
    @staticmethod
    def get_user_latest_prediction(user_id):
        """
        Get the latest prediction for a specific user
        
        Args:
            user_id (str): User ID
            
        Returns:
            dict: Latest prediction document or None
        """
        try:
            collection = PredictionModel.get_collection()
            
            # Get the most recent prediction for the user
            doc = collection.find_one(
                {'user_id': user_id},
                sort=[('created_at', -1)]
            )
            
            if doc:
                # Convert ObjectId to string for JSON serialization
                doc['_id'] = str(doc['_id'])
                doc['created_at'] = doc['created_at'].isoformat()
                doc['updated_at'] = doc['updated_at'].isoformat()
                logger.info(f"Retrieved latest prediction for user {user_id}")
                return doc
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to get latest prediction for user {user_id}: {e}")
            return None
    
    @staticmethod
    def delete_prediction(prediction_id, user_id):
        """
        Delete a specific prediction (only if it belongs to the user)
        
        Args:
            prediction_id (str): Prediction ID to delete
            user_id (str): User ID (for security)
            
        Returns:
            bool: True if deleted successfully, False otherwise
        """
        try:
            collection = PredictionModel.get_collection()
            
            # Delete only if the prediction belongs to the user
            result = collection.delete_one({
                '_id': ObjectId(prediction_id),
                'user_id': user_id
            })
            
            if result.deleted_count > 0:
                logger.info(f"Prediction {prediction_id} deleted for user {user_id}")
                return True
            else:
                logger.warning(f"Prediction {prediction_id} not found or not owned by user {user_id}")
                return False
                
        except Exception as e:
            logger.error(f"Failed to delete prediction {prediction_id} for user {user_id}: {e}")
            return False
    
    @staticmethod
    def get_user_prediction_stats(user_id):
        """
        Get prediction statistics for a user
        
        Args:
            user_id (str): User ID
            
        Returns:
            dict: Statistics about user's predictions
        """
        try:
            collection = PredictionModel.get_collection()
            
            # Count total predictions
            total_predictions = collection.count_documents({'user_id': user_id})
            
            # Get latest prediction date
            latest_prediction = collection.find_one(
                {'user_id': user_id},
                sort=[('created_at', -1)],
                projection={'created_at': 1}
            )
            
            # Calculate average predicted power
            pipeline = [
                {'$match': {'user_id': user_id}},
                {'$group': {
                    '_id': None,
                    'avg_power': {'$avg': '$prediction.predicted_power_generated'},
                    'max_power': {'$max': '$prediction.predicted_power_generated'},
                    'min_power': {'$min': '$prediction.predicted_power_generated'}
                }}
            ]
            
            stats_result = list(collection.aggregate(pipeline))
            stats = stats_result[0] if stats_result else {}
            
            return {
                'total_predictions': total_predictions,
                'latest_prediction_date': latest_prediction['created_at'].isoformat() if latest_prediction else None,
                'average_power': round(stats.get('avg_power', 0), 2),
                'max_power': round(stats.get('max_power', 0), 2),
                'min_power': round(stats.get('min_power', 0), 2)
            }
            
        except Exception as e:
            logger.error(f"Failed to get prediction stats for user {user_id}: {e}")
            return {
                'total_predictions': 0,
                'latest_prediction_date': None,
                'average_power': 0,
                'max_power': 0,
                'min_power': 0
            }