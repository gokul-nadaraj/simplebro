import React, { useState, useEffect } from 'react';
import { TbFileDownload } from "react-icons/tb";
import { PiDownload } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import image from '/images/myimage.png';
import { useUser } from "../UserContext"; // Adjust the path according to your folder structure
import './FinalPage.css';
import axios from 'axios';

const FinalPage = () => {
  const { userData, paymentDetails } = useUser();
  const [currentDate, setCurrentDate] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [file1, setFile1] = useState('');
  const [order, setOrder] = useState('')



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



  const sendEmail = async (order, fileBlob, filename) => {
    const formData = new FormData();
    const userName = order.user[0].name1;
    const userEmail = order.user[0].email; // Assuming you have user email here
    const razorpayOrderId = order.paymentDetails.razorpay_order_id;
    const razorpayPaymentId = order.paymentDetails.razorpay_payment_id;
  
    formData.append('to', userEmail);
    formData.append('subject', 'Your Order Receipt from TinyKarts');
    formData.append('username', userName);
    formData.append('orderid', razorpayOrderId);
    formData.append('paymentid', razorpayPaymentId);
  
    // Append fileBlob (receipt) to formData as file1
    formData.append('file1', fileBlob, filename);
  
    try {
      // Fetch ebook.pdf from the public directory
      const ebookResponse = await fetch('/ebook.pdf'); // Ensure this URL is correct
      const ebookBlob = await ebookResponse.blob();
  
      // Append the ebook.pdf as file2
      formData.append('file2', ebookBlob, 'ebook.pdf');
  
   
      // Send the formData with both files
      const response = await axios.post('https://178sjvr7ai.execute-api.ap-south-1.amazonaws.com/send-email', formData, {
        headers: {
          'Accept': 'application/json',
          // 'Content-Type' is automatically set to multipart/form-data with FormData, so no need to set it manually
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };
  
  
  
  useEffect(() => {
    const fetchReceiptUrl = async () => {
      const { blob, url, filename } = await generateReceipt(order);
      setReceiptUrl(url);
      setFile1(filename);

      await sendEmail(order, blob, filename);
    };
  
})
   

  // Function to send email with the receipt

  

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
              <h2>Invoice ID:{paymentDetails?.invoiceId}</h2>
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
