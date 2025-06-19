import { useParams } from "react-router-dom";


const PaymentSuccess = () => {
 const { bookingReference } = useParams();
 return (
   <div>
     <h2>Payment Successful</h2>
     <p>Your payment for booking reference {bookingReference} was successful.</p>
   </div>
 );
};


export default PaymentSuccess;