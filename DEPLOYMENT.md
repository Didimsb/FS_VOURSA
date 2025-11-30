# Guide de Déploiement - FS_VOURSA

Ce guide explique comment configurer le déploiement du frontend sur Vercel et du backend sur Render, et comment les lier ensemble.

## Configuration Backend (Render)

### Variables d'environnement requises sur Render

Dans le dashboard Render, configurez les variables d'environnement suivantes :

- `MONGODB_URI` : URI de connexion à votre base de données MongoDB
- `PORT` : Port sur lequel le serveur écoute (généralement défini automatiquement par Render)
- `JWT_SECRET` : Secret pour la génération des tokens JWT

### URL du Backend

Le backend est déployé sur : `https://fs-voursa.onrender.com`

L'API est accessible via : `https://fs-voursa.onrender.com/api`

## Configuration Frontend (Vercel)

### Variables d'environnement requises sur Vercel

Dans le dashboard Vercel, allez dans **Settings > Environment Variables** et ajoutez :

- `REACT_APP_API_URL` : `https://fs-voursa.onrender.com/api`

### Comment configurer sur Vercel

1. Connectez-vous à votre dashboard Vercel
2. Sélectionnez votre projet `fs-voursa`
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez la variable :
   - **Name** : `REACT_APP_API_URL`
   - **Value** : `https://fs-voursa.onrender.com/api`
   - **Environment** : Sélectionnez Production, Preview, et Development
5. Cliquez sur **Save**
6. Redéployez votre application pour que les changements prennent effet

### URL du Frontend

Le frontend est déployé sur : `https://fs-voursa.vercel.app`

## Configuration CORS

Le backend est configuré pour accepter les requêtes depuis :
- `http://localhost:3000` (développement local)
- `https://fs-voursa.vercel.app` (production)
- Tous les sous-domaines Vercel de `fs-voursa` (preview deployments)
- `https://agencevoursa.com` (domaine personnalisé)

## Vérification de la connexion

Pour vérifier que le frontend et le backend sont correctement liés :

1. Ouvrez la console du navigateur (F12)
2. Allez sur votre site Vercel
3. Vérifiez qu'il n'y a pas d'erreurs CORS dans la console
4. Testez une fonctionnalité qui nécessite une connexion au backend (ex: connexion, affichage de propriétés)

## Dépannage

### Erreurs CORS

Si vous rencontrez des erreurs CORS :
- Vérifiez que l'URL du frontend est bien dans la liste des origines autorisées dans `server/server.js`
- Vérifiez que la variable `REACT_APP_API_URL` est correctement configurée sur Vercel
- Redéployez le backend après avoir modifié la configuration CORS

### Erreurs de connexion API

Si le frontend ne peut pas se connecter au backend :
- Vérifiez que le backend est bien en ligne sur Render
- Vérifiez l'URL de l'API dans `voursa/src/utils/axiosInstance.js`
- Vérifiez que la variable d'environnement `REACT_APP_API_URL` est définie sur Vercel

## Développement local

Pour le développement local, créez un fichier `.env` dans le dossier `voursa/` avec :

```
REACT_APP_API_URL=http://localhost:5000/api
```

Assurez-vous que le backend local tourne sur le port 5000.

