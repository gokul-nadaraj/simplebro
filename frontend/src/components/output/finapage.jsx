import React, { useState, useEffect } from 'react';
import { TbFileDownload } from "react-icons/tb";
import { PiDownload } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import image from '/images/myimage.png';
import { useUser } from "../UserContext"; // Adjust the path according to your folder structure
import './FinalPage.css';

const FinalPage = () => {
  const { userData, paymentDetails } = useUser();
  const [currentDate, setCurrentDate] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [file1, setFile1] = useState('');

  // Ensure the current date is formatted properly
  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleDateString());
  }, []);

  // Generate a unique invoice ID
  useEffect(() => {
    let sessionCounter = 1;

    const generateInvoiceId = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const currentDate = `${year}${month}${day}`;
      const invoiceId = `${currentDate}_${String(sessionCounter).padStart(2, '0')}`;
      sessionCounter += 1;
      return invoiceId;
    };

    const invoiceId = generateInvoiceId();
    // You can use invoiceId later if needed
    console.log("Invoice ID:", invoiceId);
  }, []);

  // Function to send email with the receipt
  const sendEmail = async (order, fileBlob, filename) => {
    const formData = new FormData();
    const userName = order.user[0]?.name1 || 'Customer';
    const userEmail = order.user[0]?.email;
    const razorpayOrderId = order.paymentDetails?.razorpay_order_id || '';
    const razorpayPaymentId = order.paymentDetails?.razorpay_payment_id || '';

    formData.append('to', userEmail);
    formData.append('subject', 'Your Order Receipt from TinyKarts');
    formData.append('username', userName);
    formData.append('orderid', razorpayOrderId);
    formData.append('paymentid', razorpayPaymentId);
    formData.append('file1', fileBlob, filename);

    try {
      const ebookResponse = await fetch('/ebook.pdf');
      const ebookBlob = await ebookResponse.blob();
      formData.append('file2', ebookBlob, 'ebook.pdf');

      const response = await axios.post('https://178sjvr7ai.execute-api.ap-south-1.amazonaws.com/send-email', formData, {
        headers: {
          'Accept': 'application/json',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error sending email:', error.response ? error.response.data : error.message);
    }
  };

  // Function to fetch and generate receipt URL
  const generateReceipt = async (user, paymentDetails) => {
    // Implement your receipt generation logic here
    // You should return the blob, url, and filename
    return { blob: new Blob(), url: '/path/to/receipt.pdf', filename: 'receipt.pdf' };
  };

  // Fetch the receipt URL and send email after payment details are set
  useEffect(() => {
    if (paymentDetails) {
      const fetchReceiptUrl = async () => {
        const { blob, url, filename } = await generateReceipt(userData, paymentDetails);
        setReceiptUrl(url);
        setFile1(filename);

        await sendEmail({ user: userData, paymentDetails }, blob, filename);
      };

      fetchReceiptUrl();
    }
  }, [userData, paymentDetails]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 5 }}>
      
      <section className="final-page">
        <h1 className="thank-you-heading">Thank You for Shopping!</h1>
        <div className="content-wrapper">
          <div className="image-section">
            <img src={image} alt="Product" className="product-image" />
          </div>

          <div className="text-section">
            <h2 className="payment-summary-title">Payment Summary</h2>
            <div className="button-group">
              <a href={receiptUrl} download={file1} className="download-invoice">
                Download Invoice <TbFileDownload className="download-icon" />
              </a>
              <a href="/ebook.pdf" download className="download-ebook">
                Download Ebook <PiDownload className="download-icon" />
              </a>
            </div>

            <div className="invoice-details">
              <h2>Invoice ID: {paymentDetails?.razorpay_order_id || 'Loading...'}</h2>
              <h2>Date: {currentDate}</h2>
            </div>

            <div className="product-summary">
              <h1>Product Name: Lina BirthDay's Surprise</h1>
              <h1>Amount: ₹99</h1>
            </div>

            <div className="user-info">
              {userData ? (
                <div className="user-details">
                  <h1>Customer Name: {userData.name}</h1>
                  <h1>Email ID: {userData.email}</h1>
                  <h1>Contact No: {userData.phone}</h1>
                </div>
              ) : (
                <p>No User Data Found.</p>
              )}
            </div>

            <div className="continue-btn">
              <Link to="/" className="continue-shopping">Continue Shopping</Link>
            </div>
          </div>
        </div>

        <div className="next-steps">
          <h1 className="next-steps-title">What's Next?</h1>
          <ul className="next-steps-list">
            <li>We will send confirmation of your order and information about its progress via email.</li>
            <li>The order will be processed once your payment is confirmed.</li>
            <li>
              <a href="mailto:yesuraj88@gmail.com" className="contact-link">
                Please feel free to contact us if you have any questions.
              </a>
            </li>
          </ul>
        </div>
      </section>
    </motion.section>
  );
};

export default FinalPage;


//   const sendEmail = async (order, fileBlob, filename) => {
//   const formData = new FormData();
//   const userName = order.user[0]?.name1 || 'Customer';
//   const userEmail = order.user[0]?.email;
//   const razorpayOrderId = order.paymentDetails?.razorpay_order_id || '';
//   const razorpayPaymentId = order.paymentDetails?.razorpay_payment_id || '';

//   formData.append('to', userEmail);
//   formData.append('subject', 'Your Order Receipt from TinyKarts');
//   formData.append('username', userName);
//   formData.append('orderid', razorpayOrderId);
//   formData.append('paymentid', razorpayPaymentId);
//   formData.append('file1', fileBlob, filename);

//   try {
//     const ebookResponse = await fetch('/ebook.pdf');
//     const ebookBlob = await ebookResponse.blob();
//     formData.append('file2', ebookBlob, 'ebook.pdf');

//     const response = await axios.post('https://178sjvr7ai.execute-api.ap-south-1.amazonaws.com/send-email', formData, {
//       headers: {
//         'Accept': 'application/json',
//       },
//     });
//     console.log(response.data);
//   } catch (error) {
//     console.error('Error sending email:', error.response ? error.response.data : error.message);
//   }
// };