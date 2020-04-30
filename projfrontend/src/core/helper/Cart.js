import React, {useState, useEffect} from 'react'
import Base from "../Base";
import Card from '../Card'
import { loadCart } from './CartHelper';
import StripeCheckout from '../../payment/StripeCheckout';
import BrainTreePayment from '../../payment/BrainTreePayment';

const Cart = () => {

    const [products, setProducts] = useState([])
    const [reload, setReload] = useState(false)

    useEffect(() => {
        setProducts(loadCart())
    }, [reload]);

    const loadAllProducts = (products) => {
        return(
            <div>
                <h2>This section is to load all products</h2>
                {products.map((product, index) => (
                    <Card key={index} product={product}
                    removeFromCart={true}
                    addtoCart={false}
                    setReload={setReload}
                    reload={reload}/>
                ))}
            </div>
        )
    }

    const loadCheckout = () =>{
        return(
            <div>
                <h2>This section is for Checkout</h2>
            </div>
        )
    }
    
    return (
        <Base title="Cart Page" description="Ready to checkout">
            <div className="row text-center">
                <div className="col-6">
                    {products.length > 0 ? loadAllProducts(products): (
                        <h3>No products in Cart</h3>
                    )}
                </div>
                <div className="col-6">
                    {/* Stripe Payment */}
                    {/* <StripeCheckout products={products} setReload={setReload}/> */}
                        <BrainTreePayment products={products} setReload={setReload}/>
                </div>
            </div>
        </Base>
    )
}

export default Cart;
