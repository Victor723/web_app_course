# GetItDone

## Developing
### Getting it running
0. Make sure `keycloak18` image is ready in your Docker. Delete all containers and volumes if needed (can use `docker ps -qa | xargs docker rm && docker volume prune -f`).
1. Run `npm i` in both `server/` and `ui/`.
2. Run `docker compose up` in the base directory.
3. Go back to `server/`, run `npm run setup` to setup MongoDB database.
4. Run `npm start` in both `server/` and `ui/`.
5. Keycloak stuff.
   1. Visit `localhost:8081`, login using `admin` and `admin`.
   2. Create new realm called `getitdone`.
   3. In the realm settings, go to login and turn on "user registration". Click save.
   4. Create a new client called `getitdone`.
   5. In the client settings, change "access type" to "confidential", then "Valid redirect URIs" to `http://localhost:8080/api/login-callback`. Click save.
   6. Go to credentials tab, copy the secret and paste into `server/secrets.ts`.
6. Done! Now visit `localhost:8080` and login/register as needed.
### API reference

| Route | Require auth | Description |
| --- | --- | --- |
| `GET /api/hello` | No | For testing, returns a message that says current username. |
| `GET /api/tasks` | No | For testing, returns every task |
| `GET /api/lists` | No | For testing, returns every list |
| `GET /api/login` | N/A | Use KeyCloak for login/register |
| `GET /api/login-callback | N/A | Callback function invoked by KeyCloak |
| `POST /api/logout` | N/A | Logout current session |
| `GET /api/user_lists` | Yes | Return every list that belongs to the currently logged in user |

## Description


## Badges


## Visuals


## Installation


## Usage


## Support


## Roadmap


## Contributing

## Authors and acknowledgment


## License


## Project status

