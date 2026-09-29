import { NewStudentApplication, RegistrationSettings, User } from '../types';
import { storage } from './storage';

export const DEFAULT_REGISTRATION_SETTINGS: RegistrationSettings = {
  isOpen: true,
  academicYear: '2026/2027',
  reopenDate: '15 أكتوبر 2026 الساعة 09:00 صباحاً',
  announcementTitle: 'القبول والتسجيل متاح للعام الأكاديمي 2026/2027',
  closedMessage:
    'عزيزي المتقدم، نود إحاطتكم علماً بأن باب التسجيل والقبول مغلق حالياً لاستكمال فرز طلبات الدفعة السابقة وإجراء المقابلات الأكاديمية. سيتم فتح باب التقديم الإلكتروني للدفعة القادمة وفق التاريخ والوقت الموضحين أدناه.',
  minSecondaryPercentage: 65,
  contactEmail: 'admission@nsac.edu.sd',
  contactPhone: '+249 912 000 111',
};

// Initial realistic applications to allow immediate testing by the admin
export const DEFAULT_APPLICATIONS: NewStudentApplication[] = [
  {
    ref: 'NSCA-2026-1001',
    createdAt: '2026-09-21T09:30:00.000Z',
    status: 'pending',
    data: {
      nameAr: 'أحمد الصادق عبد الله الفكي',
      nameEn: 'Ahmed Alsadiq Abdalla Elfaki',
      idType: 'national',
      idNumber: '10928374652',
      nationality: 'السودان',
      dob: '2004-05-14',
      age: 22,
      gender: 'male',
      residenceCountry: 'السودان',
      city: 'الخرطوم بحري',
      email: 'ahmed.sadiq@gmail.com',
      dial: '+249',
      phone: '912345678',
      address: 'الخرطوم بحري - حي المزاد - شارع الزعيم الأزهري',
      level: 'bachelor',
      major: 'المحاسبة المالية',
      prevCert: 'الشهادة الثانوية السودانية',
      prevInstitution: 'مدرسة بحري الثانوية النموذجية للبنين',
      gradeType: 'percent',
      gradeValue: 84.5,
      gradYear: 2024,
    },
    files: {
      photo: {
        name: 'ahmed_photo_4x6.jpg',
        type: 'image/jpeg',
        size: 245000,
        dataUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      },
      cert: {
        name: 'شهادة_الثانوية_العامة_أحمد_الفكي.pdf',
        type: 'application/pdf',
        size: 890000,
        dataUrl: '#',
        pages: 2,
      },
      idDoc: {
        name: 'صورة_الرقم_الوطني.jpg',
        type: 'image/jpeg',
        size: 420000,
        dataUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=80',
      },
    },
  },
  {
    ref: 'NSCA-2026-1002',
    createdAt: '2026-09-20T14:15:00.000Z',
    status: 'pending',
    data: {
      nameAr: 'مروة عبد المنعم حسن إبراهيم',
      nameEn: 'Marwa Abdelmonim Hassan Ibrahim',
      idType: 'passport',
      idNumber: 'P0948271',
      nationality: 'السودان',
      dob: '2001-08-22',
      age: 25,
      gender: 'female',
      residenceCountry: 'المملكة العربية السعودية',
      city: 'الرياض',
      email: 'marwa.hassan@outlook.com',
      dial: '+966',
      phone: '501234567',
      address: 'الرياض - حي العليا - شارع التحلية',
      level: 'master',
      major: 'نظم المعلومات المحاسبية',
      prevCert: 'بكالوريوس',
      prevInstitution: 'جامعة الخرطوم - كلية الدراسات التجارية',
      gradeType: 'gpa4',
      gradeValue: 3.65,
      gradYear: 2023,
    },
    files: {
      photo: {
        name: 'marwa_photo.jpg',
        type: 'image/jpeg',
        size: 310000,
        dataUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      },
      cert: {
        name: 'شهادة_البكالوريوس_وسجل_الدرجات.pdf',
        type: 'application/pdf',
        size: 1450000,
        dataUrl: '#',
        pages: 3,
      },
      idDoc: {
        name: 'جواز_السفر_مروة.jpg',
        type: 'image/jpeg',
        size: 510000,
        dataUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
      },
      cv: {
        name: 'CV_Marwa_Hassan.pdf',
        type: 'application/pdf',
        size: 680000,
        dataUrl: '#',
      },
    },
  },
  {
    ref: 'NSCA-2026-1003',
    createdAt: '2026-09-19T11:00:00.000Z',
    status: 'accepted',
    data: {
      nameAr: 'عثمان الزبير الطيب بابكر',
      nameEn: 'Osman Alzubair Eltayeb Babiker',
      idType: 'national',
      idNumber: '10847291034',
      nationality: 'السودان',
      dob: '2005-01-10',
      age: 21,
      gender: 'male',
      residenceCountry: 'السودان',
      city: 'أم درمان',
      email: 'osman.zubair@gmail.com',
      dial: '+249',
      phone: '923456789',
      address: 'أم درمان - الثورة الحارة السابعة',
      level: 'bachelor',
      major: 'المحاسبة الإدارية',
      prevCert: 'الشهادة الثانوية السودانية',
      prevInstitution: 'مدرسة المؤتمر الثانوية',
      gradeType: 'percent',
      gradeValue: 79.2,
      gradYear: 2024,
    },
    files: {
      photo: {
        name: 'osman_photo.jpg',
        type: 'image/jpeg',
        size: 210000,
        dataUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      },
    },
    decision: {
      at: '2026-09-20T10:00:00.000Z',
      by: 'أمانة الشؤون العلمية',
      reason: 'استيفاء كافة الشروط ومعدل القبول المعتمد للبرنامج.',
    },
    generatedAccount: {
      studentId: 'NSCA-2026-1003',
      username: 'NSCA-2026-1003',
      password: 'Std@' + Math.floor(100000 + Math.random() * 900000),
      createdAt: '2026-09-20T10:00:00.000Z',
    },
  },
];

