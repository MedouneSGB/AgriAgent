from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from config import settings
import logging

logger = logging.getLogger(__name__)
security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> str:
    """Verify Supabase JWT and return user_id (UUID string)."""
    if not credentials:
        logger.warning("No credentials provided")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required - Please login first",
        )
    
    logger.info(f"Token received (first 50 chars): {credentials.credentials[:50]}...")
    logger.info(f"JWT Secret length: {len(settings.SUPABASE_JWT_SECRET)}")
    
    try:
        # Supabase tokens use HS256
        # In production, signature is verified; in dev, can be skipped if JWT_SECRET missing
        skip_sig = settings.APP_ENV == "development" and not settings.SUPABASE_JWT_SECRET
        payload = jwt.decode(
            credentials.credentials,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False, "verify_signature": not skip_sig},
        )
        user_id: str = payload.get("sub")
        logger.info(f"Token decoded successfully. User ID: {user_id}")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token - No user ID found")
        return user_id
    except JWTError as e:
        logger.error(f"JWT Error: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {str(e)}")


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> str | None:
    """Same as get_current_user but returns None instead of raising."""
    if not credentials:
        return None
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        return payload.get("sub")
    except JWTError:
        return None
