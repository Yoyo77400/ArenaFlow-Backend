# ArenaFlow – Backend (Off-chain)

## Présentation générale

Ce backend constitue la **brique off-chain** de la plateforme ArenaFlow.  
Il est responsable de l’orchestration des services métiers (authentification, événements, tickets, validation), tout en s’intégrant à une **infrastructure blockchain** utilisée comme source de vérité pour la propriété et la validation des billets NFT.

L’objectif est de séparer clairement :
- les **responsabilités off-chain** (UX, sécurité, performance, analytics),
- et les **responsabilités on-chain** (propriété des billets, validation finale, anti-replay).

---

## Stack technique

- **Node.js / TypeScript**
- **Express**
- **MongoDB (Mongoose)**
- **JWT Web3 (Dynamic.xyz)**
- **Architecture services / controllers / middlewares**

---

## Authentification & Sécurité

### Authentification Web3 (Dynamic)
Le backend utilise les **JWT émis par Dynamic** pour authentifier les utilisateurs.

- Vérification cryptographique via **JWKS** (RS256)
- Validation du token côté backend (signature, expiration)
- L’identité utilisateur est dérivée exclusivement du **JWT (`sub`)**
- Aucun identifiant utilisateur n’est accepté depuis les headers client

Cela garantit une authentification robuste et infalsifiable.

### Middlewares
- `requireAuth` : vérifie le JWT Dynamic et hydrate `req.user`
- `requireAdmin` / `requireRole` : contrôle d’accès basé sur les rôles
- *(prévu)* `rateLimitRelayer` : protection contre abus du relayer (DoS financier)

---

## Modèle Ticket & NFT

### Principe
- Chaque billet est représenté par un **NFT** (ERC-721 / ERC-1155)
- La **propriété du billet** est on-chain
- Le backend gère les **métadonnées**, la validation et l’orchestration

### Métadonnées NFT
Les métadonnées du ticket incluent notamment :
- catégorie (VIP, Regular, etc.)
- informations événement
- plan de salle / placement
- identifiants nécessaires au scan (chainId, contract, tokenId)

Aucune donnée sensible n’est stockée en clair dans la metadata.

---

## QR Code & Validation

Le QR code contenu dans le billet NFT ne contient **pas de secret**, mais uniquement :
- `chainId`
- `contractAddress`
- `tokenId`

Lors du scan :
1. Le backend vérifie que le validateur est autorisé
2. Une **validation on-chain** est déclenchée via **meta-transaction (forwarder)**
3. Le contrat marque le billet comme `USED` (anti-replay définitif)

La blockchain devient la **source de vérité de l’état du billet**.

---

## Meta-transactions & Relayer

Le backend agit comme **relayer** :
- Il soumet les transactions de validation via un **forwarder**
- Les frais de gas sont payés par la plateforme (UX simplifiée pour le staff)
- Le validateur réel est conservé via `_msgSender()` (EIP-2771)

Cette approche permet :
- une UX fluide pour le contrôle d’accès
- une sécurité forte (anti double-scan)
- une architecture scalable

---

## Rôle du Backend (Off-chain)

Le backend est un **orchestrateur**, responsable de :

- Paiements fiat (Stripe / autre – prévu)
- KYC (liaison utilisateur ↔ statut KYC – prévu)
- Relayers (meta-transactions)
- Lecture on-chain (RPC, indexer custom ou TheGraph)
- Stockage off-chain pour :
  - métadonnées événements
  - logs de scans & analytics
  - profils utilisateurs (emails, préférences, liens KYC)

---

## Architecture du projet

```graphql
src/
├── controllers/      # Gestion des routes HTTP
├── services/         # Logique métier (tickets, events, users)
├── middleware/       # Auth, rôles, sécurité
├── utils/            # Sécurité, JWT, helpers
├── models/           # Schemas MongoDB
├── routes/           # Définition des endpoints
└── index.ts          # Point d’entrée serveur
```

``` yaml
Cette organisation permet :
- une séparation claire des responsabilités
- une évolution facile vers un environnement production
```
---

## État actuel & limites

- Les contrats blockchain sont encore en cours de finalisation + déploiement, rendant peu probable l'intégration dans le temps imparti.
- Le backend est conçu pour fonctionner avec ou sans activation on-chain
- Certaines intégrations (paiement, KYC) sont prévues mais non branchées

L’architecture est "prête production", même si toutes les briques ne sont pas actives pour le rendu.

---

## Conclusion

Ce backend met en place une architecture **sécurisée, scalable et Web3-native**, combinant :
- sécurité JWT moderne,
- orchestration off-chain robuste,
- validation on-chain anti-fraude.

Il constitue une base solide pour une plateforme de billetterie décentralisée orientée événements sportifs et culturels.
