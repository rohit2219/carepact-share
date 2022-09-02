import fs from 'fs'
import PDFDocument from 'pdfkit'

function createInvoice(invoice, path) {

  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc,invoice);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc,invoice);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc, invoice) {
  doc
    .image("/home/user/poswebapp/backend/Carepact Logopng.png", 50, 45, { width: 100 })
    .fillColor("#444444")
    .fontSize(20)
    .fontSize(10)
    .text(invoice.shopname, 100, 50, { align: "center" })
    .text(invoice.shopaddress, 100, 65, { align: "center" })
    .text("Phone: "+invoice.shopphone, 100, 80, { align: "center" })
    .text("GSTIN: "+invoice.shopgst, 430, 50, { align: "center" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text(" Tax Invoice", 50, 110);

  const customerInformationTop = 150;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Payment Mode:", 50, customerInformationTop + 30)
    .text(invoice.shipping.payment, 150, customerInformationTop + 30)

    .font("Helvetica-Bold")
    .text("Customer Details", 450, customerInformationTop)
    .font("Helvetica")
    .text(invoice.shipping.name, 450, customerInformationTop + 15)
    .text(invoice.shipping.address, 450, customerInformationTop + 30)
    .text("Mobile: "+invoice.shipping.phone, 450, customerInformationTop + 45)
    .moveDown();

  generateHr(doc, 220);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 235;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Slno",
    "Item",
    "HSN",
    "MRP",
    "Qty",
    "Disc amt",
    "CGST %",
    "SGST %",
    "Cess %",
    "Tax amt",
    "Amount"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    const slno = i+1
    const cess = 1
    generateTableRow(
      doc,
      position,
      slno,
      item.item,
      item.hsn,
      item.mrp,
      item.quantity,
      item.disamnt,
      item.tax_percentage/2,
      item.tax_percentage/2,
      cess,
      item.taxamount,
      item.amount
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  
  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Sub Total: ", 430, subtotalPosition)
    .font("Helvetica")
    .text("Rs "+invoice.subtotal, 480, subtotalPosition)
    .font("Helvetica")
    .text("Total Tax amt: ", 430, subtotalPosition+20)
    .font("Helvetica")
    .text("Rs "+invoice.totaltaxamt, 500, subtotalPosition + 20)
    .moveDown();

  const totalPosition = subtotalPosition + 55;

  generateHr(doc, totalPosition);

  doc
  .fontSize(10)
  .font("Helvetica-Bold")
  .text("Total Amount: ", 425, totalPosition+20)
  .text("Rs "+invoice.total, 495, totalPosition+20)

  generateHr(doc, totalPosition+40);
  
  doc
  .fontSize(10)
  .font("Helvetica")
  .text("Thank you for your business.",   50, totalPosition+60)
  
  const footerPosition = totalPosition + 80;

  generateHr(doc, footerPosition);

  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Customer Signature", 50, footerPosition+20)
  

    .font("Helvetica")
    .text(invoice.shopname, 430, footerPosition+20,{ align: "center" })
    .font("Helvetica")
    .text("Pharmacist Signature", 430, footerPosition + 35,{ align: "center" })
    .moveDown();


}

function generateFooter(doc,invoice) {

  

}

function generateTableRow(
  doc,
  y,
  slno,
  item,
  hsn,
  mrp,
  quantity,
  disamnt,
  tax_percentage,
  tax_percentage1,
  cess,
  taxamount,
  amount
) {
  doc
  .fontSize(10)
  .text(slno, 50, y,{ width: 50, align: "left" })
  .text(item, 70, y,{ width: 80, align: "center" })
  .text(hsn, 150, y,{ width: 50, align: "center" })
  .text(mrp, 190, y, { width: 50, align: "center" })
  .text(quantity, 230, y, { width: 50, align: "center" })
  .text(disamnt, 275, y, { width: 50, align: "center" })
  .text(tax_percentage, 325, y, { width: 55, align: "center" })
  .text(tax_percentage1, 365, y, { width: 55, align: "center" })
  .text(cess, 405, y, { width: 55, align: "center" })
  .text(taxamount, 455, y, { width: 60, align: "center" })
  .text(amount, 505, y, { width: 50, align: "center" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "Rs " + cents;
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

export { createInvoice };