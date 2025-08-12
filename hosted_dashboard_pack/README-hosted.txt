HÉBERGEMENT — DASHBOARD PROTÉGÉ (BOUTON "ACTUALISER" IMMÉDIAT)
=============================================================
Fonctionne sur Render/Railway/serveur perso.

1) Variables d'env (optionnel) :
   - DASHBOARD_PASSWORD = 000000  (défaut déjà configuré)
   - PORT = 8080 (Render choisit le sien, pas grave)

2) Installation locale (si tu veux tester) :
   npm run all
   Ouvre http://localhost:8080 (le navigateur demandera un mot de passe : 000000)
   Le bouton "Actualiser maintenant" lance une nouvelle capture (attends ~10s).

3) Déploiement Render (rapide) :
   - Crée un service "Web Service" depuis ce dossier (Git).
   - Build Command: npm i
   - Start Command: node server.js
   - Env: DASHBOARD_PASSWORD=000000
   - Après le premier démarrage, va à /api/refresh une fois pour déclencher la première série, 
     ou laisse l'auto-refresh (chaque heure).

Remarques :
- urls.json contient toutes les pages à capturer (tu peux en ajouter).
- Les images sont dans public/images/*.png
- Le serveur applique une authentification HTTP Basic (n'importe quel username, mot de passe = 000000).
