/**
 * Module Dependencies
 */

var Deferred = require('deferral')

/**
 * Loader
 */

var Load = typeof document !== 'undefined' && require('little-loader')

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
  Load && Load(script, (err) => err ? loading.reject(err) : loading.resolve())

  return function stripe (params) {
    if (!Load) return Promise.reject('This module is only supported on the browser-side')
    const complete = new Deferred()
    const config = Object.assign({
      token: function (token) { complete.resolve(token) }
    }, setup, params)

    return loading
      .then(function () {
        const handler = window.StripeCheckout.configure(config)
        handler.open(config)
        return complete
      })
  }
}
