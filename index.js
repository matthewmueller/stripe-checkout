/**
 * Module Dependencies
 */

var Deferred = require('deferral')

/**
 * Async loader on the browser-side
 */

var Load = typeof window !== 'undefined'
  ? require('./load')
  : function () {}

/**
 * Export `Stripe`
 */

module.exports = Stripe

/**
 * Initialize `Stripe`
 */

function Stripe (setup, script) {
  setup = setup || {}
  script = script || 'https://checkout.stripe.com/checkout.js'

  const loading = new Deferred()
  Load && Load(script, function (err) {
    return err ? loading.reject(err) : loading.resolve()
  })

  return function stripe (params) {
    if (!Load) return Promise.reject('This module is only supported on the browser-side')
    const complete = new Deferred()
    const config = Object.assign({
      token: function (token) {
        complete.resolve(token)
      },
      closed: function () {
        complete.resolve(false)
      }
    }, setup, params)

    return loading
      .then(function () {
        const handler = window.StripeCheckout.configure(config)
        handler.open(config)
        return complete
      })
  }
}
