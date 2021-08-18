import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { showToast } from '../store/toast/actions';

export const printPdf = (dom: HTMLElement) => {
  const appendix = document.body.appendChild(dom);
  showToast({
    message: 'Sedang memproses dokumen',
  });
  setTimeout(() => {
    html2canvas(appendix)
      .then((canvas) => {
        const img = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();
        pdf.addImage(img, 'JPEG', 0, 0, width, height);
        return pdf.save('Kartu_Pendaftaran_LKIM.pdf');
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        window.location.reload();
      });
  }, 10);
};
