import { SupportedLanguage } from '../types';

export interface TranslationDict {
  appName: string;
  appTagline: string;
  privacyBadge: string;
  privacyBadgeShort: string;
  privacyDetail: string;
  lightMode: string;
  darkMode: string;
  switchLanguage: string;
  backToTools: string;
  selectFile: string;
  selectFiles: string;
  dragDropFile: string;
  dragDropFiles: string;
  supportsPdf: string;
  supportsImages: string;
  fileSize: string;
  pagesCount: string;
  removeFile: string;
  moveUp: string;
  moveDown: string;
  applyChanges: string;
  processing: string;
  downloadReady: string;
  downloadNow: string;
  newFileName: string;
  saveAs: string;
  sizeReduction: string;
  processAnother: string;
  errorProcessing: string;
  cancel: string;
  close: string;
  apply: string;
  preview: string;
  allPages: string;
  selectPage: string;
  page: string;
  of: string;
  zoomIn: string;
  zoomOut: string;
  rotateLeft: string;
  rotateRight: string;
  deletePage: string;
  duplicatePage: string;
  restorePage: string;
  sidebarTitle: string;
  homeOverview: string;
  toggleSidebar: string;
  replaceFile: string;
  deleteFile: string;
  fileLoaded: string;

  // Tools
  categories: {
    all: string;
    search: string;
    organize: string;
    convert: string;
    security: string;
    edit: string;
    cv: string;
    badge?: string;
    text?: string;
    business?: string;
  };
  tools: {
    invoice?: {
      title: string;
      desc: string;
      badge: string;
    };
    voucher?: {
      title: string;
      desc: string;
      badge: string;
    };
    vatCalculator?: {
      title: string;
      desc: string;
      badge: string;
    };
    tafqeet?: {
      title: string;
      desc: string;
      badge: string;
    };
    nup?: {
      title: string;
      desc: string;
      badge: string;
    };
    pdfGrayscale?: {
      title: string;
      desc: string;
      badge: string;
    };
    imageWatermark?: {
      title: string;
      desc: string;
      badge: string;
    };
    socialCrop?: {
      title: string;
      desc: string;
      badge: string;
    };
    stitchImages?: {
      title: string;
      desc: string;
      badge: string;
    };
    dateCalculator?: {
      title: string;
      desc: string;
      badge: string;
    };
    clearance?: {
      title: string;
      desc: string;
      badge: string;
    };
    payroll?: {
      title: string;
      desc: string;
      badge: string;
    };
    badgeGenerator?: {
      title: string;
      desc: string;
      badge: string;
    };
    stampRemover?: {
      title: string;
      desc: string;
      badge: string;
    };
    imageTools?: {
      title: string;
      desc: string;
      badge: string;
    };
    textTools?: {
      title: string;
      desc: string;
      badge: string;
    };
    qrGenerator?: {
      title: string;
      desc: string;
      badge: string;
    };
    redact?: {
      title: string;
      desc: string;
      badge: string;
      blackout: string;
      whiteout: string;
      blur: string;
      labeled: string;
      highlight: string;
      strike: string;
      redAlert: string;
      clearPage: string;
      clearAll: string;
      undo: string;
      downloadRedacted: string;
      activeRedactions: string;
      noRedactionsOnPage: string;
      redactionsCount: string;
      dragTip: string;
      linePreset: string;
      signaturePreset: string;
      customLabelPlaceholder: string;
      customColor: string;
      eyedropper: string;
      eyedropperActiveTip: string;
      colorPresets: string;
      opacity: string;
    };
    cvBuilder: {
      title: string;
      desc: string;
      badge: string;
    };
    cvModern?: {
      title: string;
      desc: string;
      badge: string;
    };
    cvTable?: {
      title: string;
      desc: string;
      badge: string;
    };
    cvClassic?: {
      title: string;
      desc: string;
      badge: string;
    };
    searchText: {
      title: string;
      desc: string;
      badge: string;
      searchPlaceholder: string;
      searchBtn: string;
      resultsFound: string;
      matchesOnPages: string;
      noMatches: string;
      searching: string;
      clearSearch: string;
      jumpToPage: string;
      copyPages: string;
      copied: string;
      caseSensitive: string;
      matchingPages: string;
    };
    merge: {
      title: string;
      desc: string;
      badge: string;
      addMore: string;
      mergeAction: string;
    };
    split: {
      title: string;
      desc: string;
      badge: string;
      modeRange: string;
      modeFixed: string;
      modePages: string;
      rangeTitle: string;
      fromPage: string;
      toPage: string;
      addRange: string;
      removeRange: string;
      mergeAllRanges: string;
      splitAction: string;
      everyPages: string;
      extractPagesDesc: string;
      separateZip?: string;
      separateZipDesc?: string;
      mergePdfOption?: string;
      mergePdfOptionDesc?: string;
      splitEverySinglePage?: string;
      splitActionZip?: string;
      outputMethod?: string;
    };
    rotate: {
      title: string;
      desc: string;
      badge: string;
      rotateAllLeft: string;
      rotateAllRight: string;
      rotateAll180: string;
      resetRotation: string;
      rotateAction: string;
    };
    organize: {
      title: string;
      desc: string;
      badge: string;
      organizeAction: string;
      dragTip: string;
    };
    imageToPdf: {
      title: string;
      desc: string;
      badge: string;
      orientation: string;
      auto: string;
      portrait: string;
      landscape: string;
      margins: string;
      noMargin: string;
      smallMargin: string;
      bigMargin: string;
      convertAction: string;
    };
    pdfToImage: {
      title: string;
      desc: string;
      badge: string;
      format: string;
      quality: string;
      convertAction: string;
      downloadZip: string;
      singleImage: string;
    };
    watermark: {
      title: string;
      desc: string;
      badge: string;
      tabWatermark: string;
      tabPageNumbers: string;
      watermarkText: string;
      watermarkPlaceholder: string;
      opacity: string;
      fontSize: string;
      rotation: string;
      color: string;
      pageNumberFormat: string;
      position: string;
      bottomCenter: string;
      bottomRight: string;
      bottomLeft: string;
      topCenter: string;
      topRight: string;
      applyAction: string;
    };
    protect: {
      title: string;
      desc: string;
      badge: string;
      tabProtect: string;
      tabUnlock: string;
      passwordLabel: string;
      confirmPasswordLabel: string;
      passwordPlaceholder: string;
      unlockPasswordPlaceholder: string;
      protectAction: string;
      unlockAction: string;
      passwordsMismatch: string;
    };
    edit: {
      title: string;
      desc: string;
      badge: string;
      addText: string;
      draw: string;
      highlight: string;
      rectangle: string;
      redact: string;
      undo: string;
      clear: string;
      textPlaceholder: string;
      strokeColor: string;
      strokeWidth: string;
      fontSize: string;
      saveEditsAction: string;
      clickToPlaceText: string;
      insertPageHere: string;
    };
    compress: {
      title: string;
      desc: string;
      badge: string;
      maxCompress: string;
      maxCompressDesc: string;
      midCompress: string;
      midCompressDesc: string;
      lowCompress: string;
      lowCompressDesc: string;
      compressAction: string;
    };
    sign?: {
      title: string;
      desc: string;
      badge: string;
    };
    ocr?: {
      title: string;
      desc: string;
      badge: string;
    };
    idPhoto?: {
      title: string;
      desc: string;
      badge: string;
    };
    hijri?: {
      title: string;
      desc: string;
      badge: string;
    };
    metadataCleaner?: {
      title: string;
      desc: string;
      badge: string;
    };
    textCrypto?: {
      title: string;
      desc: string;
      badge: string;
    };
    wordCounter?: {
      title: string;
      desc: string;
      badge: string;
    };
    textCompare?: {
      title: string;
      desc: string;
      badge: string;
    };
    pageNumbering?: {
      title: string;
      desc: string;
      badge: string;
    };
    textCleaner?: {
      title: string;
      desc: string;
      badge: string;
    };
  };
}

