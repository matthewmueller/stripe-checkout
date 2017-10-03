/**
 * Module Dependencies
 */

var Deferred = require('deferral')

/**
 * Async loader on the browser-side
 */

var isBrowser = typeof window !== 'undefined'
var Load = isBrowser ? require('./load') : function() {}

/**
 * Export `Stripe`
 */

module.exports = Stripe

/**
 * Initialize `Stripe`
 */

function Stripe(setup, script) {
  setup = setup || {}
  script = script || 'https://checkout.stripe.com/checkout.js'

  const loading = tryLoading(script, new Deferred(), 5)

  return function stripe(params) {
    if (!isBrowser)
      return loading.reject('stripe-checkout only works in the browser')
    const complete = new Deferred()
    const config = Object.assign(
      {
        token: function(token) {
          complete.resolve(token)
        },
        closed: function() {
          complete.resolve(false)
        }
      },
      setup,
      params
    )

    return loading.then(function() {
      const handler = window.StripeCheckout.configure(config)
      handler.open(config)
      return complete
    })
  }
}

function tryLoading(script, deferred, retry) {
  if (!isBrowser) {
    return deferred
  } else if (retry <= 0) {
    return deferred.reject('timeout expired')
  }

  var loaded = false
  Load(script, function(err) {
    if (err) {
      return tryLoading(script, deferred, retry - 1)
    }
    loaded = true
    return deferred.resolve()
  })

  setTimeout(function() {
    if (loaded) return deferred
    tryLoading(script, deferred, retry - 1)
  }, 10000)

  return deferred
}
