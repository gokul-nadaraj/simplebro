import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import image1 from '/images/banner.png';
import image2 from '/images/banner.png';
import image3 from '/images/banner.png';
import logo from '/images/multibook.png';
import './Banner.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../UserContext"; // Adjust the path according to your folder structure


const Banner = () => {

  const { setUserData ,setPaymentDetails} = useUser();
  const images = [image1, image2, image3];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [isMobile, setIsMobile] = useState(false); // Track if the screen width is less than 992px

  const [showForm, setShowForm] = useState(false); // Track if the form is shown on mobile

const navigate = useNavigate()
  // Slide navigation handlers
  const handlePrevious = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      setFade(false);
    }, 300);
  };

  const handleNext = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      setFade(false);
    }, 300);
  };

  // Form change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: value.trim() ? '' : `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`,
    }));
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      }
    });
    setErrors(newErrors);

    if (!Object.keys(newErrors).length) {
      await paymentHandler();
      setUserData(formData);
    }
  };

  const handleBuyNowClick = () => {
    setShowForm(!showForm); // Toggle form visibility
    if (!showForm) {
      document.body.classList.add('show-overlay'); // Add overlay class to body
    } else {
      document.body.classList.remove('show-overlay'); // Remove overlay class when form is hidden
    }
  };
  
  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 992);
    };

    checkWidth(); // Check width on initial load
    window.addEventListener('resize', checkWidth); // Add listener for window resize

    return () => {
      window.removeEventListener('resize', checkWidth); 
    };
  }, []);

  // Payment handler
  const paymentHandler = async () => {
    try {
      const orderbody = { amount: 500000, currency: 'INR', receipt: 'receiptId_1' };
      const headers = {
        'Content-Type': 'application/json',
        'x-api-key': 'nb7yqBXPNZ8RDEsa0s7sS8OxEn9bujNV1c1VK3vc',
      };
      const response = await axios.post("https://178sjvr7ai.execute-api.ap-south-1.amazonaws.com/order", orderbody, { headers });
      const order = response.data;

      const options = {
        key: '',
        amount: orderbody.amount,
        currency: orderbody.currency,
        name: "TinyKarts (YesurajSeelan)",
        order_id: order.id,
        handler: async (response) => {
          const body = JSON.stringify(response);
          const validateRes = await axios.post("https://178sjvr7ai.execute-api.ap-south-1.amazonaws.com/order/validate", body, { headers });
          const jsonRes = validateRes.data;
          
          setPaymentDetails({
            invoiceId: order.id,
            amount: orderbody.amount,
            date: new Date().toLocaleDateString(),
          });
   
          alert("Payment successful!");
          navigate('/confirmationpage');
        },

        
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        theme: { color: "#3399cc" },
      };


      const rzp1 = new Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Failed to initiate payment. Please try again.");
      navigate('/failurepage')
    }
  };

  return (
    <div className="container">
      <div
      className={`banner ${fade ? 'fade' : ''}`}
      style={{
        backgroundImage: `url(${images[currentIndex]})`,
      }}
    >
      <div className='banner-container'>
        <FontAwesomeIcon icon={faArrowLeft} className='btn' onClick={handlePrevious} />
        <img src={logo} alt="open" />
      </div>
      <div className='shop-container'>
        <div className='shop'>
          <h2>Hot & Trendy</h2>
          <h1>Baby bedtime Story</h1>
          <p>Get up to 30% off on Your First Order</p>
          <button>Shop Now</button>
        </div>
        <div className='btn-container'>
                
          <FontAwesomeIcon icon={faArrowRight} onClick={handleNext}    className='btn'/>
                               
               </div>
                          
      </div>
    </div>

{/* Mobile */}
  <div className="form-container">
       
        {isMobile && (
  <button onClick={handleBuyNowClick} className="buy-now-toggle">
    {showForm ? 'Hide Payment Form' : 'Show Payment Form'}
  </button>
)}

<div className={`form-container ${showForm ? 'show-form' : ''}`}>
 

  {isMobile && showForm && (
  <div className="overlay"></div> // This is the overlay that will cover the rest of the page
)}

{isMobile && showForm && (
  <div className="form-container2 show-form">
    <h2 className="form-heading2">Payment Info</h2>
    <form onSubmit={handleSubmit}>
      {['name', 'email', 'phone'].map((field) => (
        <div key={field} className="form-class">
          <label htmlFor={field} className="form-label">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            type={field === 'email' ? 'email' : 'text'}
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            required
            className="form-input"
          />
          <p className="error-message">{errors[field]}</p>
          amou
        </div>
      ))}
      <button type="submit" className="submit-button">BUY NOW</button>
      <div className='pay1'>
      <p>Guranted Safe & Secure Payment</p>
    </div>
    <div className='box-container1'>
      <div className='box11'><img src="" alt="" /></div>
      <div className='box12'><img src="" alt="" /></div>
      <div className='box13'><img src="" alt="" /></div>
      <div className='box14'><img src="" alt="" /></div>
      <div className='box15'><img src="" alt="" /></div>
      </div>
    </form>
   
  </div>
)}

{/* desktop */}
{!isMobile && (
  <form onSubmit={handleSubmit} className="form-container1">
    <h2 className="form-heading1">Payment Info</h2>
    <div className="form-left">
      {['name', 'email', 'phone'].map((field) => (
        <div key={field} className="form-group1">
          <label htmlFor={field} className="form-label1">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            type={field === 'email' ? 'email' : 'text'}
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            required
            className="form-input1"
          />
          <p className="error-message1">{errors[field]}</p>
      
        </div>
      ))}
      <button type="submit" className="submit-button1">BUY NOW</button>
    </div>
    <div className='pay'>
      <p>Guranted Safe & Secure Payment</p>
    </div>
    <div className='box-container1'>
      <div className='box1'><img src="" alt="" /></div>
      <div className='box2'><img src="" alt="" /></div>
      <div className='box3'><img src="" alt="" /></div>
      <div className='box4'><img src="" alt="" /></div>
      <div className='box5'><img src="" alt="" /></div>
      </div>
  </form>
)}

        
       
        {isMobile && (
        <button onClick={handleBuyNowClick} className="buy-now-toggle">
          {showForm ? 'Cancel Payment ' : 'Make Payment '}
        </button>
      )}
      </div>
    </div>
    </div>
  );
};

export default Banner;