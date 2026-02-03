// pdf/generatePdf.ts
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { FormField } from "../types/form-schema";

export async function generateFillablePdf(fields: FormField[], formTitle: string = "Form") {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();

  const form = pdfDoc.getForm();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Draw form title
  page.drawText(formTitle, {
    x: 50,
    y: height - 40,
    size: 20,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Draw a separator line
  page.drawLine({
    start: { x: 50, y: height - 50 },
    end: { x: width - 50, y: height - 50 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  // Process each field
  for (const field of fields) {
    const yPos = height - field.y - field.height - 60; // Adjust for PDF coordinate system

    // Draw label
    page.drawText(field.label + (field.required ? " *" : ""), {
      x: field.x,
      y: yPos + field.height + 5,
      size: 10,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    try {
      switch (field.type) {
        case "text": {
          const textField = form.createTextField(field.id);
          textField.setText("");
          textField.enableMultiline(false);
          textField.setFontSize(10);
          textField.addToPage(page, {
            x: field.x,
            y: yPos,
            width: field.width,
            height: field.height - 10,
            borderColor: rgb(0.7, 0.7, 0.7),
            borderWidth: 1,
          });
          break;
        }

        case "textarea": {
          const textAreaField = form.createTextField(field.id);
          textAreaField.setText("");
          textAreaField.enableMultiline(true);
          textAreaField.setFontSize(10);
          textAreaField.addToPage(page, {
            x: field.x,
            y: yPos,
            width: field.width,
            height: field.height - 10,
            borderColor: rgb(0.7, 0.7, 0.7),
            borderWidth: 1,
          });
          break;
        }

        case "checkbox": {
          const checkbox = form.createCheckBox(field.id);
          checkbox.addToPage(page, {
            x: field.x,
            y: yPos + 5,
            width: 18,
            height: 18,
            borderColor: rgb(0.7, 0.7, 0.7),
            borderWidth: 1,
          });
          break;
        }

        case "radio": {
          const radioGroup = form.createRadioGroup(field.id);
          if (field.options) {
            field.options.forEach((option, index) => {
              const optionY = yPos - (index * 25);
              
              // Draw option circle
              page.drawCircle({
                x: field.x + 8,
                y: optionY + 10,
                size: 6,
                borderColor: rgb(0.7, 0.7, 0.7),
                borderWidth: 1,
              });

              // Draw option text
              page.drawText(option, {
                x: field.x + 22,
                y: optionY + 5,
                size: 9,
                font,
                color: rgb(0.2, 0.2, 0.2),
              });

              // Add radio button
              radioGroup.addOptionToPage(option, page, {
                x: field.x + 2,
                y: optionY + 4,
                width: 12,
                height: 12,
              });
            });
          }
          break;
        }

        case "select": {
          const dropdown = form.createDropdown(field.id);
          if (field.options) {
            dropdown.addOptions(field.options);
            dropdown.select(field.options[0]);
          }
          dropdown.setFontSize(10);
          dropdown.addToPage(page, {
            x: field.x,
            y: yPos,
            width: field.width,
            height: field.height - 10,
            borderColor: rgb(0.7, 0.7, 0.7),
            borderWidth: 1,
          });
          break;
        }

        case "signature": {
          // Draw signature box
          page.drawRectangle({
            x: field.x,
            y: yPos,
            width: field.width,
            height: field.height - 10,
            borderColor: rgb(0.7, 0.7, 0.7),
            borderWidth: 1,
            color: rgb(0.98, 0.98, 0.98),
          });

          // Add signature text field
          const signatureField = form.createTextField(field.id);
          signatureField.setText("");
          signatureField.setFontSize(16);
          signatureField.addToPage(page, {
            x: field.x + 5,
            y: yPos + 5,
            width: field.width - 10,
            height: field.height - 20,
            borderWidth: 0,
          });

          // Draw placeholder text
          page.drawText("✍ Sign here", {
            x: field.x + 10,
            y: yPos + (field.height - 10) / 2 - 5,
            size: 12,
            font,
            color: rgb(0.7, 0.7, 0.7),
          });
          break;
        }
      }
    } catch (error) {
      console.error(`Error adding field ${field.id}:`, error);
    }
  }

  // Add footer
  page.drawText("Form created with PDF Form Builder", {
    x: 50,
    y: 30,
    size: 8,
    font,
    color: rgb(0.6, 0.6, 0.6),
  });

  return await pdfDoc.save();
}
