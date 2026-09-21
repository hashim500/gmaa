# إصلاح خطأ تثبيت الاعتماديات في Vercel

## سبب الخطأ

كان المشروع يطلب `vite@^8.3.0`، بينما كان يثبت `esbuild@^0.25.0`. إصدار Vite 8.3.0 يتطلب إصدارًا متوافقًا من esbuild ضمن النطاق `^0.27.0 || ^0.28.0`، لذلك كان `npm install` يتوقف برسالة `ERESOLVE`.

## التعديل المنفذ

تم تغيير الاعتمادية التالية في `package.json`:

```json
"esbuild": "^0.28.2"
```

كما تم إنشاء `package-lock.json` جديد بعد تثبيت نظيف للاعتماديات.

## التحقق

تم تشغيل الأوامر التالية بنجاح:

```bash
npm install
npm run lint
npm run build
```

يُنتج البناء مجلد `dist/` بنجاح. تظهر فقط تحذيرات غير مانعة للبناء تخص حجم حزمة JavaScript وتحذيرًا مستقبليًا في إعداد Vite حول `__dirname`.

## النشر على Vercel

استخدم إعدادات Vercel التالية:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

لا تستخدم `--force` أو `--legacy-peer-deps`؛ تم حل التعارض من خلال توافق الإصدارات نفسه.
