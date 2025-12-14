import jwt, { JwtPayload } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

export class SecurityUtils {
   private static instance?: SecurityUtils;
   private client: JwksClient;
   private envId: string;

   static getInstance(): SecurityUtils {
    if (!SecurityUtils.instance) {
      SecurityUtils.instance = new SecurityUtils();
    }
    return SecurityUtils.instance;
   }

   constructor() {
      // Construire l'URL JWKS dynamiquement pour s'assurer que les variables d'env sont chargées
      const dynamicEnvId = process.env.DYNAMIC_ENVIRONMENT_ID;
      if (!dynamicEnvId) {
        throw new Error('DYNAMIC_ENVIRONMENT_ID environment variable is not set');
      }
      this.envId = dynamicEnvId;
      
      const jwksUrl = `https://app.dynamicauth.com/api/v0/sdk/${dynamicEnvId}/.well-known/jwks`;      

      // The client should be initialized as per Dynamic Labs documentation
      this.client = new JwksClient({
        jwksUri: jwksUrl,
        rateLimit: true,
        cache: true,
        cacheMaxEntries: 5,  // Maximum number of cached keys
        cacheMaxAge: 600000 // Cache duration in milliseconds (10 minutes)
      });
   }

   private static extractJwt(authHeaderOrToken: string): string {
    if (!authHeaderOrToken) return "";
    const s = authHeaderOrToken.trim();
    if (s.toLowerCase().startsWith("bearer ")) return s.slice(7).trim();
    return s;
  }

   /**
    * Vérifie la signature d'un token JWT Dynamic Labs
    * @param token Le token JWT complet (avec "Bearer " prefix)
    * @returns true si la signature est valide, false sinon
    */
   static async verifyDynamicToken(token: string): Promise<{userId: string, isValid: boolean}> {
     try {
       // Extraire le JWT du header Authorization
       const encodedJwt = this.extractJwt(token);
      if (!encodedJwt) return { userId: "", isValid: false };

      // lire kid dans le header JWT
      const decoded = jwt.decode(encodedJwt, { complete: true }) as
        | { header?: { kid?: string; alg?: string }; payload?: any }
        | null;

      const kid = decoded?.header?.kid;
      if (!kid) {
        console.error("JWT missing kid");
        return { userId: "", isValid: false };
      }

      const instance = this.getInstance();

       const signingKey = await instance.client.getSigningKey(kid);
       const publicKey = signingKey.getPublicKey();
       console.log("Using public key for verification:", publicKey);

       // Vérifier le JWT avec la clé publique Dynamic Labs
       const decodedToken = jwt.verify(encodedJwt, publicKey, {
        algorithms: ["RS256"],
        ignoreExpiration: false,
      }) as JwtPayload;

      if (!decodedToken) {
        console.error("JWT verification returned null");
        return { userId: "", isValid: false };
      }
       console.log("Token verified successfully for user:", decodedToken);

       return { userId: decodedToken.sub!, isValid: true };
     } catch (error) {
       console.error('JWT verification failed:', error);
       return { userId: '', isValid: false };
     }
   }
}