export const translations: Record<SupportedLanguage, TranslationDict> = {
  ar: {
    appName: 'PdfDoer',
    appTagline: 'معالجة وتعديل ملفات PDF داخل متصفحك مباشرة بدون خادم وبخصوصية كاملة',
    privacyBadge: '🔒 معالجة محلية 100% — لا تُرفع ملفاتك إلى أي خادم، لضمان الخصوصية التامة',
    privacyBadgeShort: 'خصوصية 100% محلية',
    privacyDetail: 'جميع عمليات التعديل والدمج والتحويل تتم كلياً داخل جهازك عبر المتصفح دون إرسال البيانات لأي جهة.',
    lightMode: 'الوضع النهاري',
    darkMode: 'الوضع الليلي',
    switchLanguage: 'تغيير اللغة',
    backToTools: 'العودة لجميع الأدوات',
    selectFile: 'اختر ملف PDF',
    selectFiles: 'اختر ملفات PDF',
    dragDropFile: 'اسحب الملف وأفلته هنا، أو اضغط للاختيار من جهازك',
    dragDropFiles: 'اسحب الملفات وأفلتها هنا، أو اضغط للاختيار',
    supportsPdf: 'يدعم ملفات PDF بجميع الأحجام',
    supportsImages: 'يدعم صور JPG، PNG، WebP',
    fileSize: 'الحجم',
    pagesCount: 'عدد الصفحات',
    removeFile: 'حذف',
    moveUp: 'تحريك لأعلى',
    moveDown: 'تحريك لأسفل',
    applyChanges: 'تنفيذ التعديلات',
    processing: 'جاري المعالجة محلياً...',
    downloadReady: 'الملف جاهز للتحميل!',
    downloadNow: 'تحميل الملف الآن',
    newFileName: 'اسم الملف الجديد',
    saveAs: 'حفظ باسم',
    sizeReduction: 'نسبة تقليص الحجم',
    processAnother: 'معالجة ملف آخر',
    errorProcessing: 'حدث خطأ أثناء معالجة الملف. تأكد من سلامة ملف الـ PDF.',
    cancel: 'إلغاء',
    close: 'إغلاق',
    apply: 'تطبيق',
    preview: 'معاينة',
    allPages: 'جميع الصفحات',
    selectPage: 'اختر الصفحة',
    page: 'صفحة',
    of: 'من',
    zoomIn: 'تكبير',
    zoomOut: 'تصغير',
    rotateLeft: 'تدوير لليسار (90°)',
    rotateRight: 'تدوير لليمين (90°)',
    deletePage: 'حذف الصفحة',
    duplicatePage: 'تكرار الصفحة',
    restorePage: 'استعادة الصفحة',
    sidebarTitle: 'الأدوات والميزات',
    homeOverview: 'الرئيسية (جميع الأدوات)',
    toggleSidebar: 'تبديل القائمة الجانبية',
    replaceFile: 'استبدال الملف',
    deleteFile: 'حذف الملف',
    fileLoaded: 'تم تحميل الملف',

    categories: {
      all: 'جميع الأدوات',
      search: 'البحث في PDF',
      organize: 'تنظيم وترتيب',
      convert: 'تحويل الصور والملفات',
      security: 'أمان وحماية',
      edit: 'تحرير وعلامات مائية',
      cv: 'السيرة الذاتية (CV)',
      badge: 'بطاقات الهوية',
      text: 'أدوات النصوص والمعاملات',
      business: 'المالية والأعمال',
    },
    tools: {
      cvBuilder: {
        title: 'منشئ السيرة الذاتية (CV Builder)',
        desc: 'إنشاء سيرة ذاتية احترافية تفاعلية بأنماط متعددة (العصري، الجدولي، والأكاديمي) مع طباعة وحفظ مباشر كـ PDF.',
        badge: 'طباعة و PDF',
      },
      cvModern: {
        title: 'السيرة الذاتية - النمط العصري',
        desc: 'تصميم أنيق وعصري ذو عمودين مع شريط جانبي ملون للصورة، التواصل، والمهارات.',
        badge: 'العصري',
      },
      cvTable: {
        title: 'السيرة الذاتية - النمط التفاعلي',
        desc: 'تصميم جدولي منظم ومفصل يدعم إضافة وحذف الصفوف والأقسام ديناميكياً.',
        badge: 'التفاعلي',
      },
      cvClassic: {
        title: 'السيرة الذاتية - النمط الكلاسيكي',
        desc: 'تصميم أكاديمي وتنفيذي راقٍ بتسلسل متناسق للمعلومات الشخصية والخبرات.',
        badge: 'الكلاسيكي',
      },
      searchText: {
        title: 'البحث في مستند PDF',
        desc: 'البحث السريع عن أي كلمة أو عبارة داخل صفحات الـ PDF مع تحديد أرقام الصفحات وعرض النصوص المطابقة.',
        badge: 'بحث فوري',
        searchPlaceholder: 'اكتب الكلمة أو العبارة المراد البحث عنها...',
        searchBtn: 'بحث في الملف',
        resultsFound: 'نتائج مطابقة',
        matchesOnPages: 'مطابقات عبر الصفحات',
        noMatches: 'لم يتم العثور على أي نتائج مطابقة',
        searching: 'جاري فحص النصوص محلياً...',
        clearSearch: 'مسح البحث',
        jumpToPage: 'الانتقال للصفحة',
        copyPages: 'نسخ أرقام الصفحات',
        copied: 'تم النسخ!',
        caseSensitive: 'حساس لحالة الأحرف',
        matchingPages: 'الانتقال للصفحة:',
      },
      merge: {
        title: 'دمج PDF',
        desc: 'دمج ملفات PDF متعددة في ملف واحد بالترتيب الذي تريده بكل سهولة.',
        badge: 'الأكثر استخداماً',
        addMore: 'إضافة المزيد من الملفات',
        mergeAction: 'دمج ملفات PDF',
      },
      split: {
        title: 'تقسيم PDF',
        desc: 'استخراج نطاقات مخصصة أو صفحات فردية وتقسيم المستند إلى ملفات منفصلة.',
        badge: 'مخصص ودقيق',
        modeRange: 'نطاق مخصص',
        modeFixed: 'نطاقات ثابتة',
        modePages: 'صفحات محددة',
        rangeTitle: 'النطاق',
        fromPage: 'من صفحة',
        toPage: 'إلى',
        addRange: 'إضافة نطاق جديد',
        removeRange: 'إزالة النطاق',
        mergeAllRanges: 'دمج جميع النطاقات في ملف PDF واحد',
        splitAction: 'تقسيم PDF',
        everyPages: 'تقسيم كل عدد صفحات:',
        extractPagesDesc: 'أدخل أرقام الصفحات مفصولة بفواصل (مثال: 1, 3, 5-8)',
        outputMethod: 'طريقة استخراج وحفظ الملفات:',
        separateZip: 'ملفات منفصلة في أرشيف مضغوط (ZIP)',
        separateZipDesc: 'فصل المستند إلى ملفات PDF مستقلة كلٌ على حدة وتنزيلها معاً في ملف مضغوط (ZIP).',
        mergePdfOption: 'دمج النطاقات في ملف PDF واحد',
        mergePdfOptionDesc: 'استخراج النطاقات والصفحات المحددة ودمجها في مستند PDF واحد جديد.',
        splitEverySinglePage: 'فصل كل صفحة في ملف مستقل (1 صفحة/ملف)',
        splitActionZip: 'تقسيم وتنزيل كملف مضغوط (ZIP)',
      },
      rotate: {
        title: 'تدوير الصفحات',
        desc: 'تدوير صفحات ملف PDF بزاوية 90 أو 180 أو 270 درجة لصفحات محددة أو للكل.',
        badge: 'فوري وبصري',
        rotateAllLeft: 'تدوير الكل يساراً',
        rotateAllRight: 'تدوير الكل يميناً',
        rotateAll180: 'تدوير الكل 180°',
        resetRotation: 'إعادة ضبط التدوير',
        rotateAction: 'حفظ وتدوير PDF',
      },
      organize: {
        title: 'تنظيم وترتيب الصفحات',
        desc: 'إعادة ترتيب صفحات المستند، حذف صفحات زائدة، أو تكرار صفحات بسهولة وبصرياً.',
        badge: 'تحكم كامل',
        organizeAction: 'حفظ الترتيب الجديد',
        dragTip: 'يمكنك استخدام أزرار التقديم والتأخير والحذف لإعادة ترتيب المستند.',
      },
      imageToPdf: {
        title: 'تحويل الصور إلى PDF',
        desc: 'تحويل صور JPG و PNG إلى ملف PDF موحد مع ضبط المقاسات والهوامش.',
        badge: 'JPG / PNG',
        orientation: 'الاتجاه',
        auto: 'تلقائي',
        portrait: 'عمودي (طولي)',
        landscape: 'أفقي (عرضي)',
        margins: 'الهوامش',
        noMargin: 'بدون هوامش',
        smallMargin: 'هامش صغير',
        bigMargin: 'هامش واسع',
        convertAction: 'إنشاء ملف PDF',
      },
      pdfToImage: {
        title: 'تحويل PDF إلى صور JPG',
        desc: 'استخراج وتحويل كل صفحة من ملف PDF إلى صورة عالية الدقة وتنزيلها مضغوطة.',
        badge: 'عالي الدقة',
        format: 'صيغة الصورة',
        quality: 'جودة الاستخراج',
        convertAction: 'تحويل وتنزيل الصور',
        downloadZip: 'تحميل جميع الصور (ZIP)',
        singleImage: 'تحميل صورة الصفحة',
      },
      watermark: {
        title: 'العلامة المائية وأرقام الصفحات',
        desc: 'إضافة نص علامة مائية شفافة أو ترقيم تسلسلي للصفحات في مواضع مختلفة.',
        badge: 'حماية وتوثيق',
        tabWatermark: 'علامة مائية نصية',
        tabPageNumbers: 'أرقام الصفحات',
        watermarkText: 'نص العلامة المائية',
        watermarkPlaceholder: 'مثال: سري للغاية / نسخة عمل',
        opacity: 'الشفافية',
        fontSize: 'حجم الخط',
        rotation: 'زاوية الميلان',
        color: 'اللون',
        pageNumberFormat: 'نمط الترقيم',
        position: 'مكان الترقيم',
        bottomCenter: 'أسفل الوسط',
        bottomRight: 'أسفل اليمين',
        bottomLeft: 'أسفل اليسار',
        topCenter: 'أعلى الوسط',
        topRight: 'أعلى اليمين',
        applyAction: 'تطبيق العلامة والترقيم',
      },
      protect: {
        title: 'حماية وإلغاء كلمة السر',
        desc: 'قفل مستند PDF بكلمة مرور مشفرة أو فك القيود وتأمين المستندات.',
        badge: 'تشفير آمن',
        tabProtect: 'قفل بكلمة سر',
        tabUnlock: 'إلغاء كلمة السر',
        passwordLabel: 'كلمة المرور',
        confirmPasswordLabel: 'تأكيد كلمة المرور',
        passwordPlaceholder: 'أدخل كلمة المرور الجديدة',
        unlockPasswordPlaceholder: 'أدخل كلمة المرور الحالية للملف',
        protectAction: 'قفل وتشفير PDF',
        unlockAction: 'فك حماية المستند',
        passwordsMismatch: 'كلمتا المرور غير متطابقتين',
      },
      edit: {
        title: 'تحرير وتعديل PDF',
        desc: 'إضافة نصوص، توقيعات ورسومات يدوية، تظليل نصي وأشكال هندسية مباشرة.',
        badge: 'محرر تفاعلي',
        addText: 'إضافة نص',
        draw: 'قلم وتوقيع',
        highlight: 'تظليل (هايلايت)',
        rectangle: 'مستطيل',
        redact: 'طمس وسواد',
        undo: 'تراجع',
        clear: 'مسح التعديلات',
        textPlaceholder: 'اكتب النص هنا...',
        strokeColor: 'اللون',
        strokeWidth: 'سمك الخط',
        fontSize: 'حجم النص',
        saveEditsAction: 'حفظ التعديلات في PDF',
        clickToPlaceText: 'اضغط على الصفحة لوضع النص في المكان المراد',
        insertPageHere: 'إدراج صفحة فارغة',
      },
      compress: {
        title: 'ضغط وتقليل حجم PDF',
        desc: 'تقليل حجم ملف PDF عبر إعادة تهيئة الصفحات والصور مع الحفاظ على المقروئية.',
        badge: 'توفير المساحة',
        maxCompress: 'أقصى ضغط',
        maxCompressDesc: 'أقل جودة، ضغط عالي، أصغر حجم ممكن للملف',
        midCompress: 'الضغط المتوسط (موصى به)',
        midCompressDesc: 'جودة جيدة، ضغط متوازن، ملائم للإرسال بالبريد',
        lowCompress: 'أقل ضغط',
        lowCompressDesc: 'جودة عالية جداً، ضغط خفيف للحفاظ على أدق التفاصيل',
        compressAction: 'ضغط ملف PDF',
      },
      badgeGenerator: {
        title: 'مولد بطاقات الموظفين (CR80)',
        desc: 'تصميم وطباعة بطاقات الهوية وبطاقات العمل القياسية مع باركود vCard وتصدير فوري كـ PDF أو صورة عالية الدقة.',
        badge: 'هوية قياسية',
      },
      stampRemover: {
        title: 'تفريغ التوقيعات والأختام',
        desc: 'تحويل خلفية الورقة إلى شفافة تماماً (PNG) للتوقيعات والأختام الرسمية مع تعزيز وضوح الحبر وإدراجها بالمستندات.',
        badge: 'تفريغ فوري',
      },
      imageTools: {
        title: 'معالجة وتدوير وضغط الصور',
        desc: 'تدوير صور المعاملات، تحويل الصيغ بين PNG و JPG و WebP، وتقليل الحجم قبل إرفاقها بالمستندات.',
        badge: 'معالجة صور',
      },
      textTools: {
        title: 'أدوات النصوص الذكية (تنظيف، مقارنة، عداد، تشفير)',
        desc: 'مجموعة شاملة لتهيئة النصوص: إزالة التشكيل والمسافات، مقارنة الفروق بين نسختين، عداد الكلمات، وتشفير AES.',
        badge: 'أدوات نصوص',
      },
      qrGenerator: {
        title: 'مولد أكواد QR الذكي',
        desc: 'إنشاء باركود سريع للروابط، الهواتف، محادثات الواتساب، والواي فاي بدقة طباعة وتحميل فوري أوفلاين.',
        badge: 'باركود سريع',
      },
      redact: {
        title: 'طمس وحجب بيانات PDF',
        desc: 'إخفاء وطمس البيانات الحساسة أو تشويهها في صفحات الـ PDF بطمس أسود، أبيض، ضبابي (بيكسل)، أو شطب وتظليل.',
        badge: 'أمان وخصوصية',
        blackout: 'طامس أسود معتم',
        whiteout: 'طامس أبيض',
        blur: 'طمس ضبابي (بيكسل)',
        labeled: 'شريط [محجوب]',
        highlight: 'تظليل شفاف',
        strike: 'شطب أحمر للنص',
        redAlert: 'طامس أحمر أمني',
        clearPage: 'مسح تعديلات الصفحة',
        clearAll: 'مسح جميع الصفحات',
        undo: 'تراجع',
        downloadRedacted: 'تنزيل PDF بعد الحجب',
        activeRedactions: 'العناصر المحجوبة بالصفحة',
        noRedactionsOnPage: 'لا توجد عناصر محجوبة في هذه الصفحة بعد',
        redactionsCount: 'عنصر محجوب',
        dragTip: 'اسحب بالمؤشر فوق النص أو الصورة لتطبيق الحجب المحدد.',
        linePreset: 'سطر كامل',
        signaturePreset: 'مربع توقيع',
        customLabelPlaceholder: 'النص المكتوب (مثال: [سري])',
        customColor: 'طامس باللون المختار 🎨',
        eyedropper: 'قطارة الألوان (من المستند)',
        eyedropperActiveTip: 'انقر الآن على أي نقطة داخل صفحة الـ PDF لاقتباس لونها ومطابقة خلفية الورقة',
        colorPresets: 'الألوان الجاهزة للورق',
        opacity: 'الشفافية',
      },
      sign: {
        title: 'توقيع PDF إلكترونياً',
        desc: 'ارسم توقيعك بيدك أو ارفعه كصورة شفافة، ثم حدد مكانه وحجمه بدقة على أي صفحة أو جميع الصفحات.',
        badge: 'توقيع إلكتروني',
      },
      ocr: {
        title: 'استخراج النص من PDF والصور (OCR)',
        desc: 'استخراج فوري للنصوص العربية والإنجليزية من المستندات والصور الممسوحة ضوئياً بدقة عالية.',
        badge: 'عربي + إنجليزي',
      },
      idPhoto: {
        title: 'صورة المعاملات والجواز (ID Photo)',
        desc: 'تجهيز وقص صورتك الشخصية بالمقاسات الرسمية للجوازات والتأشيرات والبطاقات مع ورقة طباعة 10×15 سم.',
        badge: 'مقاسات معتمدة',
      },
      hijri: {
        title: 'محوّل التاريخ الهجري والميلادي',
        desc: 'تحويل فوري ودقيق بين التقويم الهجري (أم القرى) والتقويم الميلادي مع عرض تاريخ اليوم الرسمي.',
        badge: 'تقويم أم القرى',
      },
      metadataCleaner: {
        title: 'مسح بيانات ملف PDF وحماية الخصوصية',
        desc: 'فحص وحذف بيانات الميتاداتا واسم الكاتب والبرامج المنشئة من الـ PDF قبل إرساله لحماية الخصوصية.',
        badge: 'أمان وخصوصية',
      },
      invoice: {
        title: 'مولد الفاتورة الضريبية والمبسطة (ZATCA)',
        desc: 'إنشاء فواتير ضريبية ومبسطة معتمدة تدعم ضريبة القيمة المضافة ورمز الاستجابة السريع المشفر وحفظ PDF.',
        badge: 'فوترة إلكترونية',
      },
      voucher: {
        title: 'سند قبض / سند صرف معتمد',
        desc: 'تحرير سندات القبض والصرف الرسمية مع التفقيط التلقائي للمبلغ وطباعة وتنزيل PDF فوري.',
        badge: 'سندات مالية',
      },
      vatCalculator: {
        title: 'حاسبة ضريبة القيمة المضافة (VAT)',
        desc: 'حساب الضريبة (شامل أو غير شامل) لنسب 15% أو 5% أو نسب مخصصة مع التفقيط المالي بالريال والعملات.',
        badge: 'حسابات وضريبة',
      },
      tafqeet: {
        title: 'كتابة المبلغ بالأحرف (التفقيط المالي)',
        desc: 'تحويل الأرقام والمبالغ المالية إلى كلمات عربية فصحى دقيقة للشيكات والعقود والفواتير مع العملات والكسور.',
        badge: 'تفقيط مالي',
      },
      nup: {
        title: 'عدة صفحات في ورقة واحدة (N-Up PDF)',
        desc: 'تجميع 2 أو 4 أو 6 أو 9 صفحات في ورقة A4 واحدة لتوفير الورق والحبر وسهولة المراجعة والطباعة.',
        badge: 'توفير ورق',
      },
      pdfGrayscale: {
        title: 'تحويل PDF إلى رمادي / أبيض وأسود',
        desc: 'تحويل المستندات الملونة إلى تدرج رمادي أو أبيض وأسود نقي لتوفير الحبر وتحسين وضوح الطباعة.',
        badge: 'توفير حبر',
      },
      imageWatermark: {
        title: 'علامة مائية على الصور',
        desc: 'إضافة اسمك أو شعارك أو موقعك كعلامة مائية مائلة أو في الزاوية لصورة أو عدة صور وتنزيلها كـ ZIP.',
        badge: 'حماية الملكية',
      },
      socialCrop: {
        title: 'مقاسات السوشيال ميديا وقص الصور',
        desc: 'ضبط وقص الصور بالمقاسات المعتمدة لإنستغرام، تيك توك، ستوري، تويتر، فيسبوك، يوتيوب، ولينكدإن.',
        badge: 'تصاميم ونشر',
      },
      stitchImages: {
        title: 'دمج عدة صور في صورة واحدة',
        desc: 'تجميع لقطات الشاشة والصور المتعددة رأسياً أو أفقياً مع التحكم بالفواصل والألوان وجودة التصدير.',
        badge: 'دمج وتجميع',
      },
      dateCalculator: {
        title: 'حاسبة العمر والتواريخ الشاملة',
        desc: 'حساب العمر الدقيق بالهجري والميلادي، الفرق بين تاريخين، وإضافة أو طرح مدة زمنية بالأيام والشهور.',
        badge: 'تقويم وأعمار',
      },
      clearance: {
        title: 'نموذج تعبئة وطباعة المخالصة الإلكترونية',
        desc: 'نموذج مخالصة نهائية وإخلاء طرف وتسليم عُهد مع إمكانية التعديل، التفقيط التلقائي، والطباعة عبر نافذة منبسطة.',
        badge: 'نظام العمل و PDF',
      },
      payroll: {
        title: 'نظام مسير الرواتب الإلكتروني',
        desc: 'مسير رواتب وأجور الموظفين لـ 12 شهراً مع الحساب التلقائي للصافي والتعبئة السريعة والطباعة المنبثقة.',
        badge: '12 شهراً وحساب آلي',
      },
      textCrypto: {
        title: 'تشفير وفك تشفير النصوص',
        desc: 'تشفير وفك تشفير النصوص بكلمة مرور أو بدونها محلياً بأعلى درجات الأمان عبر Web Crypto API ومعيار AES-256.',
        badge: 'AES-256 أمان',
      },
      wordCounter: {
        title: 'عداد الكلمات والحروف وزمن القراءة',
        desc: 'إحصائيات فورية للأحرف، الكلمات، الفقرات، الأسطر، الكلمات الفريدة، وزمن القراءة والإلقاء التقديري.',
        badge: 'إحصاء فوري',
      },
      textCompare: {
        title: 'مقارنة النصوص وتتبع الفروق',
        desc: 'مقارنة مسودات العقود والمستندات وكشف الإضافات والمحذوفات بدقة مع تقرير إحصائي ونسبة التطابق.',
        badge: 'كشف الفروق',
      },
      pageNumbering: {
        title: 'ترقيم صفحات PDF المتقدم',
        desc: 'ترقيم صفحات مستندات PDF بأنماط متعددة، مواضع مرنة، خطوط وألوان مخصصة مع معاينة فورية وتنزيل فوري.',
        badge: 'ترقيم صفحات',
      },
      textCleaner: {
        title: 'منظف النصوص الفوري وسجل الحذف',
        desc: 'تنظيف النصوص من النقاط، الفواصل، التشكيل، التطويل، المسافات، الأرقام والأسطر الفارغة مع سجل للعمليات.',
        badge: 'تنظيف فوري',
      },
    },
  },

  en: {
    appName: 'PdfDoer',
    appTagline: 'Process, edit, and organize PDF documents directly in your browser with 100% privacy.',
    privacyBadge: '🔒 100% Client-Side — Files never leave your device for total privacy',
    privacyBadgeShort: '100% Private & Local',
    privacyDetail: 'All editing, merging, splitting, and rendering happens right inside your browser without uploading to any remote server.',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    switchLanguage: 'Language',
    backToTools: 'Back to all tools',
    selectFile: 'Select PDF File',
    selectFiles: 'Select PDF Files',
    dragDropFile: 'Drag & drop file here, or click to choose from your device',
    dragDropFiles: 'Drag & drop files here, or click to choose',
    supportsPdf: 'Supports all standard PDF files',
    supportsImages: 'Supports JPG, PNG, WebP images',
    fileSize: 'Size',
    pagesCount: 'Pages',
    removeFile: 'Remove',
    moveUp: 'Move Up',
    moveDown: 'Move Down',
    applyChanges: 'Apply Changes',
    processing: 'Processing locally...',
    downloadReady: 'Your file is ready!',
    downloadNow: 'Download File Now',
    newFileName: 'New file name',
    saveAs: 'Save as',
    sizeReduction: 'Size reduction',
    processAnother: 'Process another file',
    errorProcessing: 'An error occurred while processing the file. Please ensure it is a valid PDF.',
    cancel: 'Cancel',
    close: 'Close',
    apply: 'Apply',
    preview: 'Preview',
    allPages: 'All Pages',
    selectPage: 'Select Page',
    page: 'Page',
    of: 'of',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    rotateLeft: 'Rotate Left (90°)',
    rotateRight: 'Rotate Right (90°)',
    deletePage: 'Delete Page',
    duplicatePage: 'Duplicate Page',
    restorePage: 'Restore Page',
    sidebarTitle: 'Tools & Features',
    homeOverview: 'Home (All Tools)',
    toggleSidebar: 'Toggle Sidebar',
    replaceFile: 'Replace File',
    deleteFile: 'Delete File',
    fileLoaded: 'File Loaded',

    categories: {
      all: 'All Tools',
      search: 'Search PDF',
      organize: 'Organize & Arrange',
      convert: 'Image Conversion',
      security: 'Security & Password',
      edit: 'Editor & Watermark',
      cv: 'CV & Resume',
      badge: 'ID Cards',
      text: 'Text & Utilities',
    },
    tools: {
      cvBuilder: {
        title: 'CV / Resume Builder',
        desc: 'Build professional, interactive resumes with modern, tabular, and executive layouts, then print or export directly to PDF.',
        badge: 'Print & PDF',
      },
      cvModern: {
        title: 'CV - Modern Style',
        desc: 'Dual-column sleek design featuring a colored sidebar, profile photo, and skill meters.',
        badge: 'Modern',
      },
      cvTable: {
        title: 'CV - Interactive Tabular',
        desc: 'Structured tabular resume layout with dynamic row creation and organized sections.',
        badge: 'Tabular',
      },
      cvClassic: {
        title: 'CV - Classic Executive',
        desc: 'Prestigious academic and executive format with clean typography and balanced layout.',
        badge: 'Classic',
      },
      searchText: {
        title: 'Search in PDF',
        desc: 'Quickly find any word or phrase across all PDF pages with exact match locations and snippets.',
        badge: 'Instant Search',
        searchPlaceholder: 'Type word or phrase to search...',
        searchBtn: 'Search Document',
        resultsFound: 'matches found',
        matchesOnPages: 'matches across pages',
        noMatches: 'No matching text found in document',
        searching: 'Scanning text locally...',
        clearSearch: 'Clear',
        jumpToPage: 'Jump to page',
        copyPages: 'Copy Page Numbers',
        copied: 'Copied!',
        caseSensitive: 'Case Sensitive',
        matchingPages: 'Jump to page:',
      },
      merge: {
        title: 'Merge PDF',
        desc: 'Combine multiple PDF files into a single organized document seamlessly.',
        badge: 'Popular',
        addMore: 'Add More Files',
        mergeAction: 'Merge PDF Files',
      },
      split: {
        title: 'Split PDF',
        desc: 'Extract customized page ranges or single pages into separate documents.',
        badge: 'Precise',
        modeRange: 'Custom Ranges',
        modeFixed: 'Fixed Intervals',
        modePages: 'Specific Pages',
        rangeTitle: 'Range',
        fromPage: 'From Page',
        toPage: 'To',
        addRange: 'Add Range',
        removeRange: 'Remove Range',
        mergeAllRanges: 'Merge all ranges into one single PDF',
        splitAction: 'Split PDF',
        everyPages: 'Split every X pages:',
        extractPagesDesc: 'Enter comma-separated page numbers (e.g. 1, 3, 5-8)',
        outputMethod: 'Output & File Saving Format:',
        separateZip: 'Separate Files in a Compressed ZIP Archive',
        separateZipDesc: 'Split into individual PDF files and download them together in a single ZIP archive.',
        mergePdfOption: 'Merge Extracted Ranges into One PDF',
        mergePdfOptionDesc: 'Extract the selected ranges and combine them into a single new PDF document.',
        splitEverySinglePage: 'Split Every Single Page (1 page per file)',
        splitActionZip: 'Split & Download as ZIP Archive',
      },
      rotate: {
        title: 'Rotate Pages',
        desc: 'Rotate PDF pages by 90°, 180°, or 270° individually or all at once.',
        badge: 'Visual',
        rotateAllLeft: 'Rotate All Left',
        rotateAllRight: 'Rotate All Right',
        rotateAll180: 'Rotate All 180°',
        resetRotation: 'Reset Rotation',
        rotateAction: 'Save Rotated PDF',
      },
      organize: {
        title: 'Organize Pages',
        desc: 'Reorder, delete redundant pages, or duplicate pages with thumbnail previews.',
        badge: 'Full Control',
        organizeAction: 'Save New Order',
        dragTip: 'Use arrows to move pages forward, backward, or delete unwanted pages.',
      },
      imageToPdf: {
        title: 'Images to PDF',
        desc: 'Convert JPG, PNG, and WebP images into a single cohesive PDF document.',
        badge: 'JPG / PNG',
        orientation: 'Orientation',
        auto: 'Auto',
        portrait: 'Portrait',
        landscape: 'Landscape',
        margins: 'Margins',
        noMargin: 'No Margin',
        smallMargin: 'Small Margin',
        bigMargin: 'Big Margin',
        convertAction: 'Create PDF',
      },
      pdfToImage: {
        title: 'PDF to JPG Images',
        desc: 'Convert every page of your PDF into high-resolution JPG images packaged in a ZIP.',
        badge: 'High Quality',
        format: 'Image Format',
        quality: 'Quality',
        convertAction: 'Convert & Download Images',
        downloadZip: 'Download All Pages (ZIP)',
        singleImage: 'Download Current Page',
      },
      watermark: {
        title: 'Watermark & Page Numbers',
        desc: 'Stamp custom text watermarks or automatic numbering onto pages.',
        badge: 'Branding',
        tabWatermark: 'Text Watermark',
        tabPageNumbers: 'Page Numbers',
        watermarkText: 'Watermark Text',
        watermarkPlaceholder: 'e.g. CONFIDENTIAL / DRAFT',
        opacity: 'Opacity',
        fontSize: 'Font Size',
        rotation: 'Rotation Angle',
        color: 'Color',
        pageNumberFormat: 'Numbering Format',
        position: 'Position',
        bottomCenter: 'Bottom Center',
        bottomRight: 'Bottom Right',
        bottomLeft: 'Bottom Left',
        topCenter: 'Top Center',
        topRight: 'Top Right',
        applyAction: 'Apply Watermark / Numbers',
      },
      protect: {
        title: 'Protect & Unlock',
        desc: 'Secure your PDF files with password protection or remove restriction locks.',
        badge: 'Encrypted',
        tabProtect: 'Set Password',
        tabUnlock: 'Unlock PDF',
        passwordLabel: 'New Password',
        confirmPasswordLabel: 'Confirm Password',
        passwordPlaceholder: 'Enter a strong password',
        unlockPasswordPlaceholder: 'Enter current document password',
        protectAction: 'Encrypt & Protect PDF',
        unlockAction: 'Remove Password',
        passwordsMismatch: 'Passwords do not match',
      },
      edit: {
        title: 'Edit PDF',
        desc: 'Add text annotations, hand-drawn signatures, highlights, and redactions.',
        badge: 'Interactive',
        addText: 'Add Text',
        draw: 'Pen & Signature',
        highlight: 'Highlight',
        rectangle: 'Rectangle',
        redact: 'Redact / Blackout',
        undo: 'Undo',
        clear: 'Clear',
        textPlaceholder: 'Type text here...',
        strokeColor: 'Color',
        strokeWidth: 'Stroke Width',
        fontSize: 'Font Size',
        saveEditsAction: 'Save Edited PDF',
        clickToPlaceText: 'Click on page where you want to place the text',
        insertPageHere: 'Insert Blank Page',
      },
      compress: {
        title: 'Compress PDF',
        desc: 'Reduce PDF file size by optimizing page layers and raster elements.',
        badge: 'Optimize',
        maxCompress: 'Maximum Compression',
        maxCompressDesc: 'Smallest file size, lower graphic quality',
        midCompress: 'Medium Compression (Recommended)',
        midCompressDesc: 'Balanced quality and file size for emailing',
        lowCompress: 'Low Compression',
        lowCompressDesc: 'High visual quality, mild compression',
        compressAction: 'Compress PDF File',
      },
      badgeGenerator: {
        title: 'ID Badge Generator (CR80)',
        desc: 'Design and print professional employee ID badges with live vCard QR code, custom colors, and export to PDF or high-res PNG.',
        badge: 'CR80 Standard',
      },
      stampRemover: {
        title: 'Signature & Stamp Background Remover',
        desc: 'Turn signature paper backgrounds into crisp transparent PNGs with live threshold adjustments for contracts and PDF overlays.',
        badge: 'Instant Transparent',
      },
      imageTools: {
        title: 'Image Converter & Compressor',
        desc: 'Rotate, convert between PNG/JPG/WebP, and compress images with live file size comparison before adding to documents.',
        badge: 'Image Suite',
      },
      textTools: {
        title: 'Smart Text Utilities (Clean, Diff, Counter, AES)',
        desc: 'Complete text prep tools: clean tashkeel and spaces, compare differences between versions, word stats, and AES encryption.',
        badge: 'Text Tools',
      },
      qrGenerator: {
        title: 'Smart QR Code Generator',
        desc: 'Create offline QR codes for links, phone calls, WhatsApp messages, and Wi-Fi networks with high-res export.',
        badge: 'Offline QR',
      },
      redact: {
        title: 'Redact & Censor PDF',
        desc: 'Permanently hide, blackout, blur, or whiteout sensitive data and text in PDF pages directly in your browser.',
        badge: 'Privacy & Security',
        blackout: 'Blackout Censor',
        whiteout: 'Whiteout Mask',
        blur: 'Pixelate / Blur',
        labeled: '[REDACTED] Label',
        highlight: 'Highlight',
        strike: 'Strikethrough',
        redAlert: 'Red Alert Block',
        clearPage: 'Clear Page Redactions',
        clearAll: 'Clear All Pages',
        undo: 'Undo',
        downloadRedacted: 'Download Redacted PDF',
        activeRedactions: 'Active Redactions on Page',
        noRedactionsOnPage: 'No redactions on this page yet',
        redactionsCount: 'Redactions',
        dragTip: 'Click and drag over text or images on the page to apply redaction.',
        linePreset: 'Full Line',
        signaturePreset: 'Signature Box',
        customLabelPlaceholder: 'Label text (e.g. [REDACTED])',
        customColor: 'Custom Color Censor 🎨',
        eyedropper: 'Eyedropper (from document)',
        eyedropperActiveTip: 'Click anywhere inside the document page to sample its exact paper or background color',
        colorPresets: 'Paper Color Presets',
        opacity: 'Opacity',
      },
      sign: {
        title: 'Sign PDF Electronically',
        desc: 'Draw your signature or upload a transparent image, then place and scale it precisely on any or all pages.',
        badge: 'E-Signature',
      },
      ocr: {
        title: 'Extract Text (OCR)',
        desc: 'Extract editable text from scanned documents and images supporting Arabic and English.',
        badge: 'Arabic + English',
      },
      idPhoto: {
        title: 'ID & Passport Photo Maker',
        desc: 'Crop and prepare official ID photos for passports and visas with a print-ready 4x6 sheet.',
        badge: 'Official Sizes',
      },
      hijri: {
        title: 'Hijri & Gregorian Converter',
        desc: 'Convert accurately between Umm al-Qura Hijri and Gregorian calendars with today’s live date.',
        badge: 'Umm al-Qura',
      },
      metadataCleaner: {
        title: 'Clear PDF Metadata & Privacy',
        desc: 'Inspect and remove author names, creator software, and hidden metadata before sending files.',
        badge: 'Privacy Shield',
      },
      invoice: {
        title: 'ZATCA Tax Invoice Generator',
        desc: 'Generate compliant standard and simplified tax invoices with QR code and PDF print.',
        badge: 'E-Invoicing',
      },
      voucher: {
        title: 'Receipt & Payment Voucher',
        desc: 'Create official receipt and payment vouchers with automatic words conversion and instant print.',
        badge: 'Financial Vouchers',
      },
      vatCalculator: {
        title: 'VAT Calculator (15% & 5%)',
        desc: 'Calculate VAT inclusive or exclusive values with instant breakdown and tafqeet in words.',
        badge: 'Tax & VAT',
      },
      tafqeet: {
        title: 'Amount to Words (Tafqeet)',
        desc: 'Convert numeric amounts into accurate classical Arabic words for cheques and contracts.',
        badge: 'Financial Words',
      },
      nup: {
        title: 'N-Up Multiple Pages on One Sheet',
        desc: 'Combine 2, 4, 6, or 9 pages onto a single A4 sheet to save ink and paper.',
        badge: 'Save Paper',
      },
      pdfGrayscale: {
        title: 'Convert PDF to Grayscale / B&W',
        desc: 'Convert color documents to clean grayscale or black and white for ink-saving printing.',
        badge: 'Save Ink',
      },
      imageWatermark: {
        title: 'Watermark on Images',
        desc: 'Add custom text, logo, or copyright watermark to single or batch images.',
        badge: 'Copyright',
      },
      socialCrop: {
        title: 'Social Media Crop & Resize',
        desc: 'Quickly resize and crop images to official dimensions for Instagram, TikTok, Twitter, and LinkedIn.',
        badge: 'Social Media',
      },
      stitchImages: {
        title: 'Stitch Multiple Images',
        desc: 'Combine multiple screenshots and photos vertically or horizontally into one long image.',
        badge: 'Image Stitch',
      },
      dateCalculator: {
        title: 'Age & Date Calculator',
        desc: 'Accurately calculate age in Gregorian and Hijri, date difference, and add/subtract durations.',
        badge: 'Calendar & Age',
      },
      clearance: {
        title: 'Electronic Final Clearance Certificate',
        desc: 'Generate official labor final settlements, release forms, and custody clearances with popup printing.',
        badge: 'Labor & Legal',
      },
      payroll: {
        title: 'Electronic Monthly Payroll Register',
        desc: 'Generate 12-month payroll sheets with automated net wage calculation and popup printing.',
        badge: '12 Months & Calc',
      },
      textCrypto: {
        title: 'Text Encrypt & Decrypt',
        desc: 'Securely encrypt and decrypt text locally with or without password using Web Crypto AES-256.',
        badge: 'AES-256',
      },
      wordCounter: {
        title: 'Word & Character Counter',
        desc: 'Real-time statistics for words, characters, paragraphs, reading and speaking time.',
        badge: 'Live Counter',
      },
      textCompare: {
        title: 'Text & Contract Diff Comparison',
        desc: 'Compare document drafts and contracts with detailed addition/deletion reporting and match percentage.',
        badge: 'Diff Checker',
      },
      pageNumbering: {
        title: 'Advanced PDF Page Numbering',
        desc: 'Add customizable page numbers to PDF documents with multiple patterns, flexible positions, and fonts.',
        badge: 'Page Numbering',
      },
      textCleaner: {
        title: 'Instant Text Cleaner & Log',
        desc: 'Clean and strip punctuation, tashkeel, numbers, brackets, and extra spaces with real-time audit log.',
        badge: 'Instant Clean',
      },
    },
  },

  es: {
    appName: 'PdfDoer',
    appTagline: 'Procesa, edita y organiza archivos PDF en tu navegador con total privacidad.',
    privacyBadge: '🔒 100% Local — Tus archivos nunca salen de tu dispositivo',
    privacyBadgeShort: '100% Privado y Local',
    privacyDetail: 'Todas las operaciones se realizan localmente en tu navegador sin subirse a ningún servidor externo.',
    lightMode: 'Modo Claro',
    darkMode: 'Modo Oscuro',
    switchLanguage: 'Idioma',
    backToTools: 'Volver a herramientas',
    selectFile: 'Seleccionar archivo PDF',
    selectFiles: 'Seleccionar archivos PDF',
    dragDropFile: 'Arrastra y suelta el archivo aquí, o haz clic para seleccionarlo',
    dragDropFiles: 'Arrastra y suelta archivos aquí, o haz clic para seleccionar',
    supportsPdf: 'Compatible con todos los archivos PDF estándar',
    supportsImages: 'Compatible con imágenes JPG, PNG, WebP',
    fileSize: 'Tamaño',
    pagesCount: 'Páginas',
    removeFile: 'Eliminar',
    moveUp: 'Subir',
    moveDown: 'Bajar',
    applyChanges: 'Aplicar cambios',
    processing: 'Procesando localmente...',
    downloadReady: '¡Tu archivo está listo!',
    downloadNow: 'Descargar archivo ahora',
    newFileName: 'Nombre del nuevo archivo',
    saveAs: 'Guardar como',
    sizeReduction: 'Reducción de tamaño',
    processAnother: 'Procesar otro archivo',
    errorProcessing: 'Ocurrió un error al procesar el archivo.',
    cancel: 'Cancelar',
    close: 'Cerrar',
    apply: 'Aplicar',
    preview: 'Vista previa',
    allPages: 'Todas las páginas',
    selectPage: 'Seleccionar página',
    page: 'Página',
    of: 'de',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    rotateLeft: 'Girar a la izquierda (90°)',
    rotateRight: 'Girar a la derecha (90°)',
    deletePage: 'Eliminar página',
    duplicatePage: 'Duplicar página',
    restorePage: 'Restaurar página',
    sidebarTitle: 'Herramientas y funciones',
    homeOverview: 'Inicio (Todas las herramientas)',
    toggleSidebar: 'Alternar barra lateral',
    replaceFile: 'Reemplazar archivo',
    deleteFile: 'Eliminar archivo',
    fileLoaded: 'Archivo cargado',

    categories: {
      all: 'Todas las herramientas',
      search: 'Buscar en PDF',
      organize: 'Organizar y ordenar',
      convert: 'Conversión de imágenes',
      security: 'Seguridad y contraseña',
      edit: 'Editor y marcas de agua',
      cv: 'Currículum (CV)',
    },
    tools: {
      cvBuilder: {
        title: 'Creador de Currículum (CV)',
        desc: 'Crea currículums interactivos profesionales con plantillas modernas y tabulares, listos para imprimir o guardar en PDF.',
        badge: 'Imprimir y PDF',
      },
      cvModern: {
        title: 'CV - Estilo Moderno',
        desc: 'Diseño elegante de dos columnas con barra lateral para foto, contactos y habilidades.',
        badge: 'Moderno',
      },
      cvTable: {
        title: 'CV - Tabular Interactivo',
        desc: 'Estructura organizada en tablas con soporte para agregar y eliminar filas dinámicamente.',
        badge: 'Tabular',
      },
      cvClassic: {
        title: 'CV - Clásico Ejecutivo',
        desc: 'Formato académico y ejecutivo distinguido con tipografía limpia y equilibrada.',
        badge: 'Clásico',
      },
      searchText: {
        title: 'Buscar en PDF',
        desc: 'Encuentra rápidamente cualquier palabra o frase en todas las páginas con ubicación exacta y fragmentos.',
        badge: 'Búsqueda instantánea',
        searchPlaceholder: 'Escribe la palabra o frase a buscar...',
        searchBtn: 'Buscar en el archivo',
        resultsFound: 'coincidencias encontradas',
        matchesOnPages: 'coincidencias en páginas',
        noMatches: 'No se encontraron coincidencias en el documento',
        searching: 'Examinando texto localmente...',
        clearSearch: 'Limpiar',
        jumpToPage: 'Ir a la página',
        copyPages: 'Copiar números de página',
        copied: '¡Copiado!',
        caseSensitive: 'Sensible a mayúsculas',
        matchingPages: 'Ir a la página:',
      },
      merge: {
        title: 'Unir PDF',
        desc: 'Combina múltiples archivos PDF en un solo documento organizado.',
        badge: 'Popular',
        addMore: 'Añadir más archivos',
        mergeAction: 'Unir archivos PDF',
      },
      split: {
        title: 'Dividir PDF',
        desc: 'Extrae rangos de páginas o páginas individuales en documentos separados.',
        badge: 'Preciso',
        modeRange: 'Rangos personalizados',
        modeFixed: 'Intervalos fijos',
        modePages: 'Páginas específicas',
        rangeTitle: 'Rango',
        fromPage: 'Desde la página',
        toPage: 'Hasta',
        addRange: 'Añadir rango',
        removeRange: 'Quitar rango',
        mergeAllRanges: 'Unir todos los rangos en un único PDF',
        splitAction: 'Dividir PDF',
        everyPages: 'Dividir cada X páginas:',
        extractPagesDesc: 'Escribe páginas separadas por coma (ej. 1, 3, 5-8)',
      },
      rotate: {
        title: 'Rotar Páginas',
        desc: 'Gira las páginas de tu PDF a 90°, 180° o 270° de forma individual o total.',
        badge: 'Visual',
        rotateAllLeft: 'Rotar todo a la izquierda',
        rotateAllRight: 'Rotar todo a la derecha',
        rotateAll180: 'Rotar todo 180°',
        resetRotation: 'Restablecer rotación',
        rotateAction: 'Guardar PDF rotado',
      },
      organize: {
        title: 'Organizar Páginas',
        desc: 'Reordena, elimina o duplica páginas mediante miniaturas interactivas.',
        badge: 'Control Total',
        organizeAction: 'Guardar nuevo orden',
        dragTip: 'Usa los controles para mover páginas adelante, atrás o borrarlas.',
      },
      imageToPdf: {
        title: 'Imágenes a PDF',
        desc: 'Convierte imágenes JPG, PNG y WebP en un documento PDF estructurado.',
        badge: 'JPG / PNG',
        orientation: 'Orientación',
        auto: 'Automática',
        portrait: 'Vertical',
        landscape: 'Horizontal',
        margins: 'Márgenes',
        noMargin: 'Sin márgenes',
        smallMargin: 'Margen pequeño',
        bigMargin: 'Margen amplio',
        convertAction: 'Crear PDF',
      },
      pdfToImage: {
        title: 'PDF a JPG',
        desc: 'Convierte cada página de tu PDF a imágenes JPG de alta calidad en un ZIP.',
        badge: 'Alta Calidad',
        format: 'Formato',
        quality: 'Calidad',
        convertAction: 'Convertir y descargar imágenes',
        downloadZip: 'Descargar todo (ZIP)',
        singleImage: 'Descargar página actual',
      },
      watermark: {
        title: 'Marca de agua y numeración',
        desc: 'Inserta marcas de agua transparentes o números de página automáticamente.',
        badge: 'Documentación',
        tabWatermark: 'Marca de agua',
        tabPageNumbers: 'Números de página',
        watermarkText: 'Texto de la marca',
        watermarkPlaceholder: 'ej. CONFIDENCIAL / COPIA',
        opacity: 'Opacidad',
        fontSize: 'Tamaño de fuente',
        rotation: 'Ángulo',
        color: 'Color',
        pageNumberFormat: 'Formato de número',
        position: 'Posición',
        bottomCenter: 'Inferior centro',
        bottomRight: 'Inferior derecha',
        bottomLeft: 'Inferior izquierda',
        topCenter: 'Superior centro',
        topRight: 'Superior derecha',
        applyAction: 'Aplicar marca y números',
      },
      protect: {
        title: 'Proteger y Desbloquear',
        desc: 'Protege tu archivo PDF con contraseña cifrada o elimina contraseñas conocidas.',
        badge: 'Cifrado',
        tabProtect: 'Poner contraseña',
        tabUnlock: 'Desbloquear PDF',
        passwordLabel: 'Nueva contraseña',
        confirmPasswordLabel: 'Confirmar contraseña',
        passwordPlaceholder: 'Ingresa una contraseña segura',
        unlockPasswordPlaceholder: 'Ingresa la contraseña actual del documento',
        protectAction: 'Cifrar y proteger PDF',
        unlockAction: 'Desbloquear PDF',
        passwordsMismatch: 'Las contraseñas no coinciden',
      },
      edit: {
        title: 'Editar PDF',
        desc: 'Añade textos, firmas manuales, resaltados y censuras directamente en las páginas.',
        badge: 'Interactivo',
        addText: 'Añadir texto',
        draw: 'Lápiz y firma',
        highlight: 'Resaltar',
        rectangle: 'Rectángulo',
        redact: 'Censurar (negro)',
        undo: 'Deshacer',
        clear: 'Limpiar',
        textPlaceholder: 'Escribe aquí...',
        strokeColor: 'Color',
        strokeWidth: 'Grosor',
        fontSize: 'Tamaño',
        saveEditsAction: 'Guardar PDF editado',
        clickToPlaceText: 'Haz clic en la página donde deseas colocar el texto',
        insertPageHere: 'Insertar página en blanco',
      },
      compress: {
        title: 'Comprimir PDF',
        desc: 'Reduce el tamaño de tu archivo PDF optimizando capas y gráficos.',
        badge: 'Optimizar',
        maxCompress: 'Compresión máxima',
        maxCompressDesc: 'Menor tamaño de archivo, calidad básica',
        midCompress: 'Compresión media (Recomendado)',
        midCompressDesc: 'Equilibrio ideal para envío por correo',
        lowCompress: 'Compresión baja',
        lowCompressDesc: 'Alta calidad visual, compresión sutil',
        compressAction: 'Comprimir PDF',
      },
      redact: {
        title: 'Censurar y Ocultar PDF',
        desc: 'Oculta y censura permanentemente información confidencial en páginas PDF con bloques negros, blancos o difuminados.',
        badge: 'Seguridad',
        blackout: 'Censura Negra',
        whiteout: 'Censura Blanca',
        blur: 'Efecto Mosaico (Pixel)',
        labeled: 'Etiqueta [CONFIDENCIAL]',
        highlight: 'Resaltador',
        strike: 'Tachado Rojo',
        redAlert: 'Bloque Rojo',
        clearPage: 'Borrar en esta página',
        clearAll: 'Borrar en todas las páginas',
        undo: 'Deshacer',
        downloadRedacted: 'Descargar PDF Censurado',
        activeRedactions: 'Censuras en esta página',
        noRedactionsOnPage: 'No hay censuras en esta página aún',
        redactionsCount: 'censuras',
        dragTip: 'Arrastra el cursor sobre el texto o imagen para censurar.',
        linePreset: 'Línea completa',
        signaturePreset: 'Cuadro de firma',
        customLabelPlaceholder: 'Texto de etiqueta (ej. [CONFIDENCIAL])',
        customColor: 'Censura de color personalizado 🎨',
        eyedropper: 'Cuentagotas (del documento)',
        eyedropperActiveTip: 'Haz clic en cualquier punto de la página para tomar el color exacto del papel',
        colorPresets: 'Colores de papel predefinidos',
        opacity: 'Opacidad',
      },
    },
  },

  hi: {
    appName: 'PdfDoer',
    appTagline: '100% गोपनीयता के साथ अपने ब्राउज़र में पीडीएफ फाइलों को सीधे प्रोसेस और एडिट करें।',
    privacyBadge: '🔒 100% स्थानीय प्रोसेसिंग — आपकी फाइलें डिवाइस से कभी बाहर नहीं जाती हैं',
    privacyBadgeShort: '100% सुरक्षित और स्थानीय',
    privacyDetail: 'सभी कार्य सीधे आपके ब्राउज़र में होते हैं। कोई भी फाइल किसी बाहरी सर्वर पर अपलोड नहीं की जाती है।',
    lightMode: 'लाइट मोड',
    darkMode: 'डार्क मोड',
    switchLanguage: 'भाषा चुनें',
    backToTools: 'सभी टूल्स पर वापस जाएं',
    selectFile: 'पीडीएफ फाइल चुनें',
    selectFiles: 'पीडीएफ फाइलें चुनें',
    dragDropFile: 'फाइल यहां खींचें और छोड़ें, या चुनने के लिए क्लिक करें',
    dragDropFiles: 'फाइलें यहां खींचें और छोड़ें, या क्लिक करें',
    supportsPdf: 'सभी सामान्य पीडीएफ फाइलों का समर्थन करता है',
    supportsImages: 'JPG, PNG, WebP इमेज सपोर्ट',
    fileSize: 'आकार',
    pagesCount: 'कुल पृष्ठ',
    removeFile: 'हटाएं',
    moveUp: 'ऊपर करें',
    moveDown: 'नीचे करें',
    applyChanges: 'बदलाव लागू करें',
    processing: 'प्रोसेस हो रहा है...',
    downloadReady: 'आपकी फाइल तैयार है!',
    downloadNow: 'फाइल अभी डाउनलोड करें',
    newFileName: 'नया फाइल नाम',
    saveAs: 'इस रूप में सहेजें',
    sizeReduction: 'आकार में कमी',
    processAnother: 'अन्य फाइल प्रोसेस करें',
    errorProcessing: 'फाइल प्रोसेस करने में त्रुटि हुई।',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    apply: 'लागू करें',
    preview: 'पूर्वावलोकन',
    allPages: 'सभी पृष्ठ',
    selectPage: 'पृष्ठ चुनें',
    page: 'पृष्ठ',
    of: 'का',
    zoomIn: 'ज़ूम इन',
    zoomOut: 'ज़ूम आउट',
    rotateLeft: 'बाएं घुमाएं (90°)',
    rotateRight: 'दाएं घुमाएं (90°)',
    deletePage: 'पृष्ठ हटाएं',
    duplicatePage: 'पृष्ठ कॉपी करें',
    restorePage: 'पुنर्स्थापित करें',
    sidebarTitle: 'टूल्स और सुविधाएं',
    homeOverview: 'होम (सभी टूल्स)',
    toggleSidebar: 'साइडबार टॉगल करें',
    replaceFile: 'फाइल बदलें',
    deleteFile: 'फाइल हटाएं',
    fileLoaded: 'फाइल लोड हो गई',

    categories: {
      all: 'सभी टूल्स',
      search: 'पीडीएफ में खोजें',
      organize: 'व्यवस्थित करें',
      convert: 'इमेज कनवर्टर',
      security: 'सुरक्षा और पासवर्ड',
      edit: 'एडिटर और वॉटरमार्क',
      cv: 'बायोडाटा / सीवी (CV)',
    },
    tools: {
      cvBuilder: {
        title: 'सीवी / बायोडाटा मेकर (CV Builder)',
        desc: 'आधुनिक, सारणीबद्ध और कार्यकारी लेआउट के साथ पेशेवर सीवी बनाएं और सीधे पीडीएफ के रूप में प्रिंट करें।',
        badge: 'प्रिंट और पीडीएफ',
      },
      cvModern: {
        title: 'सीवी - आधुनिक शैली (Modern)',
        desc: 'आकर्षक दो-कॉलम डिज़ाइन, रंगीन साइडबार, फोटो और कौशल प्रतिशत बार।',
        badge: 'आधुनिक',
      },
      cvTable: {
        title: 'सीवी - सारणीबद्ध / इंटरैक्टिव (Tabular)',
        desc: 'व्यवस्थित तालिका लेआउट जहां आप पंक्तियां और अनुभाग जोड़ और हटा सकते हैं।',
        badge: 'सारणीबद्ध',
      },
      cvClassic: {
        title: 'सीवी - क्लासिक कार्यकारी (Classic)',
        desc: 'सटीक और सुरुचिपूर्ण प्रारूप, शैक्षणिक और वरिष्ठ पदों के लिए उपयुक्त।',
        badge: 'क्लासिक',
      },
      searchText: {
        title: 'पीडीएफ में खोजें (Search)',
        desc: 'पीडीएफ के सभी पृष्ठों में कोई भी शब्द या वाक्य तेजी से खोजें और पृष्ठ संख्या देखें।',
        badge: 'तत्काल खोज',
        searchPlaceholder: 'खोजने के लिए शब्द या वाक्य लिखें...',
        searchBtn: 'दस्तावेज़ में खोजें',
        resultsFound: 'परिणाम मिले',
        matchesOnPages: 'पृष्ठों पर परिणाम',
        noMatches: 'दस्तावेज़ में कोई मेल नहीं मिला',
        searching: 'स्थानीय रूप से खोज जारी है...',
        clearSearch: 'साफ करें',
        jumpToPage: 'पृष्ठ पर जाएं',
        copyPages: 'पृष्ठ संख्याएं कॉपी करें',
        copied: 'कॉपी हो गया!',
        caseSensitive: 'केस-संवेदनशील',
        matchingPages: 'पृष्ठ पर जाएं:',
      },
      merge: {
        title: 'पीडीएफ मर्ज करें',
        desc: 'एकाधिक पीडीएफ फाइलों को एक संगठित दस्तावेज़ में आसानी से जोड़ें।',
        badge: 'लोकप्रिय',
        addMore: 'और फाइलें जोड़ें',
        mergeAction: 'पीडीएफ फाइलें मर्ज करें',
      },
      split: {
        title: 'पीडीएफ विभाजित करें',
        desc: 'विशिष्ट पृष्ठों या श्रेणियों को अलग-अलग फाइलों में निकालें।',
        badge: 'सटीक',
        modeRange: 'कस्टम रेंज',
        modeFixed: 'निश्चित अंतराल',
        modePages: 'विशेष पृष्ठ',
        rangeTitle: 'रेंज',
        fromPage: 'पृष्ठ से',
        toPage: 'तक',
        addRange: 'नया रेंज जोड़ें',
        removeRange: 'रेंज हटाएं',
        mergeAllRanges: 'सभी श्रेणियों को एक पीडीएफ में जोड़ें',
        splitAction: 'पीडीएफ विभाजित करें',
        everyPages: 'हर इतने पृष्ठों पर विभाजित करें:',
        extractPagesDesc: 'कॉमा से अलग करके पृष्ठ संख्या दर्ज करें (उदा. 1, 3, 5-8)',
      },
      rotate: {
        title: 'पृष्ठ घुमाएं (Rotate)',
        desc: 'पीडीएफ पृष्ठों को 90°, 180° या 270° पर व्यक्तिगत रूप से या एक साथ घुमाएं।',
        badge: 'दृश्य',
        rotateAllLeft: 'सभी बाएं घुमाएं',
        rotateAllRight: 'सभी दाएं घुमाएं',
        rotateAll180: 'सभी 180° घुमाएं',
        resetRotation: 'रीसेट करें',
        rotateAction: 'घुमाई गई पीडीएफ सहेजें',
      },
      organize: {
        title: 'पृष्ठ व्यवस्थित करें',
        desc: 'पृष्ठों का क्रम बदलें, गैर-जरूरी पृष्ठ हटाएं या डुप्लिकेट करें।',
        badge: 'पूर्ण नियंत्रण',
        organizeAction: 'नया क्रम सहेजें',
        dragTip: 'पृष्ठों को आगे-पीछे करने या हटाने के लिए बटनों का उपयोग करें।',
      },
      imageToPdf: {
        title: 'इमेज से पीडीएफ',
        desc: 'JPG, PNG इमेज को एक सुंदर पीडीएफ दस्तावेज़ में बदलें।',
        badge: 'JPG / PNG',
        orientation: 'दिशा',
        auto: 'ऑटो',
        portrait: 'सीधा (Portrait)',
        landscape: 'आड़ा (Landscape)',
        margins: 'मार्जिन',
        noMargin: 'कोई मार्जिन नहीं',
        smallMargin: 'छोटा मार्जिन',
        bigMargin: 'बड़ा मार्जिन',
        convertAction: 'पीडीएफ बनाएं',
      },
      pdfToImage: {
        title: 'पीडीएफ से JPG इमेज',
        desc: 'पीडीएफ के प्रत्येक पृष्ठ को हाई-क्वालिटी JPG में बदलकर ZIP में डाउनलोड करें।',
        badge: 'उच्च गुणवत्ता',
        format: 'प्रारूप',
        quality: 'गुणवत्ता',
        convertAction: 'इमेज बनाएं और डाउनलोड करें',
        downloadZip: 'सभी पृष्ठ डाउनलोड करें (ZIP)',
        singleImage: 'यह पृष्ठ डाउनलोड करें',
      },
      watermark: {
        title: 'वॉटरमार्क और पेज नंबर',
        desc: 'दस्तावेज़ में टेक्स्ट वॉटरमार्क या स्वचालित पेज नंबर जोड़ें।',
        badge: 'सुरक्षा',
        tabWatermark: 'टेक्स्ट वॉटरमार्क',
        tabPageNumbers: 'पेज नंबर',
        watermarkText: 'वॉटरमार्क टेक्स्ट',
        watermarkPlaceholder: 'उदा. गोपनीय / DRAFT',
        opacity: 'पारदर्शिता',
        fontSize: 'फॉन्ट आकार',
        rotation: 'कोण',
        color: 'रंग',
        pageNumberFormat: 'नंबर प्रारूप',
        position: 'स्थिति',
        bottomCenter: 'नीचे केंद्र',
        bottomRight: 'नीचे दाएं',
        bottomLeft: 'नीचे बाएं',
        topCenter: 'ऊपर केंद्र',
        topRight: 'ऊपर दाएं',
        applyAction: 'वॉटरमार्क और नंबर लागू करें',
      },
      protect: {
        title: 'सुरक्षा और पासवर्ड',
        desc: 'पीडीएफ पर पासवर्ड लॉक लगाएं या मौजूदा पासवर्ड हटाएं।',
        badge: 'एन्क्रिप्शन',
        tabProtect: 'पासवर्ड लगाएं',
        tabUnlock: 'अनलॉक करें',
        passwordLabel: 'नया पासवर्ड',
        confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
        passwordPlaceholder: 'मजबूत पासवर्ड दर्ज करें',
        unlockPasswordPlaceholder: 'वर्तमान पासवर्ड दर्ज करें',
        protectAction: 'पासवर्ड सुरक्षित करें',
        unlockAction: 'पासवर्ड हटाएं',
        passwordsMismatch: 'पासवर्ड मेल नहीं खाते',
      },
      edit: {
        title: 'पीडीएफ संपादित करें (Edit)',
        desc: 'टेक्स्ट जोड़ें, हस्ताक्षर बनाएं, हाइलाइट करें और संवेदनशील टेक्स्ट छिपाएं।',
        badge: 'इंटरैक्टिव',
        addText: 'टेक्स्ट जोड़ें',
        draw: 'पेन और हस्ताक्षर',
        highlight: 'हाइलाइट',
        rectangle: 'आयत (Shape)',
        redact: 'गोपनीय छिपाएं (Redact)',
        undo: 'पूर्ववत करें',
        clear: 'साफ़ करें',
        textPlaceholder: 'यहाँ लिखें...',
        strokeColor: 'रंग',
        strokeWidth: 'मोटाई',
        fontSize: 'आकार',
        saveEditsAction: 'एडिट किया हुआ पीडीएफ सहेजें',
        clickToPlaceText: 'टेक्स्ट रखने के लिए पेज पर क्लिक करें',
        insertPageHere: 'खाली पृष्ठ जोड़ें',
      },
      compress: {
        title: 'पीडीएफ कंप्रेस करें',
        desc: 'गुणवत्ता बनाए रखते हुए पीडीएफ फाइल का आकार कम करें।',
        badge: 'आकार कम करें',
        maxCompress: 'अधिकतम कंप्रेशन',
        maxCompressDesc: 'सबसे छोटा आकार, बुनियादी गुणवत्ता',
        midCompress: 'मध्यम कंप्रेशन (अनुशंसित)',
        midCompressDesc: 'ईमेल के लिए संतुलित गुणवत्ता और आकार',
        lowCompress: 'कम कंप्रेशन',
        lowCompressDesc: 'उच्च गुणवत्ता, हल्का कंप्रेशन',
        compressAction: 'पीडीएफ कंप्रेस करें',
      },
      redact: {
        title: 'पीडीएफ संवेदनशील डेटा छिपाएं (Redact)',
        desc: 'पीडीएफ पेजों में संवेदनशील डेटा को ब्लैकआउट, व्हाइटआउट, या ब्लर करके पूरी तरह सुरक्षित और स्थायी रूप से छिपाएं।',
        badge: 'सुरक्षा और प्राइवेसी',
        blackout: 'ब्लैकआउट पर्दा',
        whiteout: 'व्हाइटआउट पर्दा',
        blur: 'धुंधला (Pixelate/Blur)',
        labeled: '[REDACTED] लेबल',
        highlight: 'हाइलाइट',
        strike: 'रेड स्ट्राइकथ्रू',
        redAlert: 'रेड अलर्ट ब्लॉक',
        clearPage: 'इस पेज से हटाएं',
        clearAll: 'सभी पेजों से हटाएं',
        undo: 'पूर्ववत करें',
        downloadRedacted: 'संशोधित पीडीएफ डाउनलोड करें',
        activeRedactions: 'इस पेज पर छिपाई गई वस्तुएं',
        noRedactionsOnPage: 'इस पेज पर अभी कोई संपादन नहीं है',
        redactionsCount: 'संपादित भाग',
        dragTip: 'टेक्स्ट या इमेज पर कर्सर खींचकर छिपाएं।',
        linePreset: 'पूरी लाइन',
        signaturePreset: 'हस्ताक्षर बॉक्स',
        customLabelPlaceholder: 'लेबल टेक्स्ट (उदा. [CONFIDENTIAL])',
        customColor: 'कस्टम रंग से छिपाएं 🎨',
        eyedropper: 'आईड्रॉपर / रंग पिकर (दस्तावेज़ से)',
        eyedropperActiveTip: 'पेज पर कहीं भी क्लिक करके उसका सटीक रंग उठाएं',
        colorPresets: 'कागज़ के सामान्य रंग',
        opacity: 'पारदर्शिता',
      },
    },
  },

  ur: {
    appName: 'PdfDoer',
    appTagline: 'اپنے براؤزر میں مکمل پرائیویسی کے ساتھ پی ڈی ایف فائلوں کو پروسیس اور ایڈٹ کریں۔',
    privacyBadge: '🔒 100% مقامی پروسیسنگ — فائلیں آپ کی ڈیوائس سے باہر نہیں جاتیں',
    privacyBadgeShort: '100% پرائیویٹ اور محفوظ',
    privacyDetail: 'تمام آپریشنز سرور کے بغیر آپ کے براؤزر کے اندر ہی مکمل ہوتے ہیں تاکہ مکمل پرائیویسی برقرار رہے۔',
    lightMode: 'روشن موڈ',
    darkMode: 'ڈارک موڈ',
    switchLanguage: 'زبان تبدیل کریں',
    backToTools: 'تمام ٹولز پر واپس جائیں',
    selectFile: 'پی ڈی ایف فائل منتخب کریں',
    selectFiles: 'پی ڈی ایف فائلیں منتخب کریں',
    dragDropFile: 'فائل یہاں ڈریگ اور ڈراپ کریں، یا منتخب کرنے کے لیے کلک کریں',
    dragDropFiles: 'فائلیں یہاں ڈریگ اور ڈراپ کریں، یا کلک کریں',
    supportsPdf: 'تمام عام پی ڈی ایف فائلوں کو سپورٹ کرتا ہے',
    supportsImages: 'تصاویر JPG، PNG، WebP کی معاونت',
    fileSize: 'سائز',
    pagesCount: 'صفحات',
    removeFile: 'حذف کریں',
    moveUp: 'اوپر کریں',
    moveDown: 'نیچے کریں',
    applyChanges: 'تبدیلیاں لاگو کریں',
    processing: 'مقامی طور پر پروسیسنگ جاری ہے...',
    downloadReady: 'آپ کی فائل تیار ہے!',
    downloadNow: 'ابھی فائل ڈاؤن لوڈ کریں',
    newFileName: 'نیا فائل نام',
    saveAs: 'محفوظ کریں بطور',
    sizeReduction: 'سائز میں کمی',
    processAnother: 'دوسری فائل پروسیس کریں',
    errorProcessing: 'فائل پروسیسنگ کے دوران خرابی پیش آئی۔',
    cancel: 'منسوخ کریں',
    close: 'بند کریں',
    apply: 'لاگو کریں',
    preview: 'پیش نظارہ',
    allPages: 'تمام صفحات',
    selectPage: 'صفحہ منتخب کریں',
    page: 'صفحہ',
    of: 'از',
    zoomIn: 'بڑا کریں',
    zoomOut: 'چھوٹا کریں',
    rotateLeft: 'بائیں گھمائیں (90°)',
    rotateRight: 'دائیں گھمائیں (90°)',
    deletePage: 'صفحہ حذف کریں',
    duplicatePage: 'صفحہ نقل کریں',
    restorePage: 'بحال کریں',
    sidebarTitle: 'ٹولز اور فیچرز',
    homeOverview: 'ہوم (تمام ٹولز)',
    toggleSidebar: 'سائیڈ بار کھولیں/بند کریں',
    replaceFile: 'فائل تبدیل کریں',
    deleteFile: 'فائل حذف کریں',
    fileLoaded: 'فائل لوڈ ہو گئی',

    categories: {
      all: 'تمام ٹولز',
      search: 'پی ڈی ایف میں تلاش',
      organize: 'ترتیب اور تنظیم',
      convert: 'تصویر کی تبدیلی',
      security: 'سیکیورٹی اور پاس ورڈ',
      edit: 'ایڈیٹر اور واٹر مارک',
      cv: 'سی وی اور ریزیومے (CV)',
    },
    tools: {
      cvBuilder: {
        title: 'سی وی بلڈر (CV Builder)',
        desc: 'جدید، ٹیبل اور پروفیشنل فارمیٹس میں شاندار سی وی بنائیں اور فوری پرنٹ یا پی ڈی ایف محفوظ کریں۔',
        badge: 'پرنٹ اور پی ڈی ایف',
      },
      cvModern: {
        title: 'سی وی - جدید اسٹائل (Modern)',
        desc: 'دو کالم پر مشتمل شاندار ڈیزائن، رنگین سائیڈ بار، تصویر اور اسکل بارز۔',
        badge: 'جدید',
      },
      cvTable: {
        title: 'سی وی - انٹرایکٹو ٹیبل (Tabular)',
        desc: 'منظم ٹیبل کی صورت میں سلیقے سے سجی سی وی جس میں آسانی سے قطاریں شامل کریں۔',
        badge: 'ٹیبل',
      },
      cvClassic: {
        title: 'سی وی - کلاسک ایگزیکٹو (Classic)',
        desc: 'علمی، پیشہ ورانہ اور اعلیٰ عہدوں کے لیے موزوں خوبصورت کلاسیکی فارمیٹ۔',
        badge: 'کلاسک',
      },
      searchText: {
        title: 'پی ڈی ایف میں تلاش کریں (Search)',
        desc: 'پی ڈی ایف کے تمام صفحات میں کوئی بھی لفظ یا جملہ تلاش کریں اور صفحات کے نمبر دیکھیں۔',
        badge: 'فوری تلاش',
        searchPlaceholder: 'تلاش کے لیے لفظ یا جملہ لکھیں...',
        searchBtn: 'دستاویز میں تلاش کریں',
        resultsFound: 'نتائج ملے',
        matchesOnPages: 'صفحات پر نتائج',
        noMatches: 'دستاویز میں کوئی مطابقت نہیں ملی',
        searching: 'مقامی طور پر تلاش جاری ہے...',
        clearSearch: 'صاف کریں',
        jumpToPage: 'صفحے پر جائیں',
        copyPages: 'صفحات کے نمبر کاپی کریں',
        copied: 'کاپی ہو گیا!',
        caseSensitive: 'حروف کی حالت (Case sensitive)',
        matchingPages: 'صفحے پر جائیں:',
      },
      merge: {
        title: 'پی ڈی ایف ضم کریں',
        desc: 'متعدد پی ڈی ایف فائلوں کو ایک منظم دستاویز میں آسانی سے یکجا کریں۔',
        badge: 'مقبول ترین',
        addMore: 'مزید فائلیں شامل کریں',
        mergeAction: 'فائلیں ضم کریں',
      },
      split: {
        title: 'پی ڈی ایف تقسیم کریں',
        desc: 'مخصوص صفحات یا حدود کو الگ فائلوں میں تقسیم کریں۔',
        badge: 'درست',
        modeRange: 'اپنی مرضی کی حدود',
        modeFixed: 'مقررہ وقفے',
        modePages: 'مخصوص صفحات',
        rangeTitle: 'حد',
        fromPage: 'صفحہ سے',
        toPage: 'تک',
        addRange: 'نئی حد شامل کریں',
        removeRange: 'حد ختم کریں',
        mergeAllRanges: 'تمام حدود کو ایک پی ڈی ایف میں ضم کریں',
        splitAction: 'پی ڈی ایف تقسیم کریں',
        everyPages: 'ہر اتنے صفحات پر تقسیم کریں:',
        extractPagesDesc: 'صفحات کے نمبر کوما سے الگ کر کے درج کریں (مثال: 1, 3, 5-8)',
      },
      rotate: {
        title: 'صفحات گھمائیں',
        desc: 'صفحات کو 90°، 180° یا 270° کے زاویے پر باآسانی گھمائیں۔',
        badge: 'بصری',
        rotateAllLeft: 'سب کو بائیں گھمائیں',
        rotateAllRight: 'سب کو دائیں گھمائیں',
        rotateAll180: 'سب کو 180° گھمائیں',
        resetRotation: 'ری سیٹ کریں',
        rotateAction: 'گھمائی گئی پی ڈی ایف محفوظ کریں',
      },
      organize: {
        title: 'صفحات کی ترتیب',
        desc: 'صفحات کی ترتیب تبدیل کریں، غیر ضروری صفحات حذف کریں یا کاپی کریں۔',
        badge: 'مکمل کنٹرول',
        organizeAction: 'نئی ترتیب محفوظ کریں',
        dragTip: 'صفحات کو آگے یا پیچھے منتقل کرنے کے لیے بٹن استعمال کریں۔',
      },
      imageToPdf: {
        title: 'تصاویر سے پی ڈی ایف',
        desc: 'JPG اور PNG تصاویر کو ایک معیاری پی ڈی ایف فائل میں تبدیل کریں۔',
        badge: 'JPG / PNG',
        orientation: 'رخ',
        auto: 'خودکار',
        portrait: 'عمودی',
        landscape: 'افقی',
        margins: 'حاشیے',
        noMargin: 'بغیر حاشیہ',
        smallMargin: 'چھوٹا حاشیہ',
        bigMargin: 'بڑا حاشیہ',
        convertAction: 'پی ڈی ایف بنائیں',
      },
      pdfToImage: {
        title: 'پی ڈی ایف سے تصاویر',
        desc: 'پی ڈی ایف کے ہر صفحے کو اعلی کوالٹی کی JPG تصاویر میں تبدیل کریں (ZIP)۔',
        badge: 'ہائی کوالٹی',
        format: 'فارمیٹ',
        quality: 'معیار',
        convertAction: 'تصاویر بنائیں اور ڈاؤن لوڈ کریں',
        downloadZip: 'تمام صفحات ڈاؤن لوڈ کریں (ZIP)',
        singleImage: 'موجودہ صفحہ ڈاؤن لوڈ کریں',
      },
      watermark: {
        title: 'واٹر مارک اور صفحہ نمبر',
        desc: 'اپنی دستاویزات پر شفاف واٹر مارک یا خودکار صفحہ نمبر شامل کریں۔',
        badge: 'تحفظ',
        tabWatermark: 'ٹیکسٹ واٹر مارک',
        tabPageNumbers: 'صفحہ نمبر',
        watermarkText: 'واٹر مارک عبارت',
        watermarkPlaceholder: 'مثال: انتہائی خفیہ / کاپی',
        opacity: 'شفافیت',
        fontSize: 'فونٹ سائز',
        rotation: 'زاویہ',
        color: 'رنگ',
        pageNumberFormat: 'نمبر کی قسم',
        position: 'مقام',
        bottomCenter: 'نیچے درمیان',
        bottomRight: 'نیچے دائیں',
        bottomLeft: 'نیچے بائیں',
        topCenter: 'اوپر درمیان',
        topRight: 'اوپر دائیں',
        applyAction: 'واٹر مارک اور نمبر لگائیں',
      },
      protect: {
        title: 'حفاظت اور پاس ورڈ',
        desc: 'پی ڈی ایف فائل پر محفوظ پاس ورڈ لگائیں یا پاس ورڈ ہٹائیں۔',
        badge: 'انکرپشن',
        tabProtect: 'پاس ورڈ لگائیں',
        tabUnlock: 'پاس ورڈ ہٹائیں',
        passwordLabel: 'نیا پاس ورڈ',
        confirmPasswordLabel: 'پاس ورڈ کی تصدیق',
        passwordPlaceholder: 'مضبوط پاس ورڈ درج کریں',
        unlockPasswordPlaceholder: 'موجودہ پاس ورڈ درج کریں',
        protectAction: 'پاس ورڈ سے محفوظ کریں',
        unlockAction: 'پاس ورڈ ختم کریں',
        passwordsMismatch: 'پاس ورڈ ایک جیسے نہیں ہیں',
      },
      edit: {
        title: 'پی ڈی ایف ایڈیٹر',
        desc: 'ٹیکسٹ لکھیں، دستخط اور خاکے بنائیں، ہائی لائٹ کریں اور رازدارانہ ڈیٹا چھپائیں۔',
        badge: 'انٹرایکٹو',
        addText: 'ٹیکسٹ شامل کریں',
        draw: 'قلم اور دستخط',
        highlight: 'ہائی لائٹ',
        rectangle: 'مستطیل',
        redact: 'سیاہ پردہ (Redact)',
        undo: 'واپس کریں',
        clear: 'صاف کریں',
        textPlaceholder: 'یہاں لکھیں...',
        strokeColor: 'رنگ',
        strokeWidth: 'موٹائی',
        fontSize: 'سائز',
        saveEditsAction: 'تبدیل شدہ پی ڈی ایف محفوظ کریں',
        clickToPlaceText: 'صفحے پر وہاں کلک کریں جہاں آپ عبارت رکھنا چاہتے ہیں',
        insertPageHere: 'خالی صفحہ شامل کریں',
      },
      compress: {
        title: 'پی ڈی ایف سائز کم کریں',
        desc: 'معیار برقرار رکھتے ہوئے پی ڈی ایف فائل کا سائز چھوٹا کریں۔',
        badge: 'سائز گھٹائیں',
        maxCompress: 'زیادہ سے زیادہ سائز کمی',
        maxCompressDesc: 'سب سے چھوٹا سائز، بنیادی گرافکس',
        midCompress: 'درمیانہ دباؤ (تجویز کردہ)',
        midCompressDesc: 'ای میل کے لیے متوازن سائز اور معیار',
        lowCompress: 'ہلکا دباؤ',
        lowCompressDesc: 'اعلیٰ کوالٹی، سائز میں ہلکی کمی',
        compressAction: 'فائل کا سائز کم کریں',
      },
      redact: {
        title: 'پی ڈی ایف سے ڈیٹا چھپائیں اور سنسر کریں',
        desc: 'حساس معلومات، دستخط اور خفیہ ڈیٹا کو بلیک آؤٹ، وائٹ آؤٹ یا بلر کر کے مکمل طور پر محفوظ بنائیں۔',
        badge: 'پرائیویسی اور تحفظ',
        blackout: 'سیاہ پردہ (Blackout)',
        whiteout: 'سفید پردہ (Whiteout)',
        blur: 'دھندلا پن (Pixelate/Blur)',
        labeled: '[محجوب] لیبل',
        highlight: 'ہائی لائٹ',
        strike: 'سرخ لکیر (Strike)',
        redAlert: 'سرخ سنسر باکس',
        clearPage: 'اس صفحے سے ختم کریں',
        clearAll: 'تمام صفحات سے ختم کریں',
        undo: 'واپس کریں',
        downloadRedacted: 'محفوظ پی ڈی ایف ڈاؤن لوڈ کریں',
        activeRedactions: 'اس صفحے پر چھپائی گئی اشیاء',
        noRedactionsOnPage: 'اس صفحے پر فی الحال کوئی سنسر نہیں ہے',
        redactionsCount: 'سنسر شدہ حصے',
        dragTip: 'متن یا تصویر پر ماؤس ڈریگ کر کے چھپائیں۔',
        linePreset: 'مکمل سطر',
        signaturePreset: 'دستخط کا باکس',
        customLabelPlaceholder: 'لیبل کا متن (مثال: [خفیہ])',
        customColor: 'منتخب رنگ کا سنسر 🎨',
        eyedropper: 'رنگوں کی ڈراپر (صفحے سے)',
        eyedropperActiveTip: 'کاغذ کا اصل رنگ منتخب کرنے کے لیے صفحے پر کسی بھی جگہ کلک کریں',
        colorPresets: 'کاغذ کے مروجہ رنگ',
        opacity: 'شفافیت',
      },
    },
  },
};
