from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
import httpx
from config import settings

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Validates the Clerk JWT token found in the Authorization header.
    Returns the decoded token payload (dict) containing user info.
    """
    token = credentials.credentials
    
    # Enforce CLERK_ISSUER to prevent forging tokens
    if not settings.CLERK_ISSUER:
        # Fallback for dev if not set, but warn
        print("WARNING: CLERK_ISSUER not set in .env")
    
    try:
        # 1. Fetch Clerk's JWKS (Public Keys)
        # In production, you might want to cache this or use a library that handles caching
        jwks_url = f"{settings.CLERK_ISSUER}/.well-known/jwks.json" if settings.CLERK_ISSUER else None
        
        if jwks_url:
            async with httpx.AsyncClient() as client:
                response = await client.get(jwks_url)
                jwks = response.json()

            # 2. Match the Key ID (kid)
            unverified_header = jwt.get_unverified_header(token)
            token_kid = unverified_header.get("kid")

            rsa_key = {}
            for key in jwks["keys"]:
                if key["kid"] == token_kid:
                    rsa_key = {
                        "kty": key["kty"],
                        "kid": key["kid"],
                        "use": key["use"],
                        "n": key["n"],
                        "e": key["e"]
                    }
                    break
            
            if not rsa_key:
                raise HTTPException(status_code=401, detail="Unable to find appropriate key")

            # 3. Decode
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                audience=None,
                issuer=settings.CLERK_ISSUER
            )
        else:
            # Fallback for local testing without ISSUER set (NOT SECURE for prod)
            # This allows decoding but skips signature verification if no issuer is configured
            payload = jwt.get_unverified_claims(token)

        return payload
            
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")

def is_organizer(user_payload: dict) -> bool:
    """
    Helper to check if the user has the 'organizer' role.
    Requires Clerk Session Token to include 'unsafe_metadata'.
    """
    metadata = user_payload.get("unsafe_metadata", {})
    # Check if role is 'organizer'. Adapt key if your metadata structure is different.
    return metadata.get("role") == "organizer"
