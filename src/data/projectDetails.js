export const projectDetails = [
  {
    id: "netraku",
    category: "Web Application",
    date: "2024",
    techStack: ["React.js", "Tesseract.js (OCR)", "Rabin-Karp Algorithm", "Tailwind CSS"],
    links: {
      demo: "https://netraku.my.id/",
      github: "", // Private repo
    },
    images: {
      hero: "/assets/images/netra-preview.png",
      gallery: [],
    },
    // Internationalization Content
    content: {
      en: {
        title: "NETRA (Literature Review Assistant)",
        subtitle: "OCR-based Literature Screening Platform with Rabin-Karp Algorithm",
        overview:
          "NETRA is a specialized web platform designed to assist researchers and students in the literature review process. By leveraging Optical Character Recognition (OCR) and the Rabin-Karp string matching algorithm, it automates the screening of documents, making it easier to extract and verify information from various sources like journals and e-books.",
        challenges: [
          {
            title: "Accuracy in Text Extraction",
            description:
              "Extracting clean text from scanned PDF documents or low-quality images was difficult due to noise and varying fonts.",
          },
          {
            title: "Efficient String Matching",
            description:
              "Processing large documents to find relevant keywords or potential plagiarism required a highly efficient algorithm to prevent browser freezing.",
          },
          {
            title: "Batch Processing Performance",
            description:
              "Handling multiple file uploads and processing them simultaneously without overloading the client-side memory.",
          },
        ],
        solutions: [
          {
            title: "Tesseract.js Optimization",
            description:
              "Implemented pre-processing filters (grayscale, contrast adjustment) before passing images to the OCR engine to improve character recognition accuracy.",
          },
          {
            title: "Rabin-Karp Implementation",
            description:
              "Utilized the Rabin-Karp algorithm for its rolling hash capability, allowing fast multiple-pattern search across parsed document text.",
          },
          {
            title: "Web Workers",
            description:
              "Offloaded the heavy OCR and text processing tasks to Web Workers to keep the main UI thread responsive during batch operations.",
          },
        ],
        features: [
          "OCR Scan for images and scanned PDFs",
          "Automated Document Parsing & Extraction",
          "Batch Processing for multiple files",
          "Keyword Search using Rabin-Karp Algorithm",
          "Export results to CSV/JSON",
        ],
      },
      id: {
        title: "NETRA (Asisten Tinjauan Pustaka)",
        subtitle: "Platform Screening Literatur Berbasis OCR dan Algoritma Rabin-Karp",
        overview:
          "NETRA adalah platform web khusus yang dirancang untuk membantu peneliti dan mahasiswa dalam proses tinjauan pustaka (literature review). Dengan memanfaatkan Optical Character Recognition (OCR) dan algoritma pencocokan string Rabin-Karp, aplikasi ini mengotomatisasi penyaringan dokumen, mempermudah ekstraksi dan verifikasi informasi dari berbagai sumber seperti jurnal dan e-book.",
        challenges: [
          {
            title: "Akurasi Ekstraksi Teks",
            description:
              "Mengekstrak teks bersih dari dokumen PDF hasil scan atau gambar berkualitas rendah cukup sulit karena noise dan variasi jenis font.",
          },
          {
            title: "Pencocokan String Efisien",
            description:
              "Memproses dokumen besar untuk menemukan kata kunci relevan atau potensi plagiarisme membutuhkan algoritma yang sangat efisien agar browser tidak macet.",
          },
          {
            title: "Performa Batch Processing",
            description:
              "Menangani unggahan banyak file sekaligus dan memprosesnya tanpa membebani memori sisi klien (browser).",
          },
        ],
        solutions: [
          {
            title: "Optimasi Tesseract.js",
            description:
              "Mengimplementasikan filter pra-pemrosesan (grayscale, penyesuaian kontras) sebelum mengirim gambar ke mesin OCR untuk meningkatkan akurasi pengenalan karakter.",
          },
          {
            title: "Implementasi Rabin-Karp",
            description:
              "Menggunakan algoritma Rabin-Karp dengan kemampuan rolling hash-nya, memungkinkan pencarian banyak pola (keyword) secara cepat di seluruh teks dokumen.",
          },
          {
            title: "Web Workers",
            description:
              "Memindahkan beban proses OCR dan pengolahan teks yang berat ke Web Workers agar thread utama UI tetap responsif selama proses batch.",
          },
        ],
        features: [
          "Scan OCR untuk gambar dan PDF hasil scan",
          "Parsing & Ekstraksi Dokumen Otomatis",
          "Batch Processing untuk banyak file",
          "Pencarian Kata Kunci dengan Algoritma Rabin-Karp",
          "Ekspor hasil ke format CSV/JSON",
        ],
      },
    },
  },
];
