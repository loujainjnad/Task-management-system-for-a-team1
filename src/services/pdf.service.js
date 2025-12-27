const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * PDF Service
 * خدمة تصدير التقارير إلى PDF
 */

/**
 * Generate Tasks PDF Report
 * إنشاء تقرير PDF للمهام
 */
const generateTasksPDF = async (tasks, projectName = null) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // العنوان
      doc.fontSize(20).text('تقرير المهام', { align: 'right' });
      doc.moveDown();

      if (projectName) {
        doc.fontSize(16).text(`المشروع: ${projectName}`, { align: 'right' });
        doc.moveDown();
      }

      doc.fontSize(12).text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}`, {
        align: 'right',
      });
      doc.moveDown(2);

      // جدول المهام
      tasks.forEach((task, index) => {
        doc.fontSize(14).text(`${index + 1}. ${task.title}`, { align: 'right' });
        doc.fontSize(10).text(`الحالة: ${task.status}`, { align: 'right' });
        doc.fontSize(10).text(`الأولوية: ${task.priority}`, { align: 'right' });
        if (task.description) {
          doc.fontSize(10).text(`الوصف: ${task.description}`, { align: 'right' });
        }
        doc.moveDown();
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate Project PDF Report
 * إنشاء تقرير PDF للمشروع
 */
const generateProjectPDF = async (project, tasks) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // معلومات المشروع
      doc.fontSize(20).text('تقرير المشروع', { align: 'right' });
      doc.moveDown();

      doc.fontSize(16).text(`اسم المشروع: ${project.name}`, { align: 'right' });
      doc.moveDown();

      if (project.description) {
        doc.fontSize(12).text(`الوصف: ${project.description}`, { align: 'right' });
        doc.moveDown();
      }

      doc.fontSize(12).text(`تاريخ البداية: ${new Date(project.startDate).toLocaleDateString('ar-SA')}`, {
        align: 'right',
      });
      doc.fontSize(12).text(`تاريخ الانتهاء: ${new Date(project.endDate).toLocaleDateString('ar-SA')}`, {
        align: 'right',
      });
      doc.fontSize(12).text(`الحالة: ${project.status}`, { align: 'right' });
      doc.fontSize(12).text(`التقدم: ${project.progress}%`, { align: 'right' });
      doc.moveDown(2);

      // المهام
      doc.fontSize(16).text('المهام', { align: 'right' });
      doc.moveDown();

      tasks.forEach((task, index) => {
        doc.fontSize(14).text(`${index + 1}. ${task.title}`, { align: 'right' });
        doc.fontSize(10).text(`الحالة: ${task.status}`, { align: 'right' });
        doc.fontSize(10).text(`الأولوية: ${task.priority}`, { align: 'right' });
        doc.moveDown();
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateTasksPDF,
  generateProjectPDF,
};

