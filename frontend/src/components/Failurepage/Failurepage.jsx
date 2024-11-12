import React, { useEffect } from 'react'
import Crossmark from '/images/cross.png'
import FailImg from '/images/failure.png'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './FailurePage.css'

const FailurePage = () => {
    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
      }, []);
  return (
    <>
  <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 5 }}>
<div class="payment-failure-container">
  <div class="image-section">
    <img src={FailImg} alt="Failed Payment" class="fail-image" />
  </div>
  <div class="text-section">
    <img src={Crossmark} alt="Cross Mark" class="crossmark" />
    <h1 class="payment-failure-title">Payment Failed!</h1>
    <div class="button-group">
      <a href="/" class="try-again-btn">Try Again</a>
      <Link to={'/'} className='continue-shopping-btn'>
      Continue Shopping
      </Link> 
    </div>
  </div>
</div>


  </motion.section>
    </>
  )
}

export default FailurePage