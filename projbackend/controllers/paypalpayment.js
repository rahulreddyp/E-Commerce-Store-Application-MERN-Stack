
var braintree = require("braintree");


var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "4dgxt2rvh7dg62c9",
  publicKey: "dw5x5kj3nn8sprxg",
  privateKey: "2f562474b10fe2d45b8a9fcce585ffe9"
});

exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, function (err, response) {
        if(err){
            res.status(500).send(err)
        }else{
            res.send(response)
        }
    });

};

exports.processPayment = (req, res) => {
let nonceFromTheClient = req.body.paymentMethodNonce;
let amountFromTheClient = req.body.amount;

    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        // deviceData: deviceDataFromTheClient,
        options: {
        submitForSettlement: true
        }
    }, function (err, result) {   
        if(err){
            res.status(500).json(err)
        }else{
            res.json(result);
        }
      });
}