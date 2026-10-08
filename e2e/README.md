# Suite généralisée (Playwright)

Ces tests tournent dans un vrai navigateur, contre un vrai backend. Avant de
les lancer :

```sh
cd ../backend
cp .env.example .env   # une fois
php artisan key:generate
php artisan migrate:fresh --seed   # base propre à chaque exécution
php artisan serve                  # http://localhost:8000
```

Puis, dans `web/` :

```sh
npm run test:e2e
```

Playwright démarre lui-même le serveur Next.js (`npm run dev`) s'il n'est pas
déjà lancé.

Chaque test crée ses propres données (adresses e-mail aléatoires) : la base
n'a pas besoin d'être réinitialisée entre deux tests du même run, seulement
avant le premier.
