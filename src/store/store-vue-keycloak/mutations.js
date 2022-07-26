//Replace from
export default {
 [types.SECURITY_AUTH](state, keycloakAuth) {
   state.auth = keycloakAuth
   if (keycloakAuth) {
     axios.defaults.headers.common = {
       Authorization: 'Bearer ' + keycloakAuth.token
     }
   }
 }
}
//Replace to
export default {
 [types.SECURITY_AUTH](state, { currentUser, userManager }) {
   state.auth = { currentUser, userManager }
   if (currentUser) {
     axios.defaults.headers.common = {
       Authorization: 'Bearer ' + currentUser.access_token
     }
   }
 }
}
