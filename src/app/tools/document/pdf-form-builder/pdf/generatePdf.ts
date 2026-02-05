// pdf/generatePdf.ts
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { FormField } from "../types/form-schema";

// Helper function to convert hex color to RGB values (0-1 range)
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return { r: 0.2, g: 0.2, b: 0.2 }; // Default dark gray
  }
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  };
}

type FieldWithColors = FormField & {
  bgColor?: string;
  lineColor?: string;
  textColor?: string;
};

export async function generateFillablePdf(fields: FieldWithColors[], formTitle: string = "Form") {
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

    // Get field colors, with defaults
    const textColorRgb = field.textColor ? hexToRgb(field.textColor) : { r: 0.2, g: 0.2, b: 0.2 };
    const lineColorRgb = field.lineColor ? hexToRgb(field.lineColor) : { r: 0.7, g: 0.7, b: 0.7 };
    const bgColorRgb = field.bgColor ? hexToRgb(field.bgColor) : { r: 1, g: 1, b: 1 };

    // Draw label with text color
    page.drawText(field.label + (field.required ? " *" : ""), {
      x: field.x,
      y: yPos + field.height + 5,
      size: 10,
      font: boldFont,
      color: rgb(textColorRgb.r, textColorRgb.g, textColorRgb.b),
    });

    try {
      switch (field.type) {
        case "text": {
          const textField = form.createTextField(field.id);
          textField.setText("");
          textField.enableMultiline();
          textField.addToPage(page, {
            x: field.x,
            y: yPos,
            width: field.width,
            height: field.height - 10,
            borderColor: rgb(lineColorRgb.r, lineColorRgb.g, lineColorRgb.b),
            borderWidth: 1,
            backgroundColor: rgb(bgColorRgb.r, bgColorRgb.g, bgColorRgb.b),
            textColor: rgb(textColorRgb.r, textColorRgb.g, textColorRgb.b),
          });
          textField.setFontSize(10);
          textField.defaultUpdateAppearances(font);
          break;
        }

        case "textarea": {
          const textAreaField = form.createTextField(field.id);
          textAreaField.setText("");
          textAreaField.enableMultiline();
          textAreaField.addToPage(page, {
            x: field.x,
            y: yPos,
            width: field.width,
            height: field.height - 10,
            borderColor: rgb(lineColorRgb.r, lineColorRgb.g, lineColorRgb.b),
            borderWidth: 1,
            backgroundColor: rgb(bgColorRgb.r, bgColorRgb.g, bgColorRgb.b),
            textColor: rgb(textColorRgb.r, textColorRgb.g, textColorRgb.b),
          });
          textAreaField.setFontSize(10);
          textAreaField.defaultUpdateAppearances(font);
          break;
        }

        case "checkbox": {
          const checkbox = form.createCheckBox(field.id);
          checkbox.addToPage(page, {
            x: field.x,
            y: yPos + 5,
            width: 18,
            height: 18,
            borderColor: rgb(lineColorRgb.r, lineColorRgb.g, lineColorRgb.b),
            borderWidth: 1,
          });
          break;
        }

        case "radio": {
          const radioGroup = form.createRadioGroup(field.id);
          if (field.options) {
            field.options.forEach((option: string, index: number) => {
              const optionY = yPos - (index * 25);
              
              // Draw option circle
              page.drawCircle({
                x: field.x + 8,
                y: optionY + 10,
                size: 6,
                borderColor: rgb(lineColorRgb.r, lineColorRgb.g, lineColorRgb.b),
                borderWidth: 1,
              });

              // Draw option text with text color
              page.drawText(option, {
                x: field.x + 22,
                y: optionY + 5,
                size: 9,
                font,
                color: rgb(textColorRgb.r, textColorRgb.g, textColorRgb.b),
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
          dropdown.addToPage(page, {
            x: field.x,
            y: yPos,
            width: field.width,
            height: field.height - 10,
            borderColor: rgb(lineColorRgb.r, lineColorRgb.g, lineColorRgb.b),
            borderWidth: 1,
            backgroundColor: rgb(bgColorRgb.r, bgColorRgb.g, bgColorRgb.b),
            textColor: rgb(textColorRgb.r, textColorRgb.g, textColorRgb.b),
          });
          dropdown.setFontSize(10);
          dropdown.defaultUpdateAppearances(font);
          break;
        }

        case "signature": {
          // Draw signature box with background color
          page.drawRectangle({
            x: field.x,
            y: yPos,
            width: field.width,
            height: field.height - 10,
            borderColor: rgb(lineColorRgb.r, lineColorRgb.g, lineColorRgb.b),
            borderWidth: 1,
            color: rgb(bgColorRgb.r, bgColorRgb.g, bgColorRgb.b),
          });

          // Add signature text field
          const signatureField = form.createTextField(field.id);
          signatureField.setText("");
          signatureField.addToPage(page, {
            x: field.x + 5,
            y: yPos + 5,
            width: field.width - 10,
            height: field.height - 20,
            borderWidth: 0,
          });
          signatureField.setFontSize(16);

          // Draw placeholder text with text color
          page.drawText("Sign here", {
            x: field.x + 10,
            y: yPos + (field.height - 10) / 2 - 5,
            size: 12,
            font,
            color: rgb(textColorRgb.r, textColorRgb.g, textColorRgb.b),
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
