import React from 'react';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {  Button } from "@material-ui/core";

const GenericPdfDownloader = ({rootElementId , downloadFileName}) => {

    const downloadPdfDocument = () => {
        const input = document.getElementById(rootElementId);
        html2canvas(input,{scrollY: -window.scrollY})
            .then((canvas) => {
                
                const imgData = canvas.toDataURL('image/png' ,1.0);
                const pdf = new jsPDF('p', 'mm', 'a4');
                pdf.html(input, { html2canvas: { scale: 0.57 } });
                const imgProps= pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pageHeight= pdf.internal.pageSize.getHeight();
                pdf.setFillColor("#FFFFFF");
                pdf.rect(0, 0, 210, 700, "F");

                    let widthRatio = pdfWidth / canvas.width
                    let heightRatio = pageHeight / canvas.height
                    let ratio = widthRatio > heightRatio ? heightRatio : widthRatio

                // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'JPEG', 10, 0,192,canvas.height * ratio);
                pdf.save(`${downloadFileName}.pdf`);
            })
    }

    return <Button color="secondary" variant="contained"onClick={downloadPdfDocument}>Download Pdf</Button>

}

export default GenericPdfDownloader;