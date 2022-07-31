//Replace from
import Keycloak from 'keycloak-js'
let keycloakAuth = new Keycloak('/statics/keycloak.json')
//Replace to
import { UserManager } from 'oidc-client'
const mgr = new UserManager({
 authority: `https://${process.env.ONELOGIN_SUBDOMAIN}.onelogin.com/oidc/2`,
 client_id: process.env.ONELOGIN_CLIENT_ID,
 response_type: 'code',
 scope: 'openid profile',
 automaticSilentRenew: true,
 redirect_uri: window.location.origin,
 silent_redirect_uri: window.location.origin,
 post_logout_redirect_uri: window.location.origin
})

//Replace from
Router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
      const auth = store.state.security.auth
      if (!auth.authenticated) {
        // console.log('Local authentication' + auth.authenticated)
        keycloakAuth.init({ onLoad: 'login-required' }).success(function (authenticated) {
          // console.log('SSO authentication ' + authenticated)
          if (!authenticated) {
            window.location.reload()
          }
          store.dispatch('authLogin', keycloakAuth)
          next()
          setInterval(function () {
            keycloakAuth.updateToken(70)
              .success((refreshed) => {
                if (refreshed) {
                  store.dispatch('authLogin', keycloakAuth)
                } else {
                  console.log('Token not refreshed, valid for ' + Math.round(keycloakAuth.tokenParsed.exp + keycloakAuth.timeSkew - new Date().getTime() / 1000) + ' seconds')
                }
            })
          }, 60000)
        }).error(function () {
          window.location.reload()
        })
      } else {
        next()
      }
    } else {
      next()
    }
  })

  return Router
}

//Replace to
const setSession = (user, next) => {
    store.dispatch('authLogin', { userManager: mgr, currentUser: user })
    next()
  }

  Router.beforeEach(async function (to, from, next) {
    if (to.meta.requiresAuth) {
      const { currentUser } = store.state.security.auth
      if (!currentUser.access_token) {
        if (window.location.href.indexOf('?') >= 0) {
          mgr
            .signinRedirectCallback()
            .then(async user => {
              setSession(user, next)
            })
            .catch(err => {
              console.log('Error completing auth code + pkce flow', err)
            })
        } else {
          try {
            const user = await mgr.getUser()
            if (user) {
              setSession(user, next)
            } else {
              mgr.signinRedirect()
            }
          } catch (errorData) {
            console.error(
              'Error getUser oidc-client :',
              JSON.stringify(errorData)
            )
          }
        }
      } else {
        next()
      }
    } else {
      next()
    }
  })
  return Router
}

