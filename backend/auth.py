import httpx
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt

from config import settings

security = HTTPBearer()

# Cache for JWKS to avoid over-fetching from Clerk
_jwks_cache = None

async def _get_jwks():
    """Fetches and caches Clerk's JSON Web Key Set (Public Keys)."""
    global _jwks_cache
    if _jwks_cache:
        return _jwks_cache
    
    if not settings.CLERK_ISSUER:
        return None

    jwks_url = f"{settings.CLERK_ISSUER}/.well-known/jwks.json"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(jwks_url, timeout=30.0)
            if response.status_code == 200:
                _jwks_cache = response.json()
                return _jwks_cache
        except Exception as e:
            print(f"Auth Critical: Could not reach Clerk at {jwks_url}: {e}")
    return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Dependency: Decodes and validates the Clerk JWT from the Authorization header.
    Returns the user data dict (payload).
    """
    token = credentials.credentials
    
    try:
        jwks = await _get_jwks()
        
        if jwks:
            # 1. Match the Key ID (kid) to know which public key to use
            unverified_header = jwt.get_unverified_header(token)
            token_kid = unverified_header.get("kid")

            rsa_key = next((key for key in jwks["keys"] if key["kid"] == token_kid), None)
            
            if not rsa_key:
                raise HTTPException(status_code=401, detail="Invalid token signature key (KID mismatch)")

            # 2. Decode & Verify signature and expiration
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                audience=None, # Clerk usually doesn't strictly enforce aud in simple templates
                issuer=settings.CLERK_ISSUER
            )
        else:
            # DEVELOPMENT FALLBACK: If CLERK_ISSUER is missing, don't block local dev
            if settings.ENVIRONMENT == "development":
                print("WARNING: Auth verification skipped (Dev Mode)")
                payload = jwt.get_unverified_claims(token)
            else:
                raise HTTPException(status_code=500, detail="Auth service misconfigured (Missing Issuer)")

        return payload
            
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
    except jwt.JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid authentication token: {str(e)}")
    except Exception as e:
        print(f"Auth Middleware Error: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")

def is_organizer(user_payload: dict) -> bool:
    """
    Checks if the user has the 'organizer' role in Clerk metadata.
    """
    metadata = user_payload.get("unsafe_metadata", {})
    
    if not metadata and settings.DEBUG:
        print(f"DEBUG: 'unsafe_metadata' missing for {user_payload.get('sub')}. Ensure Clerk template includes metadata.")
        
    return metadata.get("role") == "organizer"

async def get_current_organizer(current_user: dict = Depends(get_current_user)):
    """
    Dependency: Ensures the authenticated user is an Organizer.
    """
    if not is_organizer(current_user):
        raise HTTPException(status_code=403, detail="Forbidden: Organizer access required")
    return current_user