Replace from
export default {
 authLogin ({ commit }, keycloakAuth) {
   commit('SECURITY_AUTH', keycloakAuth)
 },
 authLogout ({ commit }) {
   commit(types.SECURITY_AUTH)
 }
}

Replace to
export default {
 authLogin: ({ commit }, { userManager, currentUser }) => {
   commit('SECURITY_AUTH', { userManager, currentUser })
 },
 authLogout: ({ commit }) => {
   commit(types.SECURITY_AUTH, { userManager: null, currentUser: null })
 }
}
