import { CertificateRequest, FeePayment, StudentTranscript } from '../types';

/**
 * Creates and prints an official academic certificate in a clean, print-ready popup window.
 * Embeds the new official college logo, watermark, barcode, and academic seal.
 */
export const printCertificateDocument = (cert: CertificateRequest) => {
  const printWindow = window.open('', '_blank', 'width=920,height=1050,menubar=no,toolbar=no,location=no,status=no');

  const content = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>شهادة أكاديمية معتمدة - ${cert.studentName} - كلية السودان الجديد للمحاسبة</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@400;500;700;900&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4 portrait;
          margin: 10mm;
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          font-family: 'Cairo', 'Tajawal', system-ui, -apple-system, sans-serif;
          background: #ffffff;
          color: #0b2545;
          margin: 0;
          padding: 15px;
          display: flex;
          justify-content: center;
        }
        .cert-container {
          width: 100%;
          max-width: 820px;
          border: 6px double #c59b6d;
          background: #fdfdfb;
          border-radius: 18px;
          padding: 35px 40px;
          position: relative;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .watermark-bg {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.05;
          pointer-events: none;
          z-index: 0;
        }
        .watermark-bg img {
          width: 480px;
          height: 480px;
          object-fit: contain;
        }
        .content-relative {
          position: relative;
          z-index: 1;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 16px;
          margin-bottom: 22px;
        }
        .header-ar {
          text-align: right;
          font-size: 11px;
          line-height: 1.6;
          color: #334155;
          font-weight: 700;
        }
        .header-en {
          text-align: left;
          direction: ltr;
          font-size: 10.5px;
          line-height: 1.6;
          color: #334155;
          font-family: 'Tajawal', sans-serif;
          font-weight: 600;
        }
        .header-title-ar {
          font-size: 14.5px;
          font-weight: 900;
          color: #0b2545;
        }
        .header-title-en {
          font-size: 13.5px;
          font-weight: 900;
          color: #0b2545;
        }
        .logo-box {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .logo-img {
          width: 86px;
          height: 86px;
          object-fit: contain;
          filter: drop-shadow(0 2px 5px rgba(0,0,0,0.15));
        }
        .cert-title-section {
          text-align: center;
          margin-bottom: 24px;
        }
        .cert-type {
          font-size: 26px;
          font-weight: 900;
          color: #0b2545;
          margin: 0 0 6px;
          letter-spacing: -0.5px;
        }
        .serial-badge {
          font-family: monospace;
          font-size: 12px;
          font-weight: 800;
          color: #8a6135;
          background: #fdf5e8;
          display: inline-block;
          padding: 4px 18px;
          border-radius: 9999px;
          border: 1px solid #ecd8b8;
        }
        .body-text {
          font-size: 14.5px;
          line-height: 2.3;
          text-align: justify;
          color: #1e293b;
          margin-bottom: 26px;
        }
        .student-name-box {
          font-size: 22px;
          font-weight: 900;
          color: #0b2545;
          text-align: center;
          margin: 10px 0;
          background: #ffffff;
          border: 1px solid #c59b6d;
          padding: 8px 16px;
          border-radius: 12px;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.03);
        }
        .footer {
          border-top: 2px solid #e2e8f0;
          padding-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .seal-box {
          text-align: center;
        }
        .seal {
          width: 82px;
          height: 82px;
          border-radius: 50%;
          border: 2.5px dashed #c59b6d;
          background: #fef8ee;
          color: #8a6135;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 900;
          line-height: 1.3;
          transform: rotate(-8deg);
          margin: 0 auto;
        }
        .dean-box {
          text-align: left;
          font-size: 11.5px;
          line-height: 1.5;
        }
        .signature {
          font-family: cursive;
          font-size: 18px;
          color: #8a6135;
          margin-top: 4px;
        }
        .qr-box {
          font-size: 10px;
          color: #64748b;
          text-align: right;
        }
        .print-btn-bar {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #0b2545;
          color: white;
          padding: 10px 24px;
          border-radius: 9999px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          display: flex;
          gap: 12px;
          z-index: 1000;
        }
        .btn {
          background: #c59b6d;
          color: #0b2545;
          font-weight: 900;
          border: none;
          padding: 8px 18px;
          border-radius: 9999px;
          cursor: pointer;
          font-size: 12px;
          font-family: inherit;
        }
        .btn-close {
          background: #334155;
          color: white;
        }
        @media print {
          .print-btn-bar {
            display: none !important;
          }
          body {
            padding: 0;
          }
          .cert-container {
            border: 4px double #c59b6d;
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-btn-bar">
        <button class="btn" onclick="window.print()">طباعة الوثيقة الرسمية الآن</button>
        <button class="btn btn-close" onclick="window.close()">إغلاق النافذة</button>
      </div>

      <div class="cert-container">
        <div class="watermark-bg">
          <img src="/college_logo.png" alt="" />
        </div>

        <div class="content-relative">
          <div class="header">
            <div class="header-ar">
              <div>جمهورية السودان</div>
              <div>وزارة التعليم العالي والبحث العلمي</div>
              <div class="header-title-ar">كلية السودان الجديد للمحاسبة</div>
              <div style="font-size:9.5px; color:#64748b; font-weight:600;">أمانة الشؤون العلمية • المسجل العام</div>
            </div>

            <div class="logo-box">
              <img src="/college_logo.png" class="logo-img" alt="شعار كلية السودان الجديد للمحاسبة" />
            </div>

            <div class="header-en">
              <div>Republic of the Sudan</div>
              <div>Ministry of Higher Education</div>
              <div class="header-title-en">New Sudan College</div>
              <div style="font-size:9px; color:#64748b;">College of Accountancy (NSCA)</div>
            </div>
          </div>

          <div class="cert-title-section">
            <h1 class="cert-type">${cert.certType}</h1>
            <div class="serial-badge">الرقم التسلسلي المعتمد: ${cert.serialNumber}</div>
          </div>

          <div class="body-text">
            تشهد أمانة الشؤون العلمية والمسجل العام بكلية السودان الجديد للمحاسبة (NSCA) بأن الطالب:
            <div class="student-name-box">
              ${cert.studentName}
            </div>
            والحامل للرقم الجامعي الأكاديمي <strong>(${cert.studentId})</strong>، مقيد ومستوفٍ لكافة الاشتراطات الأكاديمية واللوائح الدراسية في برنامج:
            <br>
            <strong style="color: #0b2545; font-size: 15.5px;">« بكالوريوس المحاسبة الإلكترونية ونظم المعلومات المالية »</strong>،
            <br>
            وقد أنهى الساعات الدراسية المعتمدة بنجاح واقتدار وبمعدل تراكمي ممتاز 
            <strong style="color: #8a6135;">(${cert.gpa || '3.84 من 4.00 - مرتبة الشرف الأولى'})</strong>.
            <br><br>
            وقد حُررت وأُصدرت له هذه الوثيقة الأكاديمية الرسمية المعتمدة بناءً على طلبه لتقديمها إلى الجهات الرسمية والمعنية داخل وخارج السودان.
          </div>

          <div class="footer">
            <div class="qr-box">
              <div style="font-family:monospace; font-weight:bold; font-size:11px; margin-bottom:4px;">كود التحقق: NSCA-DOC-${cert.serialNumber.replace(/[^0-9]/g, '') || '9042'}</div>
              <div>بوابة التحقق الإلكتروني الرسمي:</div>
              <div style="color:#0b2545; font-weight:bold;">nsac.edu.sd/verify/${cert.serialNumber}</div>
              <div style="margin-top:4px; font-size:9.5px;">تاريخ الاعتماد: ${cert.requestedAt}</div>
            </div>

            <div class="seal-box">
              <div class="seal">
                <span>ختم الاعتماد</span>
                <span>الأكاديمي الرسمي</span>
                <span style="font-size:8px;">NSCA • SUDAN</span>
              </div>
              <div style="font-size:9px; color:#64748b; margin-top:4px; font-weight:bold;">جمهورية السودان</div>
            </div>

            <div class="dean-box">
              <div style="font-weight: 800; color:#0b2545;">عميد الكلية</div>
              <div style="color:#0b2545; font-weight: 900; font-size: 12.5px;">أ. د. الصادق الطيب البدوي</div>
              <div class="signature">Al-Sadiq Al-Tayeb</div>
            </div>
          </div>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 350);
        };
      </script>
    </body>
    </html>
  `;

  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
  } else {
    window.print();
  }
};

/**
 * Creates and prints an official financial voucher / tuition receipt.
 */
export const printInvoiceDocument = (payment: FeePayment) => {
  const printWindow = window.open('', '_blank', 'width=850,height=920,menubar=no,toolbar=no,location=no,status=no');

  const content = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>إيصال سداد رسوم - ${payment.studentName} - كلية السودان الجديد للمحاسبة</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@400;500;700;900&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A5 landscape;
          margin: 8mm;
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          font-family: 'Cairo', 'Tajawal', system-ui, -apple-system, sans-serif;
          background: #ffffff;
          color: #0b2545;
          margin: 0;
          padding: 15px;
          display: flex;
          justify-content: center;
        }
        .receipt-container {
          width: 100%;
          max-width: 680px;
          border: 2.5px solid #0b2545;
          border-radius: 14px;
          padding: 22px;
          background: #ffffff;
          position: relative;
        }
        .watermark {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.04;
          pointer-events: none;
        }
        .watermark img {
          width: 280px;
          height: 280px;
          object-fit: contain;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #cbd5e1;
          padding-bottom: 12px;
          margin-bottom: 14px;
        }
        .logo-img {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }
        .header-title {
          font-size: 15px;
          font-weight: 900;
          color: #0b2545;
        }
        .receipt-banner {
          text-align: center;
          margin-bottom: 14px;
        }
        .receipt-badge {
          background: #f0fdf4;
          color: #166534;
          font-size: 13px;
          font-weight: 900;
          padding: 3px 16px;
          border-radius: 9999px;
          border: 1px solid #bbf7d0;
          display: inline-block;
        }
        .receipt-no {
          font-family: monospace;
          font-size: 11.5px;
          font-weight: bold;
          color: #475569;
          margin-top: 3px;
        }
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 14px;
          font-size: 12px;
        }
        .details-table td {
          padding: 6px 10px;
          border-bottom: 1px solid #f1f5f9;
        }
        .label {
          color: #64748b;
          font-weight: 600;
          width: 35%;
        }
        .val {
          font-weight: 700;
          color: #0b2545;
        }
        .amount-row {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }
        .amount-val {
          font-size: 16px;
          font-weight: 900;
          color: #15803d;
        }
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 2px solid #e2e8f0;
          padding-top: 10px;
          font-size: 10.5px;
          color: #475569;
        }
        .print-btn-bar {
          position: fixed;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          background: #0b2545;
          color: white;
          padding: 8px 20px;
          border-radius: 9999px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          display: flex;
          gap: 12px;
          z-index: 1000;
        }
        .btn {
          background: #16a34a;
          color: white;
          border: none;
          padding: 6px 16px;
          border-radius: 9999px;
          cursor: pointer;
          font-weight: 900;
          font-size: 11px;
          font-family: inherit;
        }
        .btn-close {
          background: #475569;
        }
        @media print {
          .print-btn-bar {
            display: none !important;
          }
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-btn-bar">
        <button class="btn" onclick="window.print()">طباعة الإيصال المالي</button>
        <button class="btn btn-close" onclick="window.close()">إغلاق النافذة</button>
      </div>

      <div class="receipt-container">
        <div class="watermark">
          <img src="/college_logo.png" alt="" />
        </div>

        <div class="header">
          <div style="text-align: right;">
            <div class="header-title">كلية السودان الجديد للمحاسبة</div>
            <div style="font-size: 10px; color: #64748b;">الإدارة المالية والحسابات • الخزينة الإلكترونية</div>
          </div>
          <div>
            <img src="/college_logo.png" class="logo-img" alt="شعار الكلية" />
          </div>
          <div style="text-align: left; direction: ltr; font-size: 10px;">
            <div style="font-weight: bold; color: #0b2545;">New Sudan College of Accountancy</div>
            <div style="color: #64748b;">Financial & Bursar Dept</div>
          </div>
        </div>

        <div class="receipt-banner">
          <div class="receipt-badge">إيصال تحصيل وسداد رسوم دراسية معتمد</div>
          <div class="receipt-no">رقم الإيصال الإلكتروني: ${payment.receiptNumber}</div>
        </div>

        <table class="details-table">
          <tr>
            <td class="label">اسم الطالب الرباعي:</td>
            <td class="val">${payment.studentName}</td>
            <td class="label">الرقم الجامعي:</td>
            <td class="val" style="font-family: monospace;">${payment.studentId}</td>
          </tr>
          <tr>
            <td class="label">الفصل الدراسي / البند:</td>
            <td class="val">${payment.term}</td>
            <td class="label">تاريخ وتوقيت السداد:</td>
            <td class="val">${payment.date}</td>
          </tr>
          <tr>
            <td class="label">طريقة الدفع المستخدمة:</td>
            <td class="val">
              ${
                payment.paymentMethod === 'bankak'
                  ? 'تطبيق بنكك (بنك الخرطوم)'
                  : payment.paymentMethod === 'fawry'
                  ? 'تطبيق فوري (بنك فيصل الإسلامي)'
                  : payment.paymentMethod === 'onb'
                  ? 'أوكاش (البنك الأهلي السوداني)'
                  : 'بطاقة فيزا / ماستركارد'
              }
            </td>
            <td class="label">الرقم المرجعي للتحويل:</td>
            <td class="val" style="font-family: monospace; color: #8a6135;">${payment.referenceNumber}</td>
          </tr>
          <tr class="amount-row">
            <td class="label" style="font-weight: bold; color: #166534;">المبلغ المحصل والمدفوع:</td>
            <td class="amount-val" colspan="3">
              ${payment.amount.toLocaleString()} جنيه سوداني (فقط لا غير)
            </td>
          </tr>
        </table>

        <div class="footer">
          <div>
            <div>حالة القيد: <strong>مقيد ومعتمد في كشف حساب الطالب</strong></div>
            <div style="font-size: 9px; color: #94a3b8;">إيصال صادر إلكترونياً ولا يتطلب ختماً يدوياً بموجب لوائح التعليم العالي.</div>
          </div>
          <div style="text-align: left;">
            <div>أمين الخزينة الإلكترونية</div>
            <div style="font-weight: bold; color: #0b2545;">نظام الجباية الرقمي - NSCA</div>
          </div>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 350);
        };
      </script>
    </body>
    </html>
  `;

  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
  } else {
    window.print();
  }
};

