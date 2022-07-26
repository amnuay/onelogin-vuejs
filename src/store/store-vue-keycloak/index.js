//Replace from
const state = {
 auth: {
   authenticated: false
 }
}

//Replace to
const state = {
 auth: {
   currentUser: {
     access_token: null
   },
   userManager: null
 }
}
