import os

# MongoDB Configuration
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb+srv://Hetansh_Panchal:id4vxGPKAEIDlyVE@hetansh.pcfax7n.mongodb.net/solarpredict?retryWrites=true&w=majority')
MONGODB_DB_NAME = os.getenv('MONGODB_DB_NAME', 'solarpredict')

# Collection names
USERS_COLLECTION = 'users'
PREDICTIONS_COLLECTION = 'predictions'
TOKENS_COLLECTION = 'tokens'
HISTORY_COLLECTION = 'historical data'