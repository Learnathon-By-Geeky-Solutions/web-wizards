import redis
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

# DummyRedis class to use when Redis is not available
class DummyRedis:
    """Dummy Redis client that does nothing but log operations."""
    def __init__(self):
        logger.warning("Using DummyRedis - Redis operations will be no-ops")
    
    def __getattr__(self, name):
        def noop_method(*args, **kwargs):
            logger.debug(f"DummyRedis: {name} called with {args}, {kwargs}")
            if name in ['get', 'exists']:
                return None
            elif name == 'pipeline':
                return self
            return 0
        return noop_method
    
    def execute(self):
        return [None] * 10  # Return enough None values to satisfy any expected unpacking

# Initialize Redis client lazily
redis_client = None

def get_redis_client():
    global redis_client
    if redis_client is not None:
        return redis_client
    
    try:
        redis_url = settings.REDIS_URL
        # Check if Redis URL is None, empty string or the string "None" (from environment variable)
        if redis_url is None or redis_url == "" or redis_url.lower() == "none":
            redis_client = DummyRedis()
        else:
            redis_client = redis.StrictRedis.from_url(redis_url)
            # Test connection
            redis_client.ping()
    except Exception as e:
        logger.warning(f"Failed to connect to Redis: {e}")
        redis_client = DummyRedis()
    
    return redis_client

# Replace all direct redis_client usages with get_redis_client()
def set_key(key, value, timeout=None):
    """Set a key-value pair in Redis with an optional timeout."""
    get_redis_client().set(key, value, ex=timeout)

def get_key(key):
    """Get the value of a key from Redis."""
    return get_redis_client().get(key)

def delete_key(key):
    """Delete a key from Redis."""
    get_redis_client().delete(key)

def key_exists(key):
    """Check if a key exists in Redis."""
    return get_redis_client().exists(key) > 0

def store_otp(key, otp, timeout=300):
    """Store an OTP in Redis with a timeout (default: 5 minutes)."""
    get_redis_client().set(key, otp, ex=timeout)

def validate_otp(key, otp):
    """Validate an OTP by checking it against the stored value in Redis."""
    stored_otp = get_redis_client().get(key)
    if stored_otp and stored_otp.decode('utf-8') == otp:
        delete_key(key)  # Delete OTP after successful validation
        return True
    return False

def store_session_token(key, token, timeout=3600):
    """Store a session token in Redis with a timeout (default: 1 hour)."""
    get_redis_client().set(key, token, ex=timeout)

def validate_session_token(key, token):
    """Validate a session token by checking it against the stored value in Redis."""
    stored_token = get_redis_client().get(key)
    return stored_token and stored_token.decode('utf-8') == token