import type { Mission, MissionAttempt, User } from '../types';

// jsPDF is loaded from CDN in index.html, so we need to declare it globally
declare const jspdf: any;

export const generateMissionReport = (user: User, mission: Mission, attempt: MissionAttempt) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

  // Main Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(23, 37, 84); // UR Dark Blue
  doc.text('Universidad del Rosario', 105, 20, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(0, 178, 204); // Cyan
  doc.text('UR Steam', 105, 30, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(45, 55, 72); // Dark Gray
  doc.text('Taller de innovación - Fabricación aditiva', 105, 38, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Gray
  doc.text(date, 105, 45, { align: 'center' });

  doc.setLineWidth(0.5);
  doc.line(20, 50, 190, 50);

  // Section styling
  const sectionTitle = (text: string, y: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 128, 153); // Darker Cyan
    doc.text(text, 20, y);
  };

  const bodyText = (text: string | string[], y: number) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(74, 85, 104); // Medium Gray
    doc.text(text, 20, y);
  };
  
  let currentY = 60;

  // Student Info Section
  sectionTitle('Información del Estudiante', currentY);
  currentY += 8;
  bodyText([
    `Nombre: ${user.username}`,
    `Correo: ${user.email}`,
    `Carrera: ${user.major}`,
    `Asignatura: ${user.course}`,
  ], currentY);
  currentY += 25;

  // Project Report Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(45, 55, 72); // Dark Gray
  doc.text('REPORTE DE PROYECTO', 105, currentY, { align: 'center' });
  currentY += 8;
  doc.setFontSize(16);
  doc.text(mission.title, 105, currentY, { align: 'center' });
  currentY += 8;
  doc.setLineWidth(0.2);
  doc.line(20, currentY, 190, currentY);
  currentY += 10;

  // Ideation Section
  if (attempt.ideation) {
    sectionTitle('Fase de Ideación', currentY);
    currentY += 8;
    
    doc.setFont('helvetica', 'bold');
    bodyText('¿A quién va dirigido el proyecto?', currentY);
    currentY += 6;
    doc.setFont('helvetica', 'normal');
    bodyText(doc.splitTextToSize(attempt.ideation.userAnalysis, 170), currentY);
    currentY += 15;

    doc.setFont('helvetica', 'bold');
    bodyText('¿En qué lugares y situaciones se puede implementar?', currentY);
    currentY += 6;
    doc.setFont('helvetica', 'normal');
    bodyText(doc.splitTextToSize(attempt.ideation.contextAnalysis, 170), currentY);
    currentY += 15;

    doc.setFont('helvetica', 'bold');
    bodyText('Descripción de la Idea:', currentY);
    currentY += 6;
    doc.setFont('helvetica', 'normal');
    bodyText(doc.splitTextToSize(attempt.ideation.ideaDescription, 170), currentY);
    currentY += 20;

    if (attempt.ideation.sketchDataUrl) {
      if (currentY > 210) { doc.addPage(); currentY = 20; }
      sectionTitle('Boceto de la Idea', currentY);
      currentY += 8;
      try {
        const url = attempt.ideation.sketchDataUrl;
        const formatMatch = url.match(/data:image\/(jpeg|jpg|png);/);
        const format = formatMatch ? formatMatch[1].toUpperCase() : 'JPEG';
        doc.addImage(url, format, 20, currentY, 80, 60);
      } catch (e) {
        console.error("Error adding image to PDF:", e);
        bodyText("No se pudo cargar la imagen del boceto.", currentY);
      }
      currentY += 70; // Add space for the image
    }
  }

  if (currentY > 220) { doc.addPage(); currentY = 20; }

  // Print Parameters
  sectionTitle('Parámetros de Impresión', currentY);
  currentY += 8;
  bodyText([
    `Material: ${attempt.material}`,
    `Altura de Capa: ${attempt.layerHeight.toFixed(2)} mm`,
    `Relleno (Infill): ${attempt.infill}%`,
    `Velocidad de Impresión: ${attempt.printSpeed} mm/s`,
    `Soportes: ${attempt.supports ? 'Sí' : 'No'}`,
    `Adhesión de Cama: ${attempt.bedAdhesion}`,
  ], currentY);
  currentY += 40;
  
  // Slicer Screenshot
  if (attempt.slicerScreenshotDataUrl) {
      if (currentY > 210) { doc.addPage(); currentY = 20; }
      sectionTitle('Captura del Proceso de Laminado (Slicing)', currentY);
      currentY += 8;
      try {
        const url = attempt.slicerScreenshotDataUrl;
        const formatMatch = url.match(/data:image\/(jpeg|jpg|png);/);
        const format = formatMatch ? formatMatch[1].toUpperCase() : 'JPEG';
        doc.addImage(url, format, 20, currentY, 100, 75);
      } catch (e) {
        console.error("Error adding slicer image to PDF:", e);
        bodyText("No se pudo cargar la imagen del laminado.", currentY);
      }
      currentY += 85; // Add space for the image
  }

  if (currentY > 240) { doc.addPage(); currentY = 20; }

  // Result
  sectionTitle('Resultado del Análisis del Modelo', currentY);
  currentY += 8;
  bodyText(attempt.printSuccessful ? 'MODELO APTO PARA FABRICACIÓN' : 'MODELO NO APTO - SE REQUIEREN AJUSTES', currentY);
  currentY += 15;

  // Score
  sectionTitle('Puntos de Innovación (PI)', currentY);
  currentY += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(0, 178, 204);
  doc.text(`${attempt.score} PI`, 20, currentY);
  
  // Make sure we have space for the footer
  if (currentY > 260) {
    doc.addPage();
    currentY = 20;
  }

  // Footer
  const finalY = doc.internal.pageSize.height - 20;
  doc.setLineWidth(0.5);
  doc.line(20, finalY - 5, 190, finalY - 5);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text('Cada prototipo es una semilla de innovación. ¡Riega tu creatividad y verás florecer tus ideas!', 105, finalY, { align: 'center' });

  // Save the PDF
  doc.save(`Reporte_Proyecto_${mission.id}_${user.username}.pdf`);
};