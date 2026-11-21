/**
 * Production Cloudinary Direct Unsigned Image Upload Service
 * Allows browser-direct image uploads to Cloudinary without exposing API secrets.
 */

export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    "";
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "pos_preset";

  if (!cloudName) {
    throw new Error(
      "Cloudinary Cloud Name is missing. Please configure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local",
    );
  }

  // Validate image file type & size (max 10MB)
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files (JPG, PNG, WebP) are allowed.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image size must be under 10MB.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    const message =
      errorPayload?.error?.message ||
      `Upload failed with status ${response.status} (${response.statusText})`;
    throw new Error(`Cloudinary upload failed: ${message}`);
  }

  const result = await response.json();
  if (!result.secure_url) {
    throw new Error("Cloudinary response missing secure_url");
  }

  return result.secure_url;
}
