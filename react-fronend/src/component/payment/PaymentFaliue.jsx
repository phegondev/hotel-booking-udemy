import { useParams } from "react-router-dom";


const PaymentFailure = () => {
 const { bookingReference } = useParams();
 return (
   <div>
     <h2>Payment Failed</h2>
     <p>Your payment for booking reference {bookingReference} failed.</p>
   </div>
 );
};


export default PaymentFailure;