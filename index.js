/**
 * Module Dependencies
 */

var Load = require('little-loader')
var Deferred = require('deferral')

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
  Load(script, (err) => err ? loading.reject(err) : loading.resolve())

  return function stripe (params) {
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
