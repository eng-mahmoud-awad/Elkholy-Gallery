# الأسمر — معرض أثاث

## تشغيل
1. `npm install`
2. انسخ `.env.example` إلى `.env.local` واملأ القيم
3. `npm run dev`

## API
| Method | Path | Access |
|---|---|---|
| POST | /api/admin/login `{password}` | public |
| POST | /api/admin/logout | public |
| GET | /api/categories | public |
| POST | /api/categories | admin |
| PUT / DELETE | /api/categories/:id | admin |
| GET | /api/products?category=<id> (&all=1 للأدمن) | public |
| POST | /api/products | admin |
| GET | /api/products/:idOrSlug | public |
| PUT / DELETE | /api/products/:id | admin |
| GET | /api/settings | public |
| PUT | /api/settings | admin |
| POST | /api/upload/sign | admin |
