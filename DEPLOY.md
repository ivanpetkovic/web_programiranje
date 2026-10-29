# Javni preview (bez baze)

Trajna adresa: **Render** (besplatan *Web Service*, `plan: free` u [`render.yaml`](render.yaml)).

## Render (preporučeno)

1. Uloguj se na [Render](https://dashboard.render.com/).
2. **New → Blueprint** → poveži repozitorijum `ivanpetkovic/web_programiranje`.
3. Render pročita `render.yaml` i napravi servis `web-programiranje`.
4. Javna adresa biće oblika `https://web-programiranje.onrender.com` (ili slično, zavisi od imena u dashboard-u).

Ne postavljaj `DATABASE_URL` — aplikacija radi bez baze (in-memory stanje).

Alternativa: [Deploy to Render](https://render.com/deploy?repo=https://github.com/ivanpetkovic/web_programiranje) (Blueprint mora biti na grani koju Render gradi, obično `main`).

### Automatski deploy iz agenta / CI

Ako dodaš [Render API key](https://dashboard.render.com/u/settings#api-keys) u Cursor **Environment secrets** kao `RENDER_API_KEY`, cloud agent može pokrenuti:

```bash
export PATH="$PATH:$HOME/.local/bin"
export RENDER_API_KEY=rnd_…
render workspace set --confirm   # jednom, interaktivno
render services create \
  --name web-programiranje \
  --type web_service \
  --repo https://github.com/ivanpetkovic/web_programiranje \
  --branch main \
  --runtime node \
  --build-command "npm ci" \
  --start-command "npm start" \
  --plan free \
  --confirm -o json
```

## Lokalno

```bash
npm ci && npm start
```

→ http://127.0.0.1:8787
