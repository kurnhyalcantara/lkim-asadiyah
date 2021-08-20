import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const printPdf = (dom: HTMLElement) => {
  const appendix = document.body.appendChild(dom);
  html2canvas(appendix)
    .then((canvas) => {
      const img = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF();
      pdf.addImage(img, 'JPEG', 10, 10, 190, 275);
      return pdf.save('Kartu_Pendaftaran_LKIM.pdf');
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      window.location.reload();
    });
};
