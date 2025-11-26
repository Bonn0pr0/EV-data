import { supabase } from "./client";

const STORAGE_BUCKET = "data-files"; // Tên bucket chính
const FALLBACK_BUCKET = "uploads"; // Fallback bucket nếu bucket chính không tồn tại
/**
 * Lấy bucket khả dụng
 */
async function getAvailableBucket(): Promise<string> {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.warn("Cannot list buckets:", error);
      return STORAGE_BUCKET; // Cứ thử bucket chính
    }
    
    const buckets = data?.map((b: any) => b.name) || [];
    console.log("Available buckets:", buckets);
    
    // Ưu tiên bucket chính
    if (buckets.includes(STORAGE_BUCKET)) return STORAGE_BUCKET;
    // Fallback bucket
    if (buckets.includes(FALLBACK_BUCKET)) return FALLBACK_BUCKET;
    
    // Nếu không có bucket nào, trả về bucket chính (sẽ fail nhưng có log tốt)
    return STORAGE_BUCKET;
  } catch (err) {
    console.error("Error checking buckets:", err);
    return STORAGE_BUCKET;
  }
}


/**
 * Upload file lên Supabase Storage
 * @param file - File object từ input
 * @param userId - ID user (để tổ chức folder)
 * @param packageId - ID package (nếu có, để tạo folder package-specific)
 * @returns URL công khai của file hoặc null nếu lỗi
 */
export async function uploadFileToSupabase(
  file: File,
  userId: string | number,
  packageId?: string | number
): Promise<{ publicUrl: string | null; error: string | null }> {
  try {
    if (!file) {
      console.error("[Upload] No file provided");
      return { publicUrl: null, error: 'No file provided' };
    }

    console.log("[Upload] File info:", {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.type,
      userId,
    });

    // Tạo đường dẫn: users/{userId}/files/{packageId}/{timestamp}-{filename}
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const folderPath = packageId 
      ? `users/${userId}/packages/${packageId}/${fileName}`
      : `users/${userId}/files/${fileName}`;

    console.log("[Upload] Path:", folderPath);

    // Tìm bucket khả dụng
    const bucket = await getAvailableBucket();
    console.log("[Upload] Using bucket:", bucket);

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(folderPath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("[Upload] Error:", error.message, error);

      // Thử fallback bucket nếu upload thất bại
      if (bucket !== FALLBACK_BUCKET) {
        try {
          console.log("[Upload] Retrying with fallback bucket:", FALLBACK_BUCKET);
          const { data: fallbackData, error: fallbackError } = await supabase.storage
            .from(FALLBACK_BUCKET)
            .upload(folderPath, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (fallbackError) {
            console.error("[Upload] Fallback also failed:", fallbackError.message, fallbackError);
            return { publicUrl: null, error: fallbackError.message || 'Fallback upload failed' };
          }

          const { data: fbPublicUrl } = supabase.storage
            .from(FALLBACK_BUCKET)
            .getPublicUrl(folderPath);

          const url = fbPublicUrl?.publicUrl;
          console.log("[Upload] Success via fallback:", url);
          return { publicUrl: url || null, error: null };
        } catch (ex) {
          console.error('[Upload] Fallback exception', ex);
          return { publicUrl: null, error: (ex as any)?.message || 'Fallback exception' };
        }
      }

      return { publicUrl: null, error: error.message || 'Upload failed' };
    }

    if (!data) {
      console.error("[Upload] No data returned");
      return { publicUrl: null, error: 'No data returned from upload' };
    }

    // Lấy public URL của file
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(folderPath);

    const publicUrl = publicUrlData?.publicUrl;
    console.log("[Upload] Success:", publicUrl);

    return { publicUrl: publicUrl || null, error: null };
  } catch (err) {
    console.error("[Upload] Exception:", err);
    return { publicUrl: null, error: (err as any)?.message || String(err) };
  }
}

/**
 * Xoá file từ Supabase Storage
 * @param filePath - Đường dẫn file (ví dụ: users/123/files/abc-file.csv)
 */
export async function deleteFileFromSupabase(filePath: string): Promise<boolean> {
  try {
    const bucket = await getAvailableBucket();
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error("[Delete] Error:", error);
      return false;
    }

    console.log("[Delete] Success:", filePath);
    return true;
  } catch (err) {
    console.error("[Delete] Exception:", err);
    return false;
  }
}

/**
 * Kiểm tra kích thước file có phù hợp không
 * @param file - File object
 * @param maxSizeMB - Kích thước tối đa (MB)
 */
export function isFileSizeValid(file: File, maxSizeMB: number = 100): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Kiểm tra định dạng file được hỗ trợ
 * @param file - File object
 * @param allowedExtensions - Mảng phần mở rộng được phép (ví dụ: ["csv", "json", "xlsx"])
 */
export function isFileTypeValid(
  file: File,
  allowedExtensions: string[] = ["csv", "json", "xlsx", "xls", "txt", "pdf", "zip"]
): boolean {
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext ? allowedExtensions.includes(ext) : false;
}
