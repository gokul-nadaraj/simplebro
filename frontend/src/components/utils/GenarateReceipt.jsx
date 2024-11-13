import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from '/images/logo.png';


const generateReceipt = (order) => {
  const doc = new jsPDF();
  const docWidth = doc.internal.pageSize.getWidth();
  const date = new Date();
  const formattedDate = date.toLocaleDateString();

  // Add logo to center (adjust coordinates as necessary)
  const logoWidth = 40;
  const logoHeight = 20;
  const logoDataUrl = Logo;  // Make sure `Logo` is a valid image URL or Base64 string
  doc.addImage(logoDataUrl, 'PNG', (docWidth - logoWidth) / 2, 10, logoWidth, logoHeight);

  // Receipt Heading
  doc.setFontSize(12);
  const receiptText = "Receipt";
  const receiptTextWidth = doc.getTextWidth(receiptText);
  doc.text(receiptText, (docWidth - receiptTextWidth) / 2, logoHeight + 20);

  // Bill Date and Bill Number (Order ID)
  doc.setFontSize(10);
  const billDateText = `Bill Date: ${formattedDate}`;
  doc.text(billDateText, docWidth - doc.getTextWidth(billDateText) - 14, logoHeight + 30);
  const billNoText = `Bill No: ${order.paymentDetails.razorpay_order_id}`;
  doc.text(billNoText, 14, logoHeight + 50);

  // Customer Details in multiline format
  const customerDetailsY = logoHeight + 60;
  order.users.forEach((user, index) => {
    if (user.name1 && user.email && user.mobile) {
      const address = user.address || "NA";
      const yPosition = customerDetailsY + (index * 40);
      doc.text(`Customer Name: ${user.name1}`, 14, yPosition);
      doc.text(`Email: ${user.email}`, 14, yPosition + 10);
      doc.text(`Mobile: ${user.mobile}`, 14, yPosition + 20);
      doc.text(`Address: ${address}`, 14, yPosition + 30);
    }
  });

  // Order Summary
  doc.setFontSize(12);
  doc.text("Order Summary", 14, customerDetailsY + 80);

  // Orders Table
  const orderItems = order.cart.map((product, index) => [
    index + 1,
    product.name,
    `INR ${product.price.toFixed(2)}`,
    product.quantity,
    `INR ${(product.price * product.quantity).toFixed(2)}`,
  ]);

  doc.autoTable({
    head: [["#", "Product", "Unit Price", "Quantity", "Total"]],
    body: orderItems,
    startY: customerDetailsY + 90,
    theme: "striped",
  });

  // Net Total
  const netTotal = order.cart.reduce((total, product) => total + product.price * product.quantity, 0);
  doc.setFontSize(10);
  const netTotalText = `Net Total: INR ${netTotal.toFixed(2)}`;
  const finalY = doc.autoTable.previous.finalY || doc.lastAutoTable.finalY || customerDetailsY + 60;
  doc.text(netTotalText, docWidth - doc.getTextWidth(netTotalText) - 14, finalY + 10);

  // Payment Details
  doc.text(`Payment ID: ${order.paymentDetails.razorpay_payment_id}`, 14, finalY + 20);
  doc.setFontSize(14);
  doc.setTextColor(0, 128, 0);
  const paymentStatusText = `Payment Status: ${order.paymentDetails.payment_status}`;
  doc.text(paymentStatusText, (docWidth - doc.getTextWidth(paymentStatusText)) / 2, finalY + 30);

  // Thank You Note
  doc.setFontSize(12);
  doc.text("Thank you for shopping with us!", 14, finalY + 50);

  // Create a Blob object for the PDF
  const pdfBlob = doc.output('blob');
  return {
    blob: pdfBlob,
    url: URL.createObjectURL(pdfBlob),
    filename: `Receipt_${order.paymentDetails.razorpay_order_id}.pdf`
  };
};

export default generateReceipt