from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from core.redis_utils import get_redis_client
import time

class RateLimitMiddleware(MiddlewareMixin):
    """Middleware to enforce rate limiting using Redis."""

    def process_request(self, request):
        # Identify the client (e.g., by IP address or user ID)
        client_id = self.get_client_id(request)
        if not client_id:
            return None

        # Define rate limit parameters
        rate_limit = 1000  # Max requests allowed
        time_window = 60  # Time window in seconds

        # Redis key for tracking requests
        redis_key = f"rate_limit:{client_id}"

        try:
            # Increment request count in Redis
            current_time = int(time.time())
            pipeline = get_redis_client().pipeline()
            pipeline.zadd(redis_key, {current_time: current_time})
            pipeline.zremrangebyscore(redis_key, 0, current_time - time_window)
            pipeline.zcard(redis_key)
            pipeline.expire(redis_key, time_window)
            _, _, request_count, _ = pipeline.execute()

            # Check if rate limit is exceeded
            if request_count > rate_limit:
                return JsonResponse({"error": "Rate limit exceeded. Try again later."}, status=429)
        except Exception as e:
            # If Redis is unavailable, allow the request to proceed
            # but log the error (handled in redis_utils.py)
            pass

    def get_client_id(self, request):
        """Get a unique identifier for the client (e.g., IP address or user ID)."""
        return request.META.get("REMOTE_ADDR")