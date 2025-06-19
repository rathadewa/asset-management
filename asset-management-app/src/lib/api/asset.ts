import API_CONFIG from '@/config/api';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

// Fungsi ini akan menangani panggilan API untuk menghapus aset
export async function deleteAsset(assetId: string) {
  // 1. Ambil token dari cookie di sisi klien
  const token = Cookies.get('token');

  if (!token) {
    toast.error("Otentikasi gagal", {
      description: "Token tidak ditemukan. Silakan login kembali.",
    });
    throw new Error('Token otentikasi tidak ditemukan.');
  }

  // 2. Tentukan URL API
  const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.request}`;

  // 3. Lakukan panggilan fetch dengan metode DELETE dan body yang sesuai
  const response = await fetch(apiUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ asset_id: assetId }), // Kirim asset_id dalam body
  });

  // 4. Tangani respons dari server
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `Gagal menghapus aset. Status: ${response.status}`;
    // Lemparkan error agar bisa ditangkap oleh blok catch di komponen
    throw new Error(errorMessage);
  }

  // Jika berhasil, kembalikan data (opsional, jika ada body di respons sukses)
  return await response.json();
}