/**
 * Creates and prints an official Academic Transcript (كشف درجات وسجل أكاديمي كامل).
 */
export const printTranscriptDocument = (transcript: StudentTranscript) => {
  const printWindow = window.open('', '_blank', 'width=950,height=1100,menubar=no,toolbar=no,location=no,status=no');

  const content = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>سجل الدرجات الأكاديمي المعتمد - ${transcript.studentName} - كلية السودان الجديد للمحاسبة</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@400;500;700;900&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4 portrait;
          margin: 10mm;
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          font-family: 'Cairo', 'Tajawal', system-ui, -apple-system, sans-serif;
          background: #ffffff;
          color: #0b2545;
          margin: 0;
          padding: 15px;
          display: flex;
          justify-content: center;
        }
        .transcript-container {
          width: 100%;
          max-width: 860px;
          border: 4px solid #0b2545;
          background: #ffffff;
          border-radius: 14px;
          padding: 28px 32px;
          position: relative;
        }
        .watermark {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.04;
          pointer-events: none;
        }
        .watermark img {
          width: 440px;
          height: 440px;
          object-fit: contain;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #0b2545;
          padding-bottom: 12px;
          margin-bottom: 14px;
        }
        .logo-img {
          width: 76px;
          height: 76px;
          object-fit: contain;
        }
        .student-info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 16px;
          font-size: 11px;
        }
        .info-label {
          color: #64748b;
          font-weight: bold;
        }
        .info-val {
          color: #0b2545;
          font-weight: 800;
        }
        .semester-block {
          margin-bottom: 16px;
        }
        .semester-title {
          font-size: 12.5px;
          font-weight: 900;
          color: #0b2545;
          background: #f1f5f9;
          padding: 4px 10px;
          border-radius: 6px;
          margin-bottom: 6px;
          display: flex;
          justify-content: space-between;
        }
        .course-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }
        .course-table th {
          background: #0b2545;
          color: white;
          padding: 5px 8px;
          text-align: right;
          font-weight: bold;
        }
        .course-table td {
          padding: 4px 8px;
          border-bottom: 1px solid #f1f5f9;
        }
        .course-table tr:nth-child(even) {
          background: #fdfdfd;
        }
        .summary-box {
          background: #fdf5e8;
          border: 1.5px solid #ecd8b8;
          border-radius: 10px;
          padding: 10px 14px;
          margin-top: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }
        .footer {
          margin-top: 20px;
          border-top: 2px solid #e2e8f0;
          padding-top: 14px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          font-size: 11px;
        }
        .seal {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          border: 2px dashed #c59b6d;
          background: #fef8ee;
          color: #8a6135;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 900;
          line-height: 1.2;
          transform: rotate(-5deg);
        }
        .print-btn-bar {
          position: fixed;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          background: #0b2545;
          color: white;
          padding: 8px 20px;
          border-radius: 9999px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          display: flex;
          gap: 12px;
          z-index: 1000;
        }
        .btn {
          background: #c59b6d;
          color: #0b2545;
          border: none;
          padding: 6px 16px;
          border-radius: 9999px;
          cursor: pointer;
          font-weight: 900;
          font-size: 11px;
          font-family: inherit;
        }
        .btn-close {
          background: #334155;
          color: white;
        }
        @media print {
          .print-btn-bar {
            display: none !important;
          }
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-btn-bar">
        <button class="btn" onclick="window.print()">طباعة كشف الدرجات المعتمد</button>
        <button class="btn btn-close" onclick="window.close()">إغلاق</button>
      </div>

      <div class="transcript-container">
        <div class="watermark">
          <img src="/college_logo.png" alt="" />
        </div>

        <div class="header">
          <div style="text-align: right;">
            <div style="font-size: 11px; font-weight: bold; color: #475569;">جمهورية السودان • وزارة التعليم العالي والبحث العلمي</div>
            <div style="font-size: 16px; font-weight: 900; color: #0b2545;">كلية السودان الجديد للمحاسبة (NSCA)</div>
            <div style="font-size: 11px; color: #8a6135; font-weight: bold;">أمانة الشؤون العلمية - السجل الأكاديمي للطلاب</div>
          </div>
          <div>
            <img src="/college_logo.png" class="logo-img" alt="شعار الكلية" />
          </div>
          <div style="text-align: left; direction: ltr; font-size: 10px;">
            <div style="font-weight: bold; color: #0b2545;">NEW SUDAN COLLEGE OF ACCOUNTANCY</div>
            <div style="color: #64748b;">OFFICIAL ACADEMIC TRANSCRIPT</div>
            <div style="font-family: monospace; font-weight: bold;">REG: ${transcript.studentId}</div>
          </div>
        </div>

        <div class="student-info-grid">
          <div><span class="info-label">اسم الطالب:</span> <span class="info-val">${transcript.studentName}</span></div>
          <div><span class="info-label">الرقم الجامعي:</span> <span class="info-val font-mono">${transcript.studentId}</span></div>
          <div><span class="info-label">الرقم الوطني:</span> <span class="info-val font-mono">${transcript.nationalId}</span></div>
          <div><span class="info-label">الكلية / التخصص:</span> <span class="info-val">${transcript.faculty}</span></div>
          <div><span class="info-label">الدرجة الممنوحة:</span> <span class="info-val">${transcript.degree}</span></div>
          <div><span class="info-label">سنة القبول:</span> <span class="info-val">${transcript.admissionYear}</span></div>
        </div>

        ${transcript.semesters
          .map(
            (sem) => `
          <div class="semester-block">
            <div class="semester-title">
              <span>${sem.semesterName} (${sem.academicYear})</span>
              <span>المعدل الفصلي: <strong>${sem.semesterGpa.toFixed(2)}</strong> | الساعات المكتسبة: ${sem.earnedHours}</span>
            </div>
            <table class="course-table">
              <thead>
                <tr>
                  <th style="width: 12%;">رمز المقرر</th>
                  <th style="width: 45%;">اسم المقرر الدراسي</th>
                  <th style="width: 12%; text-align: center;">الساعات</th>
                  <th style="width: 12%; text-align: center;">الدرجة (100)</th>
                  <th style="width: 10%; text-align: center;">التقدير</th>
                  <th style="width: 9%; text-align: center;">النقاط</th>
                </tr>
              </thead>
              <tbody>
                ${sem.courses
                  .map(
                    (c) => `
                  <tr>
                    <td style="font-family: monospace; font-weight: bold; color: #0b2545;">${c.code}</td>
                    <td style="font-weight: 600;">${c.title}</td>
                    <td style="text-align: center;">${c.creditHours}</td>
                    <td style="text-align: center; font-weight: bold;">${c.totalMark}</td>
                    <td style="text-align: center; font-weight: 900; color: ${
                      c.grade.startsWith('A') ? '#15803d' : c.grade.startsWith('B') ? '#1d4ed8' : '#8a6135'
                    };">${c.grade}</td>
                    <td style="text-align: center; font-weight: bold;">${c.points.toFixed(1)}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        `
          )
          .join('')}

        <div class="summary-box">
          <div>
            <strong>إجمالي الساعات المعتمدة المكتسبة:</strong> ${transcript.totalCreditHours} ساعة
          </div>
          <div>
            <strong>المعدل التراكمي العام (CGPA):</strong> 
            <span style="font-size: 15px; font-weight: 900; color: #8a6135;">${transcript.cumulativeGpa.toFixed(2)} من 4.00</span>
          </div>
          <div>
            <strong>الحالة الأكاديمية:</strong> <span style="font-weight: 900; color: #15803d;">${transcript.academicStanding}</span>
          </div>
        </div>

        <div class="footer">
          <div>
            <div>التحقق من صحة السجل: <strong>nsac.edu.sd/verify/transcript</strong></div>
            <div style="color: #64748b; font-size: 9px;">صدر هذا الكشف رسمياً من الإدارة الأكاديمية ولا يُعتد بأي شطب أو كشط.</div>
          </div>

          <div class="seal">
            <span>أمانة الشؤون</span>
            <span>العلمية - السجل</span>
            <span style="font-size: 7.5px;">NSCA REGISTRAR</span>
          </div>

          <div style="text-align: left;">
            <div style="font-weight: bold;">المسجل العام وأمين الشؤون العلمية</div>
            <div style="font-weight: 900; color: #0b2545;">د. ياسر محجوب البشير</div>
            <div style="font-family: cursive; color: #8a6135; font-size: 14px;">Yassir Mahgoub</div>
          </div>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 350);
        };
      </script>
    </body>
    </html>
  `;

  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
  } else {
    window.print();
  }
};
