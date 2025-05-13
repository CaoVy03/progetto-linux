Descrizione
Questo progetto è un'applicazione full-stack costituita da un backend e un frontend, containerizzati utilizzando Docker. Il backend espone un'API che restituisce il messaggio hello api e il frontend interroga questa API per visualizzare il messaggio.

L'intero progetto è orchestrato tramite Docker Compose per semplificare la gestione dei container.

Struttura del Progetto
Il progetto è composto dalle seguenti cartelle e file:

bash
Copia
Modifica
/progetto
│
├── /frontend                # Contiene il codice del frontend
│   ├── Dockerfile           # File Docker per il frontend
│   ├── index.html           # Pagina HTML per il frontend
│   └── nginx/
│       └── default.conf     # Configurazione di Nginx
│
├── /backend                 # Contiene il codice del backend
│   ├── Dockerfile           # File Docker per il backend
│   └── server.js            # File principale del backend (Node.js)
│
└── docker-compose.yml       # Configurazione di Docker Compose
Tecnologie Utilizzate
Backend: Node.js (Express)

Frontend: HTML, JavaScript (fetch API)

Orchestrazione: Docker, Docker Compose

Web Server: Nginx (per il proxy del frontend)

Prerequisiti
Assicurati di avere i seguenti strumenti installati nel tuo sistema:

Docker: https://www.docker.com/get-started

Docker Compose: https://docs.docker.com/compose/install/

Installazione
Segui questi passaggi per avviare l'applicazione sul tuo computer:

1. Clona il repository
bash
Copia
Modifica
git clone <URL_DEL_REPOSITORY>
cd progetto
2. Costruisci i container Docker
Esegui il comando seguente per costruire e avviare i container definiti nel file docker-compose.yml:

bash
Copia
Modifica
docker-compose up --build
Questo comando:

Costruisce il container per il backend.

Costruisce il container per il frontend.

Avvia entrambi i container insieme con Docker Compose.

3. Accedi all'applicazione
Una volta che i container sono in esecuzione, puoi accedere all'applicazione nei seguenti URL:

Frontend: http://localhost:8081

Backend API: http://localhost:3000/api (Questa rotta risponde con hello api)

4. Interagisci con l'applicazione
Quando visiti http://localhost:8081 nel browser, il frontend invia una richiesta al backend (tramite Nginx) per ottenere il messaggio hello api e lo visualizza nella pagina.

Struttura del Docker Compose
Il file docker-compose.yml è configurato come segue:

yaml
Copia
Modifica
version: '3.8'

services:
  backend:
    build:
      context: ./backend
    ports:
      - "3000:3000"
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
    ports:
      - "8081:80"
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
backend: Il servizio per il backend, costruito dal Dockerfile nella cartella ./backend. Espone la porta 3000.

frontend: Il servizio per il frontend, costruito dal Dockerfile nella cartella ./frontend. Espone la porta 8081. Dipende dal servizio backend.

app-network: Una rete Docker per permettere la comunicazione tra il frontend e il backend.

Descrizione dei Componenti
Backend (Node.js con Express)
Il backend è un'applicazione Node.js che utilizza Express per servire una semplice API.

Codice di esempio per il backend (file backend/server.js):
javascript
Copia
Modifica
const express = require('express');
const app = express();
const port = 3000;

app.get('/api', (req, res) => {
    res.json({ message: 'hello api' });
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
Frontend (HTML + JavaScript)
Il frontend è una semplice pagina HTML che fa una richiesta fetch all'API del backend per recuperare il messaggio e visualizzarlo.

Codice di esempio per il frontend (file frontend/index.html):
html
Copia
Modifica
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frontend - Backend Interaction</title>
</head>
<body>
    <h1>Welcome to the Frontend</h1>
    <div id="loading">Loading message from backend...</div>
    <div id="message"></div>

    <script>
        fetch('http://backend:3000/api') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('message').innerText = data.message;
            })
            .catch(error => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('message').innerText = 'Failed to fetch message from backend.';
                console.error('There was a problem with the fetch operation:', error);
            });
    </script>
</body>
</html>
Nginx (per il frontend)
Nginx è utilizzato come server web per il frontend e per inoltrare le richieste API dal frontend al backend.

Configurazione di Nginx (file frontend/nginx/default.conf):
nginx
Copia
Modifica
server {
    listen 80;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location /api {
        proxy_pass http://backend:3000;  # Proxy verso il backend
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
Risoluzione dei Problemi
"Cannot GET /": Questo errore potrebbe indicare che il frontend non trova la rotta richiesta. Verifica la configurazione di Nginx e assicurati che il frontend stia facendo correttamente la richiesta fetch alla rotta /api.

Errori di CORS: Se riscontri problemi di CORS, assicurati che il backend permetta richieste da localhost:8081 modificando le intestazioni CORS.

Errore di Connessione al Backend: Se il frontend non riesce a connettersi al backend, verifica che il nome del servizio backend in Docker Compose corrisponda a quello usato nella configurazione di Nginx.
