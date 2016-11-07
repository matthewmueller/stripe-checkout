const Stripe = require('./')
console.log(Stripe)

const stripe = Stripe({
  key: process.env.STRIPE_CLIENT_ID
})

stripe({
  locale: 'auto',
  name: 'Authory',
  description: 'A Journalist\'s Digital Repository',
  amount: 10 * 100,
  email: 'test@test.com',
  allowRememberMe: false,
  image: 'https://avatars2.githubusercontent.com/u/170270?v=3&s=466'
})
.then(function (token) {
  console.log(token)
})
