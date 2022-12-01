export const keycloak = {
  client_id: "getitdone",
  client_secret: "QO9CgiJF5WsUezKvzgVRoWRhdDFpMJLU", // TODO
  redirect_uris: ["http://localhost:8080/api/login-callback"],
  post_logout_redirect_uris: [""],
  response_types: ["code"],
}