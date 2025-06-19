import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { id } from "react-day-picker/locale";


const PaymentForm = ({clientSecrete, amount, onPaymentSuccess, onPaymentError}) => {
    const stripe = useStripe();
    const element = useElements()

    const [error, setError] = useState(null)
    const [succeeded, setSucceeded] = useState(false)
    const [processing, setProcessing] = useState(false)


    const handleSubmit = async (event) => {
        event.preventDefault()

        if(!stripe || !element || processing) return;

        setProcessing(true) //disable submit button

        const {error, paymentIntent} = await stripe.confirmCardPayment(clientSecrete, {
            payment_method: {
                card: element.getElement(CardElement)
            },
        });
        console.log("PAYMENT IS: " + paymentIntent);

        if (error) {
            setError(error.message)
            setProcessing(false)
            onPaymentError(error.message)

            console.log("Error insdie  PaymentForm is: " + error);
        }else if(paymentIntent.status === "succeeded"){

            console.log("PaymentForm is successful: " + paymentIntent);
            setSucceeded(true)
            setProcessing(false)
            onPaymentSuccess(paymentIntent.id) //notifyb the parent component of a sucessful transaction
        }

    }

    return(
        <div className="payment-form">
            <h3>Complete Your Payment</h3>
            <div className="amount-display">
                <strong>Amount to Pay: ${parseFloat(amount).toFixed(2)}</strong>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="card-element-container">
                    <CardElement/>
                </div>

                <button className="payment-button" disabled={processing || !stripe} type="submit">
                    {processing ? "Processing..." : "Pay Now"}
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}
            {succeeded && <p className="success-message">Payment Succeeded: Thank you for your booking.</p>}
        </div>
    )


}

export default PaymentForm;