class AdmissionService {
  private settingsKey = 'nsac_registration_settings';
  private appsKey = 'nsac_student_applications';

  getSettings(): RegistrationSettings {
    const raw = localStorage.getItem(this.settingsKey);
    if (!raw) return { ...DEFAULT_REGISTRATION_SETTINGS };
    try {
      return { ...DEFAULT_REGISTRATION_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_REGISTRATION_SETTINGS };
    }
  }

  updateSettings(updated: Partial<RegistrationSettings>): RegistrationSettings {
    const current = this.getSettings();
    const merged = { ...current, ...updated };
    localStorage.setItem(this.settingsKey, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('nsac_registration_settings_updated', { detail: merged }));
    return merged;
  }

  getApplications(): NewStudentApplication[] {
    const raw = localStorage.getItem(this.appsKey);
    let apps: NewStudentApplication[] = [];
    if (!raw) {
      localStorage.setItem(this.appsKey, JSON.stringify(DEFAULT_APPLICATIONS));
      apps = [...DEFAULT_APPLICATIONS];
    } else {
      try {
        apps = JSON.parse(raw);
      } catch {
        apps = [...DEFAULT_APPLICATIONS];
      }
    }
    return apps.map((a) => ({
      ...a,
      id: a.id || a.ref,
    }));
  }

  getAll(): NewStudentApplication[] {
    return this.getApplications();
  }

  updateStatus(
    idOrRef: string,
    status: 'accepted' | 'rejected',
    byOrReason?: string,
    optionalReason?: string
  ): NewStudentApplication | null {
    if (status === 'accepted') {
      const res = this.acceptApplication(idOrRef);
      return res ? res.application : null;
    } else {
      const reason = optionalReason || byOrReason || 'عدم استيفاء الشروط الأكاديمية';
      return this.rejectApplication(idOrRef, reason);
    }
  }

