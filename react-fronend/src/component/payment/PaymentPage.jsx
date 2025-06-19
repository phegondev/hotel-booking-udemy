import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaymentForm from "./PaymentForm";
import ApiService from "../../service/ApiService";


const PaymentPage = () => {
    const {bookingReference, amount} = useParams()
    const [clientSecret, setClientSecret] = useState(null)
    const [error, setError] = useState(null)
    const [paymentStatus, setPaymentStatus] = useState(null)
    const navigate = useNavigate();

    useEffect(()=> {
        const fetchClientSecrete = async () => {
            try {
                const paymentData = {bookingReference, amount};
                console.log("BOOKING NO IS: " + bookingReference)
                console.log("Amount  IS: " + amount)

                const uniquePaymentSecreet = await ApiService.proceedForPayment(paymentData);

                console.log("UNIQUE CLIENT SECRETE FROM fetchClientSecrete is: " + uniquePaymentSecreet);
                setClientSecret(uniquePaymentSecreet);
                
            } catch (error) {
                console.log(error)
                setError(error.response?.data?.message || error.message)
            }
        };
        fetchClientSecrete();
    }, [bookingReference, amount])



    if (error) {
        return <div className="error-message">{error}</div>
    }

    //initilize strip with public key

    const stripePromise = loadStripe(
        "pk_test_51QUUt8HB3OLSUETB41PkCNVZvXQdjyIJx4n7u9EHrMUH0j3R5VAJE76l1fnwQbC3OJlkPwQDIi0KwXGjdU1phB3s00ZJEZOlbv"
    );

    //du tion to ipdate payment status for our booking in our backend databse
    const handlePaymentStatus =  async (paymentStatus, transactionId = "", failureReason = "") => {
        try {

            const paymentData = {
                bookingReference,
                amount,
                transactionId,
                success: paymentStatus === "succeeded",
                failureReason
            }
            
            await ApiService.updateBookingPaymeent(paymentData)
            console.log("Payment sataus weas updated")
        } catch (error) {
            console.log(error.message)
        }
    }

    return(
        <div className="payment-page">
            <Elements stripe={stripePromise} options={clientSecret}>
                <PaymentForm
                clientSecrete={clientSecret}
                amount={amount}
                onPaymentSuccess={(transactionId) => {
                    setPaymentStatus("succeeded")
                    handlePaymentStatus("succeeded", transactionId)
                    navigate(`/payment-success/${bookingReference}`)
                }}
                onPaymentError={(error) => {
                    setPaymentStatus("failed");
                    handlePaymentStatus("failed", "", error.message)
                    navigate(`/payment-failed/${bookingReference}`);

                }}
                
                />
            </Elements>

            {paymentStatus && <div>Payment Status: {paymentStatus}</div>}
        </div>
    )

}

export default PaymentPage;