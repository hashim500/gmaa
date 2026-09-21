import {
  User,
  Lecture,
  Assignment,
  Submission,
  Quiz,
  QuizResult,
  CertificateRequest,
  FeePayment,
  Announcement,
  ScheduleItem,
} from '../types';

export const DEMO_USERS: Record<string, User> = {
  student: {
    id: 'std-104',
    name: 'محمد أحمد عثمان إدريس',
    email: 'mohamed.ahmed@nsac.edu.sd',
    role: 'student',
    studentId: 'NSAC-2023-104',
    department: 'المحاسبة الإلكترونية ونظم المعلومات',
    level: 'المستوى الثالث - بكالوريوس',
    phone: '+249 912 345 678',
  },
  instructor: {
    id: 'inst-1',
    name: 'د. عبد الله النور كباشي',
    email: 'abdullah.alnour@nsac.edu.sd',
    role: 'instructor',
    department: 'قسم نظم المعلومات المحاسبية والتجارة الإلكترونية',
    level: 'أستاذ المحاسبة المشارك',
    phone: '+249 911 223 344',
  },
  admin: {
    id: 'adm-1',
    name: 'أ. د. الصادق الطيب البدوي',
    email: 'admin@nsac.edu.sd',
    role: 'admin',
    department: 'أمانة الشؤون العلمية والمسجل العام',
    level: 'عميد الكلية',
    phone: '+249 912 000 111',
  },
};

export function extractYouTubeVideoId(url: string): string {
  if (!url) return '';
  // Test common patterns
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  if (match && match[1]) {
    return match[1];
  }
  // If user pasted just the 11-char ID
  if (/^[\w-]{11}$/.test(url.trim())) {
    return url.trim();
  }
  // Default fallback video (Accounting lecture)
  return 'xP6eR0tZ5g4';
}

const DEFAULT_LECTURES: Lecture[] = [
  {
    id: 'lec-1',
    title: 'المحاضرة (1): تسجيل العمليات والقيود في بيئة التجارة الإلكترونية',
    course: 'المحاسبة في بيئة التجارة الإلكترونية',
    instructor: 'د. عبد الله النور كباشي',
    date: '2026-09-22',
    time: '04:00 مساءً',
    duration: '45 دقيقة',
    youtubeUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    videoId: 'M7lc1UVf-VE',
    isLive: true,
    description: 'شرح تفصيلي لمعالجة بوابات الدفع الإلكتروني، تسوية المبيعات الرقمية، وحساب عمولات المحافظ الإلكترونية وفق معايير المحاسبة المعتمدة.',
    resources: [
      { name: 'سلايدات_المحاضرة_الأولى.pdf', url: '#', size: '2.4 ميجابايت' },
      { name: 'نموذج_قيود_اليومية_الإلكترونية.xlsx', url: '#', size: '480 كيلوبايت' },
    ],
  },
  {
    id: 'lec-2',
    title: 'المحاضرة (2): تصميم وتطبيق نظم المعلومات المحاسبية (AIS)',
    course: 'نظم المعلومات المحاسبية (AIS)',
    instructor: 'د. فاطمة عمر الفاضل',
    date: '2026-09-20',
    time: '10:00 صباحاً',
    duration: '55 دقيقة',
    youtubeUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    videoId: 'ysz5S6PUM-U',
    isLive: false,
    description: 'مكونات دورة العمليات المحاسبية، تصميم مخططات تدفق البيانات (DFD)، والرقابة الداخلية في الأنظمة المالية المؤتمتة.',
    resources: [
      { name: 'دليل_نظم_المعلومات_المحاسبية.pdf', url: '#', size: '3.1 ميجابايت' },
    ],
  },
  {
    id: 'lec-3',
    title: 'المحاضرة (3): المعايير الدولية لإعداد التقارير المالية (IFRS 15 - الإيرادات)',
    course: 'المعايير الدولية (IFRS)',
    instructor: 'أ. طارق التجاني بابكر',
    date: '2026-09-18',
    time: '02:00 ظهراً',
    duration: '60 دقيقة',
    youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    videoId: 'kJQP7kiw5Fk',
    isLive: false,
    description: 'النموذج الخماسي للاعتراف بالإيراد من العقود مع العملاء وتطبيقاته العملية في الشركات والمؤسسات السودانية.',
    resources: [
      { name: 'حالات_عملية_معيار_IFRS_15.pdf', url: '#', size: '1.8 ميجابايت' },
    ],
  },
  {
    id: 'lec-4',
    title: 'المحاضرة (4): مراجعة وتدقيق الحسابات الرقمية والأمن المالي',
    course: 'المراجعة والتدقيق المالي',
    instructor: 'د. عبد الله النور كباشي',
    date: '2026-09-15',
    time: '06:00 مساءً',
    duration: '50 دقيقة',
    youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    videoId: 'fJ9rUzIMcZQ',
    isLive: false,
    description: 'أدوات التدقيق بمساعدة الحاسوب (CAATs)، ومراجعة سلامة السجلات في قواعد بيانات السحاب المحاسبية.',
    resources: [
      { name: 'مذكرة_التدقيق_الرقمي.pdf', url: '#', size: '2.0 ميجابايت' },
    ],
  },
];

