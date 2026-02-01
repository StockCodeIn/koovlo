// pdf/generatePdf.ts
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { PdfFormSchema } from "../types/form-schema";

export async function generateFillablePdf(schema: PdfFormSchema) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const form = pdfDoc.getForm();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const field of schema.fields) {
    if (field.type === "text") {
      const textField = form.createTextField(field.id);
      textField.setText(field.defaultValue || "");
      textField.addToPage(page, {
        x: field.position.x,
        y: field.position.y,
        width: field.position.width,
        height: field.position.height,
        textColor: rgb(0, 0, 0),
        font,
      });
    }

    if (field.type === "checkbox") {
      const checkbox = form.createCheckBox(field.id);
      checkbox.addToPage(page, {
        x: field.position.x,
        y: field.position.y,
        width: 15,
        height: 15,
      });
    }
  }

  return await pdfDoc.save();
}
