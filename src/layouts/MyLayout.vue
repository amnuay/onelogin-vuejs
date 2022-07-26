//Replace from
     var keycloakAuth = this.$store.getters.SECURITY_AUTH
     keycloakAuth.logout()
//Replace to
           const { userManager } = this.$store.getters.SECURITY_AUTH
           userManager.signoutRedirect()
