# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# WEBFMSI1 - Sewa Kostum Application

Aplikasi web untuk menyewa kostum dengan sistem role-based access control.

## Fitur Role-Based Access Control

### User (Role: user)
User biasa dapat mengakses halaman berikut:
- **Login** - Halaman login
- **Katalog** - Melihat katalog kostum
- **Pesanan** - Melihat dan mengelola pesanan
- **Profile** - Mengelola profil pengguna

### Admin (Role: admin)
Admin dapat mengakses halaman berikut:
- **Login** - Halaman login
- **Katalog Admin** - Mengelola katalog kostum dengan CRUD lengkap
- **Profile** - Mengelola profil admin

## Implementasi Teknis

### 1. Sidebar Navigation
- Menu sidebar menyesuaikan dengan role user
- User melihat: Katalog, Pesanan, Profile
- Admin melihat: Katalog Admin, Profile
- Menampilkan informasi role dan tombol logout

### 2. Protected Routes
- Menggunakan komponen `ProtectedRoute` untuk mengamankan halaman
- Redirect otomatis ke halaman login jika belum login
- Menampilkan error page jika user mencoba mengakses halaman yang tidak diizinkan

### 3. Authentication Flow
- Login mengarahkan user ke halaman yang sesuai dengan rolenya
- Admin → Katalog Admin
- User → Katalog

### 4. Error Handling
- Error page yang informatif ketika akses ditolak
- Pesan error yang berbeda untuk admin dan user
- Tombol untuk kembali ke halaman yang sesuai

### 5. Logout System
- Tombol logout di sidebar yang berfungsi dengan baik
- Implementasi robust dengan fallback jika API gagal
- Pembersihan token dan state lokal yang konsisten
- Debugging console untuk troubleshooting

### 6. Katalog Admin CRUD System
- **Create**: Menambah kostum baru dengan form yang lengkap
- **Read**: Menampilkan daftar kostum dengan gambar dan informasi detail
- **Update**: Mengedit kostum yang sudah ada
- **Delete**: Menghapus kostum dengan konfirmasi

#### Format Data Kostum
```json
{
  "name": "Kostum Frieren",
  "description": "Kostum Frieren lengkap dengan aksesoris dan tongkat sihirnya.",
  "category_id": 2,
  "price_per_day": 350000,
  "stock": 15,
  "status": "available",
  "image_url": "https://example.com/img.jpg",
  "sizes": [
    { "size_id": 1, "stock": 10 },
    { "size_id": 2, "stock": 5 }
  ]
}
```

#### Fitur Katalog Admin
- **Form Input yang Lengkap**: Nama, deskripsi, kategori, harga, stok, gambar, status
- **Pengelolaan Ukuran**: Dynamic form untuk menambah/menghapus ukuran dan stok per ukuran
- **Validasi Form**: Validasi required field dan format data
- **Preview Gambar**: Tampilan gambar kostum di card
- **Status Kostum**: Tag warna untuk status tersedia/tidak tersedia
- **Format Harga**: Format rupiah dengan separator ribuan
- **Responsive Design**: Tampilan yang responsif untuk berbagai ukuran layar

## Struktur File

```
src/
├── App.jsx                 # Routing dan protected routes
├── Sidebar.jsx            # Navigation berdasarkan role
├── providers/
│   └── AuthProvider.jsx   # Context untuk auth dan role
├── pages/
│   ├── login/             # Halaman login
│   ├── katalog/           # Katalog untuk user
│   ├── Katalog_Admin/     # Katalog untuk admin dengan CRUD lengkap
│   ├── user/Pesanan/      # Halaman pesanan
│   ├── Transfer/          # Halaman transfer
│   └── Profile/           # Halaman profil
└── utils/
    ├── api.jsx            # API calls dengan logoutAPI
    └── jwt_storage.jsx    # JWT storage dengan debugging
```

## Cara Penggunaan

1. **Login sebagai User**: Akan diarahkan ke halaman Katalog
2. **Login sebagai Admin**: Akan diarahkan ke halaman Katalog Admin
3. **Navigasi**: Menu sidebar akan menyesuaikan dengan role
4. **Akses Terbatas**: User tidak bisa mengakses halaman admin dan sebaliknya
5. **Logout**: Klik tombol logout di sidebar untuk keluar dari aplikasi

### Katalog Admin
1. **Tambah Kostum**: Klik tombol + untuk membuka form tambah kostum
2. **Edit Kostum**: Klik ikon edit pada card kostum
3. **Hapus Kostum**: Klik ikon hapus dengan konfirmasi
4. **Kelola Ukuran**: Tambah/hapus ukuran dan stok per ukuran
5. **Upload Gambar**: Masukkan URL gambar kostum

## Keamanan

- Semua halaman dilindungi dengan authentication
- Role-based access control di level frontend dan routing
- Redirect otomatis untuk user yang tidak memiliki akses
- JWT token untuk session management
- Logout yang aman dengan pembersihan token dan state

## Troubleshooting Logout

Jika tombol logout tidak berfungsi:

1. **Periksa Console Browser**: Buka Developer Tools (F12) dan lihat tab Console untuk pesan error
2. **Periksa Network**: Lihat tab Network untuk memastikan request logout terkirim
3. **Periksa Storage**: Pastikan token terhapus dari localStorage/sessionStorage
4. **Fallback**: Sistem memiliki fallback yang akan tetap membersihkan state lokal meskipun API gagal

### Debug Logs
Sistem logout memiliki logging yang detail:
- "Logout button clicked" - Tombol logout ditekan
- "Logout function called" - Fungsi logout dipanggil
- "Logout API response status: X" - Status response dari API
- "Removing token from storage..." - Proses penghapusan token
- "Local state cleaned, navigating to login..." - State dibersihkan dan redirect

## API Endpoints

### Kostum
- `GET /api/costumes` - Mendapatkan daftar kostum
- `POST /api/costumes` - Menambah kostum baru
- `PUT /api/costumes/{id}` - Mengupdate kostum
- `DELETE /api/costumes/{id}` - Menghapus kostum

### Kategori
- `GET /api/categories` - Mendapatkan daftar kategori

### Ukuran
- `GET /api/sizes` - Mendapatkan daftar ukuran
