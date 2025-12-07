import jwt, { JwtPayload } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

export class SecurityUtils {
   private static instance?: SecurityUtils;
   private client: JwksClient;

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
      
      const jwksUrl = `https://app.dynamic.xyz/api/v0/sdk/${dynamicEnvId}/.well-known/jwks`;
      
      // The client should be initialized as per Dynamic Labs documentation
      this.client = new JwksClient({
        jwksUri: jwksUrl,
        rateLimit: true,
        cache: true,
        cacheMaxEntries: 5,  // Maximum number of cached keys
        cacheMaxAge: 600000 // Cache duration in milliseconds (10 minutes)
      });
   }

   /**
    * Vérifie la signature d'un token JWT Dynamic Labs
    * @param token Le token JWT complet (avec "Bearer " prefix)
    * @returns true si la signature est valide, false sinon
    */
   static async verifyDynamicToken(token: string): Promise<{userId: string, isValid: boolean}> {
     try {
       // Extraire le JWT du header Authorization (enlever "Bearer ")
       const encodedJwt = token.substring(7);
       
       const instance = this.getInstance();
       
       const signingKey = await instance.client.getSigningKey();
       const publicKey = signingKey.getPublicKey();
       console.log("Using public key for verification");

       // Vérifier le JWT avec la clé publique Dynamic Labs
       const decodedToken: JwtPayload = jwt.verify(encodedJwt, publicKey, {
         ignoreExpiration: false,
       }) as JwtPayload;

       console.log("Token verified successfully for user:", decodedToken);

       return { userId: decodedToken.sub!, isValid: true };
     } catch (error) {
       console.error('JWT verification failed:', error);
       return { userId: '', isValid: false };
     }
   }
}