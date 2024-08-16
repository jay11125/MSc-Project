from datetime import timedelta

class Config:
    MONGO_URI = 'mongodb+srv://jayagrawal:jayagrawal@cluster0.byhqkml.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0'
    JWT_SECRET_KEY = 'jay11125'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
