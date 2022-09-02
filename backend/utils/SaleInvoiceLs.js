import fs from 'fs'
import PDFDocument from 'pdfkit'

function SaleInvoiceLs(invoice, path) {

  let doc = new PDFDocument({size:[13,18],margin: 50});

  generateHeader(doc,invoice);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc,invoice);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc,invoice) {
  doc
    .image("/home/user/poswebapp/backend/Carepact Logopng.png", 50, 45, { width: 100 })
    .fillColor("#444444")
    .fontSize(20)
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(invoice.shopname, 100, 50, { align: "center" })
    .text(invoice.shopaddress, 100, 65, { align: "center" })
    .text(invoice.shopphone, 100, 80, { align: "center" })
    .text("Kerala, India", 100, 95, { align: "center" })
    .text(invoice.shopgst, 550, 50, { align: "center" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 110);

  generateHr(doc, 135);

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
    .text("Customer Details", 600, customerInformationTop)
    .font("Helvetica")
    .text(invoice.shipping.name, 600, customerInformationTop + 15)
    .text(invoice.shipping.address, 600, customerInformationTop + 30)
    .text(invoice.shipping.phone, 600, customerInformationTop + 45)
    .moveDown();

  generateHr(doc, 210 );
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 250;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Slno",
    "Item",
    "HSN",
    "Rate",
    "Quantity",
    "Dis %",
    "Disc amt",
    "Tax Rate",
    "Tax Amount",
    "Sub Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    const slno = i+1
    generateTableRow(
      doc,
      position,
      slno,
      item.item,
      item.hsn,
      item.mrp,
      item.quantity,
      item.dis_per,
      item.disamnt,
      item.tax_percentage,
      item.taxamount,
      item.amount
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Tax amount ",
    formatCurrency(invoice.totaltaxamt)
  );
  
  generateTableRow(
    doc,
    subtotalPosition+30,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Total",
    formatCurrency(invoice.subtotal)
  );

  
  doc.font("Helvetica");
}

function generateFooter(doc,invoice) {

  generateHr(doc, 525);

  const footerTop = 535;

  doc
    .fontSize(10)
    .text("Customer Signature", 50, footerTop)

    .fontSize(10)
    .text("Thank you for your business.", 290, footerTop)
  

    .font("Helvetica-Bold")
    .text("Authorized By", 600, footerTop)
    .font("Helvetica")
    .text(invoice.shopname, 600, footerTop + 15)
    .moveDown();

}

function generateTableRow(
  doc,
  y,
  slno,
  item,
  hsn,
  mrp,
  quantity,
  dis_per,
  disamnt,
  tax_percentage,
  taxamount,
  amount
) {
  doc
    .fontSize(10)
    .text(slno, 70, y,{ width: 50, align: "left" })
    .text(item, 140, y,{ width: 75, align: "left" })
    .text(hsn, 210, y,{ width: 50, align: "right" })
    .text(mrp, 280, y, { width: 50, align: "center" })
    .text(quantity, 340, y, { width: 50, align: "center" })
    .text(dis_per, 410, y, { width: 50, align: "center" })
    .text(disamnt, 470, y, { width: 50, align: "center" })
    .text(tax_percentage, 520, y, { width: 50, align: "center" })
    .text(taxamount, 600, y, { width: 60, align: "center" })
    .text(amount, 670, y, { width: 50, align: "center" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(725, y)
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

export { SaleInvoiceLs };