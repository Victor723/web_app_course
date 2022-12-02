export const keycloak = {
  client_id: "getitdone",
  client_secret: "CzdfOICmx4QxUyY0e8lVd7nNjF0cxqp9", // TODO
  redirect_uris: ["http://localhost:8080/api/login-callback"],
  post_logout_redirect_uris: [""],
  response_types: ["code"],
}