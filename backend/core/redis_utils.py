import redis
from django.conf import settings

# Initialize Redis connection
redis_client = redis.StrictRedis.from_url(settings.CACHES['default']['LOCATION'])

def set_key(key, value, timeout=None):
    """Set a key-value pair in Redis with an optional timeout."""
    redis_client.set(key, value, ex=timeout)

def get_key(key):
    """Get the value of a key from Redis."""
    return redis_client.get(key)

def delete_key(key):
    """Delete a key from Redis."""
    redis_client.delete(key)

def key_exists(key):
    """Check if a key exists in Redis."""
    return redis_client.exists(key) > 0

def store_otp(key, otp, timeout=300):
    """Store an OTP in Redis with a timeout (default: 5 minutes)."""
    redis_client.set(key, otp, ex=timeout)

def validate_otp(key, otp):
    """Validate an OTP by checking it against the stored value in Redis."""
    stored_otp = redis_client.get(key)
    if stored_otp and stored_otp.decode('utf-8') == otp:
        delete_key(key)  # Delete OTP after successful validation
        return True
    return False

def store_session_token(key, token, timeout=3600):
    """Store a session token in Redis with a timeout (default: 1 hour)."""
    redis_client.set(key, token, ex=timeout)

def validate_session_token(key, token):
    """Validate a session token by checking it against the stored value in Redis."""
    stored_token = redis_client.get(key)
    return stored_token and stored_token.decode('utf-8') == token