  private saveApplications(apps: NewStudentApplication[]) {
    localStorage.setItem(this.appsKey, JSON.stringify(apps));
    window.dispatchEvent(new CustomEvent('nsac_applications_updated'));
  }

  createApplication(
    data: NewStudentApplication['data'],
    files: NewStudentApplication['files']
  ): NewStudentApplication {
    const apps = this.getApplications();
    const currentYear = new Date().getFullYear();
    const randSeq = 1000 + apps.length + 1;
    const ref = `NSCA-${currentYear}-${randSeq}`;

    const newApp: NewStudentApplication = {
      id: ref,
      ref,
      createdAt: new Date().toISOString(),
      status: 'pending',
      data,
      files,
    };

    apps.unshift(newApp);
    this.saveApplications(apps);
    return newApp;
  }

  findByRefAndId(ref: string, idNumber: string): NewStudentApplication | undefined {
    const apps = this.getApplications();
    const cleanRef = ref.trim().toUpperCase();
    const cleanId = idNumber.trim().toLowerCase();
    return apps.find(
      (a) => a.ref.toUpperCase() === cleanRef && a.data.idNumber.toLowerCase() === cleanId
    );
  }

  acceptApplication(ref: string): {
    application: NewStudentApplication;
    account: { studentId: string; username: string; password: string };
  } | null {
    const apps = this.getApplications();
    const appIndex = apps.findIndex((a) => a.ref === ref);
    if (appIndex === -1) return null;

    const app = apps[appIndex];
    const studentId = app.ref;
    const username = app.data.email || studentId;
    const password = 'NSCA@' + Math.floor(100000 + Math.random() * 900000);

    const now = new Date().toISOString();
    app.status = 'accepted';
    app.decision = {
      at: now,
      by: 'عمادة القبول والتسجيل',
      reason: 'تم القبول الأكاديمي المباشر واستيفاء المستندات والشروط.',
    };
    app.generatedAccount = {
      studentId,
      username,
      password,
      createdAt: now,
    };

    apps[appIndex] = app;
    this.saveApplications(apps);

    // Also inject new student account into the College's User base
    const newStudentUser: User = {
      id: `std-${Date.now()}`,
      name: app.data.nameAr,
      email: app.data.email,
      role: 'student',
      studentId,
      department: app.data.major,
      level: `المستوى الأول - ${app.data.level === 'diploma' ? 'دبلوم' : app.data.level === 'bachelor' ? 'بكالوريوس' : app.data.level === 'master' ? 'ماجستير' : 'دكتوراه'}`,
      phone: `${app.data.dial} ${app.data.phone}`,
      avatarUrl: app.files.photo?.dataUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      photoUrl: app.files.photo?.dataUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      nationalId: app.data.idNumber,
      academicYear: '2026/2027',
      status: 'طالب مستجد - تم القبول بنجاح',
      gpa: app.data.gradeType === 'percent' ? `${app.data.gradeValue}%` : `${app.data.gradeValue} GPA`,
    };

    // Store in all registered accounts
    const existingUsersRaw = localStorage.getItem('nsac_college_users');
    let usersList: User[] = [];
    if (existingUsersRaw) {
      try {
        usersList = JSON.parse(existingUsersRaw);
      } catch {
        usersList = [];
      }
    }
    usersList.push(newStudentUser);
    localStorage.setItem('nsac_college_users', JSON.stringify(usersList));

    return {
      application: app,
      account: { studentId, username, password },
    };
  }

  rejectApplication(ref: string, reason: string): NewStudentApplication | null {
    const apps = this.getApplications();
    const appIndex = apps.findIndex((a) => a.ref === ref);
    if (appIndex === -1) return null;

    const app = apps[appIndex];
    app.status = 'rejected';
    app.decision = {
      at: new Date().toISOString(),
      by: 'عمادة القبول والتسجيل',
      reason: reason || 'لم يستوفِ الحد الأدنى من شروط ومعايير القبول.',
    };

    apps[appIndex] = app;
    this.saveApplications(apps);
    return app;
  }
}

export const admissionService = new AdmissionService();
