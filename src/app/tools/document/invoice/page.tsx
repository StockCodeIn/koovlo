'use client';

import { useState, useRef, useEffect } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './invoice.module.css';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  // Company Details
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyLogo: string;
  
  // Invoice Details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  
  // Client Details
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  
  // Items
  items: InvoiceItem[];
  
  // Financial
  currency: string;
  taxRate: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  
  // Additional
  notes: string;
  paymentTerms: string;
  bankDetails: string;
  signature: string;
  signatureType: 'image' | 'text';
  signatureText: string;
  signatureDate: string;
  
  // Styling
  template: 'modern' | 'classic' | 'minimal' | 'elegant';
  accentColor: string;
}

export default function InvoiceGeneratorPage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    companyLogo: '',
    invoiceNumber: 'INV-000000',
    invoiceDate: '',
    dueDate: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }],
    currency: '$',
    taxRate: 0,
    discountType: 'percentage',
    discountValue: 0,
    notes: '',
    paymentTerms: 'Payment due within 30 days',
    bankDetails: '',
    signature: '',
    signatureType: 'text',
    signatureText: '',
    signatureDate: '',
    template: 'modern',
    accentColor: '#2563eb'
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Initialize on client side only
  useEffect(() => {
    setInvoiceData(prev => ({
      ...prev,
      invoiceNumber: prev.invoiceNumber === 'INV-000000' ? `INV-${Date.now().toString().slice(-6)}` : prev.invoiceNumber,
      invoiceDate: prev.invoiceDate === '' ? new Date().toISOString().split('T')[0] : prev.invoiceDate,
      dueDate: prev.dueDate === '' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : prev.dueDate,
      signatureDate: prev.signatureDate === '' ? new Date().toISOString() : prev.signatureDate
    }));
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('invoice-draft');
    if (saved) {
      try {
        setInvoiceData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved invoice');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('invoice-draft', JSON.stringify(invoiceData));
  }, [invoiceData]);

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
    const discount = invoiceData.discountType === 'percentage' 
      ? (subtotal * invoiceData.discountValue / 100)
      : invoiceData.discountValue;
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * (invoiceData.taxRate / 100);
    const total = afterDiscount + tax;
    
    return { subtotal, discount, tax, total };
  };

  const totals = calculateTotals();

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoiceData({ ...invoiceData, companyLogo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle signature upload
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoiceData({ 
          ...invoiceData, 
          signature: reader.result as string,
          signatureDate: new Date().toISOString()
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Item operations
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setInvoiceData({ ...invoiceData, items: [...invoiceData.items, newItem] });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = invoiceData.items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    });
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const removeItem = (id: string) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData({ 
        ...invoiceData, 
        items: invoiceData.items.filter(item => item.id !== id) 
      });
    }
  };

  // Export to PDF
  const exportToPDF = async () => {
    if (!previewRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const element = previewRef.current;

      const canvas = await html2canvas(element, {
        scale: 1.5,
        backgroundColor: '#ffffff',
        useCORS: true,
        windowWidth: 794
      });

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Print invoice
  const printInvoice = () => {
    window.print();
  };

  // Clear form
  const clearForm = () => {
    if (confirm('Are you sure you want to clear the form?')) {
      setInvoiceData({
        ...invoiceData,
        companyName: '',
        companyEmail: '',
        companyPhone: '',
        companyAddress: '',
        companyLogo: '',
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
        items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }],
        notes: '',
        bankDetails: '',
        signature: '',
        signatureDate: new Date().toISOString()
      });
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Professional Invoice Generator</h1>
        <p>Create beautiful, professional invoices in seconds</p>
      </div>

      <div className={styles.mainContent}>
        {/* Left Panel - Form */}
        <div className={styles.formPanel}>
          {/* Template Selection */}
          <section className={styles.section}>
            <h2>Template & Style</h2>
            <div className={styles.templateGrid}>
              {(['modern', 'classic', 'minimal', 'elegant'] as const).map(template => (
                <button
                  key={template}
                  className={`${styles.templateBtn} ${invoiceData.template === template ? styles.active : ''}`}
                  onClick={() => setInvoiceData({ ...invoiceData, template })}
                >
                  {template.charAt(0).toUpperCase() + template.slice(1)}
                </button>
              ))}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="accent-color">Accent Color</label>
              <input
                id="accent-color"
                type="color"
                value={invoiceData.accentColor}
                onChange={(e) => setInvoiceData({ ...invoiceData, accentColor: e.target.value })}
                className={styles.colorPicker}
              />
            </div>
          </section>

          {/* Company Details */}
          <section className={styles.section}>
            <h2>Your Company Details</h2>
            <div className={styles.formGroup}>
              <label htmlFor="company-logo">Company Logo</label>
              <input
                id="company-logo"
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className={styles.fileInput}
              />
              {invoiceData.companyLogo && (
                <div className={styles.logoPreview}>
                  <img src={invoiceData.companyLogo} alt="Logo" />
                  <button onClick={() => setInvoiceData({ ...invoiceData, companyLogo: '' })}>Remove</button>
                </div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="company-name">Company Name *</label>
              <input
                id="company-name"
                type="text"
                value={invoiceData.companyName}
                onChange={(e) => setInvoiceData({ ...invoiceData, companyName: e.target.value })}
                placeholder="Your Company Name"
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="company-email">Email</label>
                <input
                  id="company-email"
                  type="email"
                  value={invoiceData.companyEmail}
                  onChange={(e) => setInvoiceData({ ...invoiceData, companyEmail: e.target.value })}
                  placeholder="company@example.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="company-phone">Phone</label>
                <input
                  id="company-phone"
                  type="tel"
                  value={invoiceData.companyPhone}
                  onChange={(e) => setInvoiceData({ ...invoiceData, companyPhone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="company-address">Address</label>
              <textarea
                id="company-address"
                value={invoiceData.companyAddress}
                onChange={(e) => setInvoiceData({ ...invoiceData, companyAddress: e.target.value })}
                placeholder="123 Business St, City, State, ZIP"
                rows={2}
              />
            </div>
          </section>

          {/* Invoice Details */}
          <section className={styles.section}>
            <h2>Invoice Details</h2>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="invoice-number">Invoice Number *</label>
                <input
                  id="invoice-number"
                  type="text"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                  placeholder="001"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="currency-select">Currency</label>
                <select
                  id="currency-select"
                  value={invoiceData.currency}
                  onChange={(e) => setInvoiceData({ ...invoiceData, currency: e.target.value })}
                >
                  <option value="$">$ USD</option>
                  <option value="₹">₹ INR</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                  <option value="¥">¥ JPY</option>
                  <option value="$">$ CAD</option>
                  <option value="$">$ AUD</option>
                </select>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="invoice-date">Invoice Date *</label>
                <input
                  id="invoice-date"
                  type="date"
                  value={invoiceData.invoiceDate}
                  onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="due-date">Due Date *</label>
                <input
                  id="due-date"
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Client Details */}
          <section className={styles.section}>
            <h2>Bill To (Client Details)</h2>
            <div className={styles.formGroup}>
              <label htmlFor="client-name">Client Name *</label>
              <input
                id="client-name"
                type="text"
                value={invoiceData.clientName}
                onChange={(e) => setInvoiceData({ ...invoiceData, clientName: e.target.value })}
                placeholder="Client Company or Person Name"
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="client-email">Email</label>
                <input
                  id="client-email"
                  type="email"
                  value={invoiceData.clientEmail}
                  onChange={(e) => setInvoiceData({ ...invoiceData, clientEmail: e.target.value })}
                  placeholder="client@example.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="client-phone">Phone</label>
                <input
                  id="client-phone"
                  type="tel"
                  value={invoiceData.clientPhone}
                  onChange={(e) => setInvoiceData({ ...invoiceData, clientPhone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="client-address">Address</label>
              <textarea
                id="client-address"
                value={invoiceData.clientAddress}
                onChange={(e) => setInvoiceData({ ...invoiceData, clientAddress: e.target.value })}
                placeholder="Client address"
                rows={2}
              />
            </div>
          </section>

          {/* Items */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Items / Services</h2>
              <button onClick={addItem} className={styles.addBtn}>+ Add Item</button>
            </div>
            <div className={styles.itemsContainer}>
              {invoiceData.items.map((item, index) => (
                <div key={item.id} className={styles.itemRow}>
                  <div className={styles.itemNumber}>{index + 1}</div>
                  <div className={styles.itemFields}>
                    <div className={styles.formGroup}>
                        <label htmlFor={`item-desc-${item.id}`}>Description *</label>
                      <input
                          id={`item-desc-${item.id}`}
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Product or service description"
                      />
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                          <label htmlFor={`item-qty-${item.id}`}>Quantity</label>
                        <input
                            id={`item-qty-${item.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                          <label htmlFor={`item-rate-${item.id}`}>Rate</label>
                        <input
                            id={`item-rate-${item.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                          <label htmlFor={`item-amount-${item.id}`}>Amount</label>
                        <input
                            id={`item-amount-${item.id}`}
                          type="text"
                          value={`${invoiceData.currency}${item.amount.toFixed(2)}`}
                          readOnly
                          className={styles.readOnly}
                        />
                      </div>
                    </div>
                  </div>
                  {invoiceData.items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className={styles.removeBtn}
                      title="Remove item"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Financial Details */}
          <section className={styles.section}>
            <h2>Tax & Discount</h2>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="tax-rate">Tax Rate (%)</label>
                <input
                  id="tax-rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={invoiceData.taxRate}
                  onChange={(e) => setInvoiceData({ ...invoiceData, taxRate: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="discount-type">Discount Type</label>
                <select
                  id="discount-type"
                  value={invoiceData.discountType}
                  onChange={(e) => setInvoiceData({ ...invoiceData, discountType: e.target.value as 'percentage' | 'fixed' })}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="discount-value">Discount Value</label>
                <input
                  id="discount-value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={invoiceData.discountValue}
                  onChange={(e) => setInvoiceData({ ...invoiceData, discountValue: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          </section>

          {/* Signature */}
          <section className={styles.section}>
            <h2>Authorized Signature</h2>
            <div className={styles.formGroup}>
              <label htmlFor="signature-type">Signature Type</label>
              <select
                id="signature-type"
                value={invoiceData.signatureType}
                onChange={(e) => setInvoiceData({ 
                  ...invoiceData, 
                  signatureType: e.target.value as 'image' | 'text',
                  signature: '',
                  signatureText: '',
                  signatureDate: new Date().toISOString()
                })}
              >
                <option value="text">Type Signature</option>
                <option value="image">Upload Image</option>
              </select>
            </div>
            
            {invoiceData.signatureType === 'image' ? (
              <div className={styles.formGroup}>
                <label htmlFor="signature-upload">Upload Signature Image</label>
                <input
                  id="signature-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUpload}
                  className={styles.fileInput}
                />
                {invoiceData.signature && (
                  <div className={styles.signaturePreview}>
                    <img src={invoiceData.signature} alt="Signature" />
                    <button onClick={() => setInvoiceData({ ...invoiceData, signature: '' })}>Remove</button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.formGroup}>
                <label htmlFor="signature-text">Type Your Name</label>
                <input
                  id="signature-text"
                  type="text"
                  value={invoiceData.signatureText}
                  onChange={(e) => setInvoiceData({ 
                    ...invoiceData, 
                    signatureText: e.target.value,
                    signatureDate: new Date().toISOString()
                  })}
                  placeholder="Your Full Name"
                />
                {invoiceData.signatureText && (
                  <div className={styles.signatureTextPreview}>
                    <span className={styles.handwritingFont}>{invoiceData.signatureText}</span>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Additional Info */}
          <section className={styles.section}>
            <h2>Additional Information</h2>
            <div className={styles.formGroup}>
              <label htmlFor="payment-terms">Payment Terms</label>
              <textarea
                id="payment-terms"
                value={invoiceData.paymentTerms}
                onChange={(e) => setInvoiceData({ ...invoiceData, paymentTerms: e.target.value })}
                placeholder="Payment due within 30 days"
                rows={2}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="bank-details">Bank Details</label>
              <textarea
                id="bank-details"
                value={invoiceData.bankDetails}
                onChange={(e) => setInvoiceData({ ...invoiceData, bankDetails: e.target.value })}
                placeholder="Bank Name: XYZ Bank&#10;Account Number: 1234567890&#10;Routing Number: 987654321"
                rows={3}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                placeholder="Thank you for your business!"
                rows={3}
              />
            </div>
          </section>

          {/* Actions */}
          <div className={styles.actions}>
            <button onClick={exportToPDF} className={styles.primaryBtn}>
              📄 Download PDF
            </button>
            <button onClick={printInvoice} className={styles.secondaryBtn}>
              🖨️ Print
            </button>
            <button onClick={clearForm} className={styles.secondaryBtn}>
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className={styles.previewPanel}>
          <div className={styles.previewHeader}>
            <h3>Live Preview</h3>
          </div>
          <div 
            ref={previewRef} 
            className={`${styles.preview} ${styles.pdfPreview} ${styles[invoiceData.template]}`}
            style={{ '--accent-color': invoiceData.accentColor } as React.CSSProperties}
          >
            {/* Invoice Header */}
            <div className={styles.invoiceHeader}>
              <div className={styles.companyInfo}>
                {invoiceData.companyLogo && (
                  <img src={invoiceData.companyLogo} alt="Logo" className={styles.logo} />
                )}
                <h1>{invoiceData.companyName || 'Your Company'}</h1>
                {invoiceData.companyEmail && <p>{invoiceData.companyEmail}</p>}
                {invoiceData.companyPhone && <p>{invoiceData.companyPhone}</p>}
                {invoiceData.companyAddress && <p className={styles.address}>{invoiceData.companyAddress}</p>}
              </div>
              <div className={styles.invoiceInfo}>
                <h2 className={styles.invoiceTitle}>INVOICE</h2>
                {/* <span className={`${styles.statusBadge} ${styles.unpaid}`}>UNPAID</span> */}
                <div className={styles.invoiceMeta}>
                  <div>
                    <span className={styles.label}>Invoice #:</span>
                    <span className={styles.value}>{invoiceData.invoiceNumber}</span>
                  </div>
                  <div>
                    <span className={styles.label}>Date:</span>
                    <span className={styles.value}>{invoiceData.invoiceDate}</span>
                  </div>
                  {invoiceData.dueDate && (
                    <div>
                      <span className={styles.label}>Due Date:</span>
                      <span className={styles.value}>{invoiceData.dueDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className={styles.billTo}>
              <h3>Bill To:</h3>
              <p className={styles.clientName}>{invoiceData.clientName || 'Client Name'}</p>
              {invoiceData.clientEmail && <p>{invoiceData.clientEmail}</p>}
              {invoiceData.clientPhone && <p>{invoiceData.clientPhone}</p>}
              {invoiceData.clientAddress && <p className={styles.address}>{invoiceData.clientAddress}</p>}
            </div>

            {/* Items Table */}
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.description || 'Item description'}</td>
                    <td>{item.quantity}</td>
                    <td>{invoiceData.currency}{item.rate.toFixed(2)}</td>
                    <td>{invoiceData.currency}{item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal:</span>
                <span>{invoiceData.currency}{totals.subtotal.toFixed(2)}</span>
              </div>
              {totals.discount > 0 && (
                <div className={styles.totalRow}>
                  <span>Discount ({invoiceData.discountType === 'percentage' ? `${invoiceData.discountValue}%` : invoiceData.currency + invoiceData.discountValue}):</span>
                  <span>-{invoiceData.currency}{totals.discount.toFixed(2)}</span>
                </div>
              )}
              {invoiceData.taxRate > 0 && (
                <div className={styles.totalRow}>
                  <span>Tax ({invoiceData.taxRate}%):</span>
                  <span>{invoiceData.currency}{totals.tax.toFixed(2)}</span>
                </div>
              )}
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total:</span>
                <span>{invoiceData.currency}{totals.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer Info */}
            <div className={styles.invoiceFooter}>
              {invoiceData.paymentTerms && (
                <div className={styles.footerSection}>
                  <h4>Payment Terms</h4>
                  <p>{invoiceData.paymentTerms}</p>
                </div>
              )}
              {invoiceData.bankDetails && (
                <div className={styles.footerSection}>
                  <h4>Bank Details</h4>
                  <p style={{ whiteSpace: 'pre-line' }}>{invoiceData.bankDetails}</p>
                </div>
              )}
              {invoiceData.notes && (
                <div className={styles.footerSection}>
                  <h4>Notes</h4>
                  <p>{invoiceData.notes}</p>
                </div>
              )}
              {(invoiceData.signature || invoiceData.signatureText) && (
                <div className={styles.footerSection}>
                  <h4>Authorized Signature</h4>
                  <div className={styles.signatureDisplay}>
                    {invoiceData.signatureType === 'image' && invoiceData.signature ? (
                      <img src={invoiceData.signature} alt="Signature" />
                    ) : (
                      <span className={styles.handwritingSignature}>{invoiceData.signatureText}</span>
                    )}
                    <div className={styles.signatureLine}></div>
                    {invoiceData.signatureDate && (
                      <p className={styles.signatureDate}>
                        Signed: {new Date(invoiceData.signatureDate).toLocaleDateString()} at {new Date(invoiceData.signatureDate).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className={styles.legalNote}>
              This is a computer generated invoice and does not require physical signature.
            </div>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="1. Choose a template and customize colors<br>2. Fill in your company and client details<br>3. Add items with quantities and rates<br>4. Apply tax and discounts if needed<br>5. Download PDF or print directly"
        faqs={[
          { title: "Can I save my invoice for later?", content: "Yes! Your invoice is automatically saved to your browser's local storage." },
          { title: "What's the difference between invoice and bill?", content: "An invoice is a commercial document for business transactions, while a bill is a request for immediate payment." },
          { title: "Can I customize the look?", content: "Yes! Choose from 4 templates and customize the accent color to match your brand." },
          { title: "How do discounts work?", content: "You can apply either percentage-based discounts (e.g., 10%) or fixed amount discounts." }
        ]}
        tips={[
          "Always include payment terms and due dates",
          "Add your bank details for faster payments",
          "Use professional language in notes section",
          "Keep your invoice numbers sequential",
          "Include detailed item descriptions"
        ]}
      />
    </main>
  );
}