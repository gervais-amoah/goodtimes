// Create a Stripe client
const stripe = Stripe('pk_test_cucWEL0zZ0Ttl8sDgYcAdeD6');

// Create an instance of Elements
const elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
const style = {
  base: {
    color: '#32325d',
    lineHeight: '18px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4',
    },
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a',
  },
};

// Create an instance of the card Element
const card = elements.create('card', { style: style });

// Add an instance of the card Element into the `card-element` <div>
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function (event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission
const form = document.getElementById('payment-form');
const errorElement = document.getElementById('card-errors');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  // here we lock the form
  form.classList.add('processing');
  stripe.createToken(card).then(function (result) {
    console.log('stripe response', result);
    if (result.error) {
      // here we unlock the form again if thereâ€™s an error
      form.classList.remove('processing');
      // set the error text to the error message
      errorElement.textContent = result.error.message;
    } else {
      // now we take over to handle sending the token to our server
      stripeTokenHandler(result.token);
    }
  });
});

function stripeTokenHandler(token) {
  // here we handle and make our actual payment
  // 1. we are going to make a variable for our token, name and email
  const nameEl = document.querySelector('#name');
  const emailEl = document.querySelector('#email');
  // 2. we are going to grab our form action url from the form
  const backendUrl = form.getAttribute('action');
  // 3. we'â€™'ll send the data off to the url using fetch

  fetch(backendUrl, {
    // we tell fetch to POST to our url vs GET
    method: 'POST',
    // tell it we are sending across json data
    headers: {
      'Content-Type': 'application/json',
    },
    // here we send the data across
    // 4. we also need to make sure the data is ready/secure to be sent over
    body: JSON.stringify({
      order: {
        stripe_token: token.id,
        name: nameEl.value,
        email: emailEl.value,
      },
    }),
  })
    // with fetch we get back a response which we turn into json
    .then(response => response.json())
    // then we get it back as data which we can do stuff with
    .then(data => {
      // here we check if we actually get an order back, and then do something
      // with it if we have one
      if (data.order) {
        const order = data.order;
        // we are going to tell the user their payment was succesful
        form.querySelector('.form-title').textContent = 'Payment successful!';
        form.querySelector('.form-fields').textContent = `
          Thank you ${order.name}, your payment was successful and we have sent an email receipt to ${order.email}
        `;
        form.classList.remove('processing');
      }
    })
    // if there's an error, we can do something as well
    .catch(error => {
      // tell the user there was an error
      errorElement.textContent = `There was an error with payment, please try again or contact us at help@goodtim.es`;
      form.classList.remove('processing');
    });
}
