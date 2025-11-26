# Hướng Dẫn Debug Lỗi Upload File

## Vấn đề: "Không thể upload file. Vui lòng thử lại."

### 1. Kiểm tra lỗi trong Console (F12)

Mở DevTools → Console tab và tìm các thông báo có prefix `[Upload]` hoặc `[DataSources]`.

**Các lỗi phổ biến:**

#### ❌ "Bucket not found"
```
[Upload] Error: Bucket not found
```
**Nguyên nhân:** Bucket `data-files` hoặc `uploads` không tồn tại trong Supabase Storage.

**Giải pháp:**
1. Đi đến Supabase Dashboard → Storage
2. Tạo bucket mới:
   - Tên: `data-files` (hoặc `uploads` làm fallback)
   - Chọn "Private" hoặc "Public" (public dễ test hơn)
3. Kiểm tra RLS policies (nếu Private):
   - Cần cho phép authenticated users upload/read

---

#### ❌ "Unauthorized"
```
[Upload] Error: Unauthorized
```
**Nguyên nhân:** User chưa authenticated hoặc không có quyền upload.

**Giải pháp:**
- Đảm bảo user đã login thành công
- Kiểm tra Supabase RLS policies cho bucket

---

#### ❌ "Row not found" hoặc "Failed"
```
[Upload] Error: Row not found
```
**Nguyên nhân:** Bucket config lỗi hoặc RLS quá hạn chế.

**Giải pháp:**
- Kiểm tra bucket RLS policies
- Hoặc tạo bucket public tạm để test

---

### 2. Kiểm tra Supabase Configuration

#### a) Kiểm tra environment variables

File `vite.config.ts` hoặc `.env` phải có:
```
VITE_SUPABASE_URL=https://kfpffjxtgzuuxiznoywp.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_public_key
```

#### b) Kiểm tra Supabase Connection

Trong Console, chạy:
```javascript
import { supabase } from "@/integrations/supabase/client";
console.log(supabase); // phải có storage object
```

---

### 3. Cấu hình Supabase Storage Đúng Cách

#### Step 1: Tạo Bucket

```sql
-- Tạo bucket công khai (dễ test)
insert into storage.buckets (id, name, public)
values ('data-files', 'data-files', true);
```

Hoặc qua UI: Storage → New bucket

#### Step 2: RLS Policies (nếu bucket Private)

```sql
-- Cho phép authenticated users upload
create policy "authenticated users can upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'data-files'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Cho phép read public
create policy "public can read"
on storage.objects
for select
to public
using (bucket_id = 'data-files');
```

---

### 4. Test Upload Thủ Công

Trong Console, test trực tiếp:

```javascript
const { supabase } = await import("@/integrations/supabase/client");

const testFile = new File(['test content'], 'test.csv', { type: 'text/csv' });
const userId = sessionStorage.getItem('userId');

const { data, error } = await supabase.storage
  .from('data-files')
  .upload(`users/${userId}/test-${Date.now()}.csv`, testFile);

console.log('Upload result:', { data, error });
if (error) console.error('Error details:', error);
```

---

### 5. Network Request Check

1. Mở DevTools → Network tab
2. Thử upload file
3. Tìm request tới `https://kfpffjxtgzuuxiznoywp.supabase.co/storage/...`
4. Kiểm tra:
   - Status code: phải 200 nếu thành công, 401/403 nếu permission issue
   - Response body: chứa error message
   - Headers: có `Authorization: Bearer ...` không?

---

### 6. File Size/Format Check

Upload service đã kiểm tra:
- **Kích thước max:** 100 MB
- **Định dạng hỗ trợ:** CSV, JSON, XLSX, XLS, TXT, PDF, ZIP

Nếu lỗi ở bước này, sẽ thấy alert từ UI (không phải Upload error).

---

### 7. Fallback Bucket

Code tự động fallback từ `data-files` → `uploads` nếu bucket đầu tiên fail.

Nếu cả hai fail, console sẽ hiển thị:
```
[Upload] Using bucket: data-files
[Upload] Error: Bucket not found
[Upload] Retrying with fallback bucket: uploads
[Upload] Fallback also failed: Bucket not found
```

---

## 💡 Giải Pháp Nhanh Nhất

1. **Tạo bucket public tạm:**
   ```sql
   insert into storage.buckets (id, name, public)
   values ('uploads', 'uploads', true);
   ```

2. **Hoặc dùng AWS S3 / Firebase Storage:**
   - Thay `uploadService.ts` để integrate S3 thay vì Supabase
   - Cấu hình AWS/Firebase credentials

3. **Hoặc disable upload tạm:**
   - Xoá input file từ form
   - Backend tự generate file placeholder

---

## 📋 Checklist Debug

- [ ] Supabase client import thành công (không error)
- [ ] User đã authenticate (có userId trong sessionStorage)
- [ ] Bucket `data-files` hoặc `uploads` tồn tại
- [ ] RLS policies cho phép upload (nếu bucket private)
- [ ] Console log không lỗi network (200 status)
- [ ] File size < 100 MB
- [ ] File format trong: CSV, JSON, XLSX, TXT, PDF, ZIP
- [ ] Network bandwidth đủ (không bị timeout)

---

## 🆘 Còn Lỗi?

1. Copy full console output (F12 → Console → Screenshot hoặc paste)
2. Check Network tab response body
3. Báo cho dev kèm:
   - File name & size
   - Error message từ console
   - Network response status

---

## Nếu bạn vẫn thấy alert "Không thể upload file..."

Hãy làm theo các bước sau và dán các kết quả vào đây (hoặc chụp ảnh Console/Network):

- Mở DevTools (F12) → Console → copy tất cả log có prefix `[Upload]` hoặc `[DataSources]`.
- Mở DevTools → Network, lọc theo `storage` hoặc domain Supabase (`kfpffjxtgzuuxiznoywp.supabase.co`).
- Thực hiện upload lại, click request thất bại và copy:
   - Request URL
   - Status code
   - Response body (JSON)
   - Request headers (xem Authorization)

Dán các thông tin đó cho tôi, tôi sẽ đọc và chỉ ra nguyên nhân chính xác.
