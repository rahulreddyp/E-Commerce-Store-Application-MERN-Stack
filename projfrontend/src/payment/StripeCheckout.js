import React, {useState, useEffect} from 'react';
import { isAuthenticated } from '../auth/helper';
import { emptyTheCart, loadCart } from '../core/helper/CartHelper';
import { Link } from 'react-router-dom';
import StripeCheckoutButton from 'react-stripe-checkout'
import { API } from '../backend';
import { createOrder } from '../core/helper/OrderHelper';

const StripeCheckout = ({products, setReload = f => f, reload = undefined}) => {
    const [data, setData] = useState({
        loading: false,
        success: false,
        error: "",
        address: ""
    });

    const token = isAuthenticated() && isAuthenticated().token;
    const userId = isAuthenticated() && isAuthenticated().user._id;

    const getFinalPrice = () => { 
        let amount = 0;
        products.map(p => {
            amount = amount + p.price
        });
        return amount;
    };

    const makePayment = token => {
        const body = {
            token,
            products,
        }
        const headers = {
            "Content-Type": "application/json"
        }

        return fetch(`${API}/stripepayment`, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        }).then(response => {
            console.log(response);
            // call further methods
            const {status} = response;
            console.log("STATUS", status);

            emptyTheCart(()=> {
                console.log("Emtpy the cart after payment");
                setReload(!reload);
            });            
        }).catch(err => console.log(err))
    };

    const showStripeButton = () => {
        return isAuthenticated()? (
            <StripeCheckoutButton
            stripeKey="pk_test_5QIBLyAnZ5ZfJTfBdZ60g7GK00b5kwpFha"
            token={makePayment}
            amount={getFinalPrice() * 100}
            name="Buy T-Shirts"
            shippingAddress
            billingAddress>
                <button className="btn btn-success">Pay with Stripe</button>
            </StripeCheckoutButton>
        ): (<Link to="/signin">
            <button className="btn btn-warning">signin</button> 
            </Link>)
    };

    return (
        <div>
            <h3 className="text-white">Stripe Checkout {getFinalPrice()}</h3>
            {showStripeButton()}
        </div> 
    )
}


export default StripeCheckout;