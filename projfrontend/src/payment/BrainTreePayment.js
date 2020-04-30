import React, {useState, useEffect} from 'react'
import { loadCart, emptyTheCart } from '../core/helper/CartHelper';
import { Link } from 'react-router-dom';
import { getToken, processPayment } from '../core/helper/paymentBhelper';
import { createOrder } from '../core/helper/OrderHelper';
import { isAuthenticated } from '../auth/helper';
import DropIn from "braintree-web-drop-in-react";

const BrainTreePayment = ({products, setReload = f => f, reload = undefined}) => {
    const [info, setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {}
    });

    const userId =isAuthenticated() && isAuthenticated().user._id;
    const token =isAuthenticated() && isAuthenticated().token;

    const getmeToken = (userId, token) => {
        
        getToken(userId, token).then(info => {
            console.log("INFORMATION:",info);
            if(info.error){
                setInfo({...info, error: info.error})
            }else{
                const clientToken  = info.clientToken;
                setInfo({clientToken})
            }
        })
    }

    const showBtdropIn = () => {
        return(
            <div>
                {info.clientToken !== null && products.length > 0 && isAuthenticated() ?(
                    <div>
                        <DropIn
                            options={{ authorization: info.clientToken }}
                            onInstance={(instance) => (info.instance = instance)}
                            />
                            <button className="btn btn-success btn-block" onClick={onPurchase}>Buy</button>
                                    </div>
                ): (<h3>Please login or add to cart</h3>)}
            </div>
        )
    }

    useEffect(() => {
        getmeToken(userId, token)
    }, [])

    const onPurchase = () => {
        setInfo({loading: true})
        let nonce;
        let getNonce = info.instance.requestPaymentMethod()
        .then(data => {
            nonce = data.nonce
            const paymentData = {
                paymentMethodNonce: nonce,
                amount: getAmount()
            };
            processPayment(userId, token, paymentData)
            .then(resp => {
                setInfo({...info, success: resp.success, loading: false})
                console.log("PAYMENT SUCCESS");
                const orderData = {
                    products: products,
                    transaction_id: resp.transaction.id,
                    amount: resp.transaction.amount
                }
                createOrder(userId, token, orderData);
                emptyTheCart(() => {
                    console.log("DId it crash");
                    setReload(!reload)
                })
            })
            .catch(error => {
                setInfo({loading:false,success: false})
                console.log("PAYMENT FAILED");
            })    
            
        })
        }

    const getAmount = () => {
        let amount = 0;
        products.map(p => {
            amount = amount+ p.price
        })
        return amount;
    }

    return (
        <div>
            <h3> Your Bill is {getAmount()}</h3>
            {showBtdropIn()}
        </div>
    )
};

export default BrainTreePayment;