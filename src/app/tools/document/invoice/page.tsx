'use client';

import { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import ToolInfo from '@/components/ToolInfo';

export default function InvoiceGeneratorPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    customerName: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    taxRate: 0,
    date: '',
    subtotal: 0,
    tax: 0,
    total: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    const subtotal = newItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const tax = subtotal * (formData.taxRate / 100);
    const total = subtotal + tax;
    setFormData({ ...formData, items: newItems, subtotal, tax, total });
  };

  const handleTaxChange = (value: number) => {
    const tax = formData.subtotal * (value / 100);
    const total = formData.subtotal + tax;
    setFormData({ ...formData, taxRate: value, tax, total });
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { description: '', quantity: 1, price: 0 }] });
  };

  const generateInvoice = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    page.drawText('INVOICE', {
      x: 50,
      y: height - 100,
      size: 24,
      color: rgb(0, 0, 0),
    });

    page.drawText(`From: ${formData.companyName}`, {
      x: 50,
      y: height - 130,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText(`To: ${formData.customerName}`, {
      x: 50,
      y: height - 150,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Date: ${formData.date}`, {
      x: 50,
      y: height - 170,
      size: 12,
      color: rgb(0, 0, 0),
    });

    let y = height - 200;
    page.drawText('Items:', { x: 50, y, size: 12 });
    y -= 20;
    formData.items.forEach(item => {
      page.drawText(`${item.description} - Qty: ${item.quantity} - Price: ${item.price}`, { x: 50, y, size: 10 });
      y -= 15;
    });

    page.drawText(`Subtotal: ${formData.subtotal}`, {
      x: 50,
      y: y - 20,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Tax (${formData.taxRate}%): ${formData.tax}`, {
      x: 50,
      y: y - 40,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Total: ${formData.total}`, {
      x: 50,
      y: y - 60,
      size: 12,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoice.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Invoice Generator</h1>
      <p>Create professional invoices for your business transactions.</p>

      <div style={{ marginBottom: '20px' }}>
        <label>Company Name: <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} /></label><br />
        <label>Customer Name: <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} /></label><br />
        <label>Date: <input type="date" name="date" value={formData.date} onChange={handleChange} /></label><br />
        <label>Tax Rate (%): <input type="number" value={formData.taxRate} onChange={(e) => handleTaxChange(parseFloat(e.target.value))} /></label><br />
        
        <h3>Items</h3>
        {formData.items.map((item, index) => (
          <div key={index}>
            <input type="text" placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} />
            <input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))} />
            <input type="number" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))} />
          </div>
        ))}
        <button onClick={addItem}>Add Item</button><br />
        <strong>Subtotal: {formData.subtotal}</strong><br />
        <strong>Tax: {formData.tax}</strong><br />
        <strong>Total: {formData.total}</strong><br />
        <button onClick={generateInvoice} style={{ marginTop: '10px', padding: '10px 20px' }}>Generate Invoice</button>
      </div>

      <ToolInfo
        howItWorks="1. Enter billing information<br>2. Add products/services and amounts<br>3. Generate and download invoice"
        faqs={[
          { title: "What's the difference between invoice and bill?", content: "An invoice is a bill sent to customers requesting payment." },
          { title: "Can I add taxes?", content: "Yes, you can include tax calculations and discounts." }
        ]}
        tips={["Include payment terms and due dates", "Use clear item descriptions", "Keep records of all invoices"]}
      />
    </main>
  );
}