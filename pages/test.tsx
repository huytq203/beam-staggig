import { PDFDocument } from 'pdf-lib';
const TestPage = () => {
  const fillForm = async () => {
    const formUrl = '/document/usage_agreement.pdf';
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();
    const nameField = form.getTextField('user_name');
    const phoneField = form.getTextField('user_phone');
    const aField = form.getTextField('user_a');
    const bField = form.getTextField('user_b');
    const cField = form.getTextField('user_c');
    const dField = form.getTextField('user_d');
    const eField = form.getTextField('user_e');
    const fField = form.getTextField('user_f');
    nameField.setText('Phuongnh');
    phoneField.setText('20');
    nameField.enableReadOnly();
    phoneField.enableReadOnly();
    aField.enableReadOnly();
    bField.enableReadOnly();
    cField.enableReadOnly();
    dField.enableReadOnly();
    eField.enableReadOnly();
    fField.enableReadOnly();
    aField.setText('21');
    bField.setText('22');
    cField.setText('23');
    dField.setText('24');
    eField.setText('25');
    fField.setText('26');
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'filled_form.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div>
      <button onClick={fillForm}>Fill form</button>
    </div>
  );
};

export default TestPage;
