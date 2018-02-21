# stripe-checkout

Open up [Stripe Checkout]() without any hassle.

## Install

```
npm install stripe-checkout
```

## Usage

```js
const Stripe = require('stripe-checkout')

// configure and start lazy-loading the stripe script
//
// I'll usually just stick this on the top of the page
// so stripe is all loaded by the time we want to open
// up checkout.
const stripe = Stripe({
  // don't put your secret here!
  key: process.env.STRIPE_CLIENT_ID
})

// later in your application, when the user
// clicks on a button or something, call
// this to open up stripe checkout.
stripe({
  locale: 'auto',
  name: 'Your Website',
  description: 'Small website blurb',
  amount: 10 * 100,
  email: 'test@test.com',
  allowRememberMe: false,
  image: 'https://avatars2.githubusercontent.com/u/170270?v=3&s=466'
}).then(function(token) {
  if (!token) {
    console.log('user closed stripe checkout without filling in credentials')
    return
  }
  console.log('send this token to the server', token)
})
```

## License

MIT