const getRelativeDeadline = (hours: number): string => {
  const d = new Date(Date.now() + hours * 3600 * 1000);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${h}:${m}`;
};

const DEFAULT_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-urgent-1',
    title: 'واجب عاجل: التسوية الضريبية وإعداد الإقرار الضريبي الموحد لعام 2026',
    course: 'المحاسبة الضريبية والزكاة بالسودان',
    instructor: 'د. عبد الله النور كباشي',
    dueDate: getRelativeDeadline(26), // In ~26 hours (Next 48 Hours)
    maxScore: 20,
    description: 'المطلوب احتساب وعاء ضريبة أرباح الأعمال وإعداد جدول التسوية بين الربح المحاسبي والربح الضريبي المعترف به من ديوان الضرائب السوداني.',
    instructions: 'تنبيه عاجل: المهلة النهائية تنتهي خلال أقل من 48 ساعة. يرجى تسليم الحل بصيغة PDF أو جدول Excel المالي.',
    format: 'document',
    mediaType: 'document',
    mediaTitle: 'جدول_الإقرار_الضريبي_الموحد.xlsx',
    attachments: ['تعليمات_ديوان_الضرائب_السوداني.pdf'],
    createdAt: '2026-09-20',
  },
  {
    id: 'asg-urgent-2',
    title: 'تطبيق عملي: قيود التسوية وإعادة تقييم الأصول الثابتة (IAS 16)',
    course: 'المعايير الدولية (IFRS)',
    instructor: 'أ. طارق التجاني بابكر',
    dueDate: getRelativeDeadline(42), // In ~42 hours (Next 48 Hours)
    maxScore: 15,
    description: 'احتساب قسط الاهتلاك السنوي وإثبات فائض إعادة التقييم في الدفاتر المحاسبية وميزان المراجعة لشركة النيل.',
    instructions: 'مهلة التسليم تنتهي خلال 48 ساعة. يُقبل الحل كمستند Word أو PDF أو صورة واضحة لدفتر اليومية.',
    format: 'document',
    mediaType: 'document',
    mediaTitle: 'بيانات_حالة_أصول_شركة_النيل.pdf',
    attachments: ['معطيات_إعادة_تقييم_الأصول.pdf'],
    createdAt: '2026-09-21',
  },
  {
    id: 'asg-1',
    title: 'الواجب الثاني: معالجة التسويات البنكية ومبيعات المتاجر الإلكترونية',
    course: 'المحاسبة في بيئة التجارة الإلكترونية',
    instructor: 'د. عبد الله النور كباشي',
    dueDate: '2026-09-28',
    maxScore: 20,
    description: 'قم بإعداد مذكرة التسوية البنكية لحساب شركة النيل للتجارة الإلكترونية ومطابقة المقبوضات عبر تطبيق بنكك وتطبيق فوري مع السجلات المحاسبية.',
    instructions: 'يجب تقديم الحل في ملف PDF أو Word أو صورة واضحة للجداول المحاسبية أو تسجيل فيديو لشرح القيود.',
    format: 'document',
    mediaType: 'document',
    mediaTitle: 'كشف_حساب_البنك_والسجلات_المحاسبية.pdf',
    attachments: ['بيانات_حالة_الدراسة_العملية.pdf'],
    createdAt: '2026-09-18',
  },
  {
    id: 'asg-2',
    title: 'الواجب الأول: تحليل مخطط تدفق البيانات (DFD) لدورة المشتريات والمخازن',
    course: 'نظم المعلومات المحاسبية (AIS)',
    instructor: 'د. فاطمة عمر الفاضل',
    dueDate: '2026-09-25',
    maxScore: 15,
    description: 'استعرض الصورة المرفقة لمخطط تدفق العمليات المحاسبية، وحدد نقاط الضعف في الرقابة الداخلية وإجراءات الفصل بين المهام.',
    instructions: 'يُرجى تدقيق الرسم التوضيحي المرفق وتقديم الحل مع تفصيل الإجراءات التصحيحية.',
    format: 'image',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1000&auto=format&fit=crop&q=80',
    mediaTitle: 'مخطط_الرقابة_الداخلية_ودورة_المشتريات.png',
    attachments: ['مخطط_DFD_الرقابة_المحاسبية.png'],
    createdAt: '2026-09-15',
  },
  {
    id: 'asg-3',
    title: 'تطبيق عملي مرئي: المعايير الدولية لإعداد التقارير المالية (IFRS 15)',
    course: 'المعايير الدولية (IFRS)',
    instructor: 'أ. طارق التجاني بابكر',
    dueDate: '2026-10-02',
    maxScore: 25,
    description: 'شاهد المقطع الإثرائي المرفق حول التطبيق الخماسي للاعتراف بالإيراد في عقود الخدمات البرمجية وقدم تحليلاً محاسبياً للنموذج.',
    instructions: 'يمكن للطالب الإجابة بملف PDF أو Word أو تسجيل فيديو توضيحي للقيود المحاسبية.',
    format: 'video',
    mediaType: 'video',
    mediaUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    mediaTitle: 'شرح_مرئي_تطبيقات_معيار_IFRS_15',
    createdAt: '2026-09-20',
  },
  {
    id: 'asg-4',
    title: 'سؤال نقاش مفاهيمي: أسس الفصل بين الأصول الرأسمالية والمصروفات الإيرادية',
    course: 'المراجعة والتدقيق المالي',
    instructor: 'د. عبد الله النور كباشي',
    dueDate: '2026-10-08',
    maxScore: 10,
    description: 'اكتب تحليلاً نصياً مختصراً عن المعيار المحاسبي الفاصل بين اعتبار تكاليف صيانة أنظمة الحوسبة السحابية كمصروف دوري أو رسملتها كأصل غير ملموس.',
    instructions: 'الإجابة نصية مباشرة في خانة الملاحظات الأكاديمية أو إرفاق ملف مستند.',
    format: 'text_only',
    mediaType: 'none',
    createdAt: '2026-09-21',
  },
];

const DEFAULT_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    assignmentId: 'asg-1',
    assignmentTitle: 'الواجب الثاني: معالجة التسويات البنكية ومبيعات المتاجر الإلكترونية',
    course: 'المحاسبة في بيئة التجارة الإلكترونية',
    studentId: 'NSAC-2023-104',
    studentName: 'محمد أحمد عثمان إدريس',
    submissionDate: '2026-09-21 01:15',
    notes: 'تم إعداد التسوية البنكية وحساب عمولات بنك الخرطوم (تطبيق بنكك) بدقة تامة، مع توثيق قيود التسوية.',
    submissionType: 'document',
    fileName: 'حل_واجب_التسويات_محمد_احمد.pdf',
    fileSize: '1.4 ميجابايت',
    status: 'submitted',
  },
  {
    id: 'sub-2',
    assignmentId: 'asg-2',
    assignmentTitle: 'الواجب الأول: تحليل مخطط تدفق البيانات (DFD) لدورة المشتريات والمخازن',
    course: 'نظم المعلومات المحاسبية (AIS)',
    studentId: 'NSAC-2023-104',
    studentName: 'محمد أحمد عثمان إدريس',
    submissionDate: '2026-09-17 14:30',
    notes: 'تم فحص المخطط التوضيحي ورسم الهيكل التصحيحي في صورة تفصيلية توضح نقاط الفصل بين المهام.',
    submissionType: 'image',
    fileName: 'مخطط_تصحيح_الرقابة_محمد_احمد.jpg',
    mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80',
    fileSize: '890 كيلوبايت',
    status: 'graded',
    score: 14.5,
    feedback: 'عمل ممتاز ومنظم جداً يا محمد! تميزت في توضيح نقاط الرقابة الداخلية وفصل المهام بين قسم المشتريات والحسابات.',
    gradedAt: '2026-09-19 11:00',
    gradedBy: 'د. فاطمة عمر الفاضل',
  },
  {
    id: 'sub-3',
    assignmentId: 'asg-3',
    assignmentTitle: 'تطبيق عملي مرئي: المعايير الدولية لإعداد التقارير المالية (IFRS 15)',
    course: 'المعايير الدولية (IFRS)',
    studentId: 'NSAC-2023-112',
    studentName: 'سارة إبراهيم حسن',
    submissionDate: '2026-09-20 18:20',
    notes: 'تم إعداد مقطع فيديو توضيحي يستعرض الخطوات الخمس للاعتراف بالإيراد مع أمثلة من واقع الشركات بالسودان.',
    submissionType: 'video',
    fileName: 'شرح_مرئي_معيار_IFRS15_سارة.mp4',
    mediaUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    fileSize: '18.4 ميجابايت',
    status: 'graded',
    score: 24,
    feedback: 'شرح استثنائي وتقديم احترافي يعكس استيعاباً عميقاً لالتزامات الأداء وتحديد سعر المعاملة.',
    gradedAt: '2026-09-20 21:00',
    gradedBy: 'أ. طارق التجاني بابكر',
  },
];

const DEFAULT_QUIZZES: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'الاختبار القصير: أساسيات نظم المعلومات المحاسبية والمعايير الدولية',
    course: 'نظم المعلومات المحاسبية (AIS)',
    durationMinutes: 15,
    totalScore: 20,
    createdAt: '2026-09-19',
    questions: [
      {
        id: 'q1',
        text: 'ما هي الخطوة الأولى في دورة معالجة المعاملات المالية داخل نظام المعلومات المحاسبي؟',
        options: [
          'إعداد القوائم المالية الختامية',
          'التقاط وإدخال بيانات المستندات الأصلية (Source Documents)',
          'ترحيل القيود إلى دفتر الأستاذ العام',
          'مراجعة ميزان المراجعة المعدل',
        ],
        correctOption: 1,
        points: 5,
      },
      {
        id: 'q2',
        text: 'وفقاً لمعيار IFRS 15، متى يتم الاعتراف بالإيراد من العقود مع العملاء؟',
        options: [
          'عند توقيع العقد المبدئي فوراً',
          'عند استلام النقدية فقط دون النظر للتسليم',
          'عند الوفاء بالتزام الأداء (Performance Obligation) ونقل السيطرة للعميل',
          'في نهاية السنة المالية بغض النظر عن التنفيذ',
        ],
        correctOption: 2,
        points: 5,
      },
      {
        id: 'q3',
        text: 'أي من العناصر التالية يمثل خط الدفاع الأساسي في الرقابة الداخلية على برمجيات المحاسبة؟',
        options: [
          'فصل المسؤوليات (Segregation of Duties) وصلاحيات الوصول',
          'استخدام خطوط خطية متطابقة في التقارير',
          'إيقاف النسخ الاحتياطي لتوفير المساحة',
          'السماح لجميع الموظفين بتعديل ميزان المراجعة',
        ],
        correctOption: 0,
        points: 5,
      },
      {
        id: 'q4',
        text: 'ما هو القيد الصحيح لإثبات مبيعات عبر الإنترنت بـ 100,000 ج.س مع عمولة دفع إلكتروني 2%؟',
        options: [
          'من حـ/ النقدية بالبنك (98,000) وحـ/ مصروف عمولة (2,000) إلى حـ/ المبيعات (100,000)',
          'من حـ/ المبيعات (100,000) إلى حـ/ النقدية بالبنك (100,000)',
          'من حـ/ النقدية بالبنك (102,000) إلى حـ/ المبيعات (102,000)',
          'من حـ/ المدينين (100,000) إلى حـ/ الأرباح والخسائر (100,000)',
        ],
        correctOption: 0,
        points: 5,
      },
    ],
  },
];

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'جدول امتحانات منتصف الفصل الدراسي الثاني لعام 2026',
    content: 'تعلن أمانة الشؤون العلمية عن بدء امتحانات منتصف الفصل لجميع المستويات الأكاديمية اعتباراً من 10 أكتوبر 2026 عبر قاعات الاختبارات المحوسبة والمنصة الإلكترونية.',
    date: '2026-09-21',
    department: 'أمانة الشؤون العلمية',
    isUrgent: true,
    category: 'exams',
  },
  {
    id: 'ann-2',
    title: 'تفعيل خدمة السداد الفوري للرسوم عبر تطبيق بنكك وفوري',
    content: 'يسر الإدارة المالية الإعلان عن ربط نظام الرسوم مباشرة مع بنك الخرطوم (بنكك) وبنك فيصل الإسلامي (فوري) لتأكيد التسجيل تلقائياً خلال دقائق بمجرد إدخال رقم العملية.',
    date: '2026-09-20',
    department: 'الإدارة المالية والمصرفية',
    isUrgent: false,
    category: 'financial',
  },
  {
    id: 'ann-3',
    title: 'افتتاح المكتبة المحاسبية الرقمية وقواعد بيانات IFRS',
    content: 'أصبح بإمكان طلاب وأساتذة كلية السودان الجديد للمحاسبة الدخول مجاناً إلى مستودع المراجع والمعايير المحاسبية العالمية المنقحة لعام 2026.',
    date: '2026-09-18',
    department: 'شؤون الطلاب والمكتبة المركزية',
    isUrgent: false,
    category: 'academic',
  },
];

const DEFAULT_CERTIFICATES: CertificateRequest[] = [
  {
    id: 'cert-1',
    studentName: 'محمد أحمد عثمان إدريس',
    studentId: 'NSAC-2023-104',
    nationalId: '1-98-0456123-9',
    certType: 'كشف درجات فصلي معتمد (Transcript)',
    deliveryMethod: 'digital',
    notes: 'مطلوب لتقديمه للتدريب الصيفي لدى بنك الخرطوم.',
    status: 'approved',
    requestedAt: '2026-09-19',
    approvedAt: '2026-09-20',
    serialNumber: 'NSAC-CERT-2026-8841',
    gpa: '3.82 من 4.00 (ممتاز مرتفع)',
    graduationYear: 'المستوى الثالث - دفعة 2026',
  },
];

const DEFAULT_PAYMENTS: FeePayment[] = [
  {
    id: 'pay-1',
    studentId: 'NSAC-2023-104',
    studentName: 'محمد أحمد عثمان إدريس',
    amount: 185000,
    term: 'الفصل الدراسي الثاني 2026',
    paymentMethod: 'bankak',
    referenceNumber: 'BOK-98412039',
    date: '2026-09-10',
    status: 'verified',
    receiptNumber: 'REC-2026-0941',
    notes: 'سداد كامل الرسوم الدراسية للفصل الثاني عبر تطبيق بنكك.',
  },
];

const DEFAULT_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sch-1',
    dayOfWeek: 'sunday',
    dayNameAr: 'الأحد',
    course: 'المحاسبة في بيئة التجارة الإلكترونية',
    instructor: 'د. عبد الله النور كباشي',
    time: '09:00 ص - 10:30 ص',
    duration: '90 دقيقة',
    roomOrLink: 'القاعة الافتراضية 1 (بث مباشر)',
    lectureId: 'lec-1',
    order: 1,
    isCompleted: true,
    color: 'emerald',
    notes: 'التسويات البنكية وعمليات بنكك وفوري',
  },
  {
    id: 'sch-2',
    dayOfWeek: 'sunday',
    dayNameAr: 'الأحد',
    course: 'تطبيقات محاسبية بالاكسل المتقدم',
    instructor: 'م. أحمد كمال حسن',
    time: '11:00 ص - 12:30 م',
    duration: '90 دقيقة',
    roomOrLink: 'مختبر المحاكاة السحابي',
    order: 2,
    isCompleted: false,
    color: 'blue',
    notes: 'تحليل الحساسية وجداول Pivot Tables',
  },
  {
    id: 'sch-3',
    dayOfWeek: 'monday',
    dayNameAr: 'الإثنين',
    course: 'المعايير الدولية لإعداد التقارير المالية (IFRS)',
    instructor: 'أ. طارق التجاني بابكر',
    time: '10:00 ص - 11:30 ص',
    duration: '90 دقيقة',
    roomOrLink: 'القاعة الافتراضية 2 (بث تفاعلي)',
    lectureId: 'lec-2',
    order: 3,
    isCompleted: true,
    color: 'amber',
    notes: 'معيار IFRS 15 وعقود الخدمات والبرمجيات',
  },
  {
    id: 'sch-4',
    dayOfWeek: 'tuesday',
    dayNameAr: 'الثلاثاء',
    course: 'نظم المعلومات المحاسبية (AIS)',
    instructor: 'د. فاطمة عمر الفاضل',
    time: '09:00 ص - 10:30 ص',
    duration: '90 دقيقة',
    roomOrLink: 'منصة التدريب العملي المباشر',
    lectureId: 'lec-3',
    order: 4,
    isCompleted: false,
    color: 'purple',
    notes: 'مخططات تدفق البيانات والرقابة الداخلية',
  },
  {
    id: 'sch-5',
    dayOfWeek: 'wednesday',
    dayNameAr: 'الأربعاء',
    course: 'المراجعة والتدقيق المالي الإلكتروني',
    instructor: 'د. عبد الله النور كباشي',
    time: '10:30 ص - 12:00 م',
    duration: '90 دقيقة',
    roomOrLink: 'القاعة الافتراضية 1',
    order: 5,
    isCompleted: false,
    color: 'indigo',
    notes: 'تقنيات التدقيق بمساعدة الحاسوب (CAATs)',
  },
  {
    id: 'sch-6',
    dayOfWeek: 'thursday',
    dayNameAr: 'الخميس',
    course: 'محاسبة التكاليف والمحاسبة الإدارية',
    instructor: 'أ. طارق التجاني بابكر',
    time: '09:00 ص - 10:30 ص',
    duration: '90 دقيقة',
    roomOrLink: 'القاعة الافتراضية 3',
    order: 6,
    isCompleted: false,
    color: 'rose',
    notes: 'نقطة التعادل وتحليل التكلفة والحجم والربح (CVP)',
  },
];

class StorageService {
  private lectures: Lecture[] = [];
  private assignments: Assignment[] = [];
  private submissions: Submission[] = [];
  private quizzes: Quiz[] = [];
  private quizResults: QuizResult[] = [];
  private certificates: CertificateRequest[] = [];
  private payments: FeePayment[] = [];
  private announcements: Announcement[] = [];
  private schedule: ScheduleItem[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      this.lectures = this.load('nsac_lectures', DEFAULT_LECTURES);
      this.assignments = this.load('nsac_assignments', DEFAULT_ASSIGNMENTS);

      // Ensure urgent assignments exist and have fresh deadlines
      const hasUrgent = this.assignments.some((a) => a.id === 'asg-urgent-1' || a.id === 'asg-urgent-2');
      if (!hasUrgent) {
        this.assignments = [
          ...DEFAULT_ASSIGNMENTS.filter((a) => a.id.startsWith('asg-urgent')),
          ...this.assignments.filter((a) => !a.id.startsWith('asg-urgent')),
        ];
        this.save('nsac_assignments', this.assignments);
      }

      this.submissions = this.load('nsac_submissions', DEFAULT_SUBMISSIONS);
      this.quizzes = this.load('nsac_quizzes', DEFAULT_QUIZZES);
      this.quizResults = this.load('nsac_quiz_results', []);
      this.certificates = this.load('nsac_certificates', DEFAULT_CERTIFICATES);
      this.payments = this.load('nsac_payments', DEFAULT_PAYMENTS);
      this.announcements = this.load('nsac_announcements', DEFAULT_ANNOUNCEMENTS);
      this.schedule = this.load('nsac_weekly_schedule', DEFAULT_SCHEDULE);
    } catch (e) {
      console.error('Failed to load storage', e);
      this.lectures = [...DEFAULT_LECTURES];
      this.assignments = [...DEFAULT_ASSIGNMENTS];
      this.submissions = [...DEFAULT_SUBMISSIONS];
      this.quizzes = [...DEFAULT_QUIZZES];
      this.certificates = [...DEFAULT_CERTIFICATES];
      this.payments = [...DEFAULT_PAYMENTS];
      this.announcements = [...DEFAULT_ANNOUNCEMENTS];
      this.schedule = [...DEFAULT_SCHEDULE];
    }
  }

  private load<T>(key: string, fallback: T): T {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    try {
      return JSON.parse(item);
    } catch {
      return fallback;
    }
  }

  private save(key: string, data: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('nsac_storage_updated', { detail: { key } }));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  // Lectures
  getLectures(): Lecture[] {
    return [...this.lectures];
  }

  addLecture(lec: Omit<Lecture, 'id'>): Lecture {
    const rawUrl = lec.youtubeUrl || (lec.youtubeId ? `https://www.youtube.com/watch?v=${lec.youtubeId}` : '');
    const vId = extractYouTubeVideoId(rawUrl) || lec.videoId || lec.youtubeId || '3u3jG4g7D-M';
    const newLec: Lecture = {
      ...lec,
      id: `lec-${Date.now()}`,
      youtubeUrl: rawUrl,
      videoId: vId,
      youtubeId: vId,
    };
    this.lectures.unshift(newLec);
    this.save('nsac_lectures', this.lectures);
    return newLec;
  }

  deleteLecture(id: string) {
    this.lectures = this.lectures.filter((l) => l.id !== id);
    this.save('nsac_lectures', this.lectures);
  }

  updateLecture(id: string, updated: Partial<Lecture>): Lecture | null {
    const index = this.lectures.findIndex((l) => l.id === id);
    if (index === -1) return null;
    const target = this.lectures[index];
    const rawUrl = updated.youtubeUrl || (updated.youtubeId ? `https://www.youtube.com/watch?v=${updated.youtubeId}` : target.youtubeUrl || '');
    const newVideoId = rawUrl ? extractYouTubeVideoId(rawUrl) : (updated.videoId || updated.youtubeId || target.videoId);
    this.lectures[index] = {
      ...target,
      ...updated,
      youtubeUrl: rawUrl,
      videoId: newVideoId,
      youtubeId: newVideoId,
    };
    this.save('nsac_lectures', this.lectures);
    return this.lectures[index];
  }

  // Assignments
  getAssignments(): Assignment[] {
    return [...this.assignments];
  }

  addAssignment(asg: Omit<Assignment, 'id' | 'createdAt'>): Assignment {
    const newAsg: Assignment = {
      ...asg,
      id: `asg-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.assignments.unshift(newAsg);
    this.save('nsac_assignments', this.assignments);
    return newAsg;
  }

  deleteAssignment(id: string) {
    this.assignments = this.assignments.filter((a) => a.id !== id);
    this.save('nsac_assignments', this.assignments);
  }

  // Submissions
  getSubmissions(): Submission[] {
    return [...this.submissions];
  }

  getStudentSubmissions(studentId: string): Submission[] {
    return this.submissions.filter((s) => s.studentId === studentId);
  }

  addSubmission(sub: Omit<Submission, 'id' | 'submissionDate' | 'status'>): Submission {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newSub: Submission = {
      ...sub,
      id: `sub-${Date.now()}`,
      submissionDate: dateStr,
      status: 'submitted',
    };
    this.submissions.unshift(newSub);
    this.save('nsac_submissions', this.submissions);
    return newSub;
  }

  gradeSubmission(submissionId: string, score: number, feedback: string, instructorName: string): Submission | null {
    const sub = this.submissions.find((s) => s.id === submissionId);
    if (!sub) return null;
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    sub.status = 'graded';
    sub.score = score;
    sub.feedback = feedback;
    sub.gradedAt = dateStr;
    sub.gradedBy = instructorName;
    this.save('nsac_submissions', this.submissions);
    return sub;
  }

  // Quizzes
  getQuizzes(): Quiz[] {
    return [...this.quizzes];
  }

  addQuiz(quiz: Omit<Quiz, 'id' | 'createdAt'>): Quiz {
    const newQuiz: Quiz = {
      ...quiz,
      id: `quiz-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.quizzes.unshift(newQuiz);
    this.save('nsac_quizzes', this.quizzes);
    return newQuiz;
  }

  deleteQuiz(id: string): void {
    this.quizzes = this.quizzes.filter((q) => q.id !== id);
    this.save('nsac_quizzes', this.quizzes);
  }

  saveQuizResult(res: Omit<QuizResult, 'id' | 'submittedAt'>): QuizResult {
    const newRes: QuizResult = {
      ...res,
      id: `qres-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    this.quizResults.unshift(newRes);
    this.save('nsac_quiz_results', this.quizResults);
    return newRes;
  }

  getStudentQuizResults(studentId: string): QuizResult[] {
    return this.quizResults.filter((r) => r.studentId === studentId);
  }

  // Certificates
  getCertificates(): CertificateRequest[] {
    return [...this.certificates];
  }

  addCertificateRequest(req: Omit<CertificateRequest, 'id' | 'requestedAt' | 'status' | 'serialNumber'>): CertificateRequest {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newCert: CertificateRequest = {
      ...req,
      id: `cert-${Date.now()}`,
      requestedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
      serialNumber: `NSAC-CERT-2026-${randNum}`,
      gpa: '3.85 من 4.00 (ممتاز)',
      graduationYear: 'المستوى الثالث - 2026',
    };
    this.certificates.unshift(newCert);
    this.save('nsac_certificates', this.certificates);
    return newCert;
  }

  approveCertificate(id: string): CertificateRequest | null {
    const cert = this.certificates.find((c) => c.id === id);
    if (!cert) return null;
    cert.status = 'approved';
    cert.approvedAt = new Date().toISOString().split('T')[0];
    this.save('nsac_certificates', this.certificates);
    return cert;
  }

  // Payments
  getPayments(): FeePayment[] {
    return [...this.payments];
  }

  addPayment(pay: Omit<FeePayment, 'id' | 'date' | 'receiptNumber'>): FeePayment {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newPay: FeePayment = {
      ...pay,
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      receiptNumber: `REC-2026-${randNum}`,
    };
    this.payments.unshift(newPay);
    this.save('nsac_payments', this.payments);
    return newPay;
  }

  // Current User Session Management
  getCurrentUser(): User | null {
    const raw = localStorage.getItem('nsac_current_user');
    if (raw) {
      try {
        return JSON.parse(raw) as User;
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
    // Default logged in demo student for fast frictionless testing
    return DEMO_USERS.student;
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      this.save('nsac_current_user', user);
    } else {
      localStorage.removeItem('nsac_current_user');
      window.dispatchEvent(new Event('nsac_storage_updated'));
    }
  }

  logout(): void {
    localStorage.removeItem('nsac_current_user');
    window.dispatchEvent(new Event('nsac_storage_updated'));
  }

  // Announcements
  getAnnouncements(): Announcement[] {
    return [...this.announcements];
  }

  addAnnouncement(ann: Omit<Announcement, 'id' | 'date'>): Announcement {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    this.announcements.unshift(newAnn);
    this.save('nsac_announcements', this.announcements);
    return newAnn;
  }

  // Weekly Schedule
  getSchedule(): ScheduleItem[] {
    return [...this.schedule].sort((a, b) => a.order - b.order);
  }

  saveSchedule(items: ScheduleItem[]): void {
    this.schedule = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    this.save('nsac_weekly_schedule', this.schedule);
  }

  reorderSchedule(items: ScheduleItem[]): void {
    this.saveSchedule(items);
  }

  toggleScheduleItemCompleted(id: string): void {
    const item = this.schedule.find((s) => s.id === id);
    if (item) {
      item.isCompleted = !item.isCompleted;
      this.save('nsac_weekly_schedule', this.schedule);
    }
  }

  addScheduleItem(item: Omit<ScheduleItem, 'id' | 'order'>): ScheduleItem {
    const maxOrder = this.schedule.reduce((max, s) => Math.max(max, s.order || 0), 0);
    const newItem: ScheduleItem = {
      ...item,
      id: `sch-${Date.now()}`,
      order: maxOrder + 1,
    };
    this.schedule.push(newItem);
    this.save('nsac_weekly_schedule', this.schedule);
    return newItem;
  }

  deleteScheduleItem(id: string): void {
    this.schedule = this.schedule.filter((s) => s.id !== id);
    this.save('nsac_weekly_schedule', this.schedule);
  }

  resetSchedule(): ScheduleItem[] {
    this.schedule = [...DEFAULT_SCHEDULE];
    this.save('nsac_weekly_schedule', this.schedule);
    return this.schedule;
  }
}

export const storage = new StorageService();
