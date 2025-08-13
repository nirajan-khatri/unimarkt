## Team Information

| Name                            | Email                                                  | GitHub Username        | Role             |
|---------------------------------|--------------------------------------------------------|------------------------|------------------|
| Nirajan Khatri                  | nirajan.khatri@informatik.hs-fulda.de                  | nirajan-khatri         | Team Lead        |
| Inchara Rao Konagolli Shrikanth | inchara-rao.konagolli-shrikanth@informatik.hs-fulda.de | inchararaoks           | Developer        |
| Muhammad Azeem Taufiq           | muhammad-azeem.taufiq@informatik.hs-fulda.de           | azeemtofeek            | Database Enigneer|
| Murtaza Muffazal Dhariwala      | murtaza-muffazal.dhariwala@informatik.hs-fulda.de      | MurtazaD1410           | Frontend Lead    |
| Rohan Kolagada                  | rohan.kolagada@informatik.hs-fulda.de                  | Rohan-Kolagada         | GitHub Master    |

# UniMarkt

UniMarkt is a secure, peer-to-peer marketplace web application built exclusively for the Hochschule Fulda community. Developed as an academic project for our Master’s module Global Distributed Software Development, only users with an `@hs-fulda.de` email address can register—ensuring every buyer and seller is a verified student, faculty member, or staff. Trade books, electronics, services, event tickets, and more—confidently and conveniently—within one trusted campus-only platform.

---

## 🚀 Features

- **Verified Community**  
  - Registration restricted to `@hs-fulda.de` emails  
  - Optional Two-Factor Authentication (TOTP)  
  - Admin dashboard for listing and user approval  

- **Rich Listing Experience**  
  - Multiple high-resolution image uploads (AWS S3)  
  - AI-powered description suggestions  
  - Search & filters by category, price, and campus location  

- **Real-Time Communication**  
  - In-app messaging per listing  
  - Push notifications for new offers & messages  

- **Role-Based Permissions**  
  - **Admins**: Approve/reject listings, moderate content, manage users  
  - **Faculty & Staff**: Post job/service listings  
  - **Students**: Buy, sell, swap, or offer tutoring and shared-ride services  

---

## 🛠 Tech Stack

| Layer           | Technology                          |
| --------------- | ----------------------------------- |
| Frontend        | Next.js, Shadcn                     |
| Backend         | Python 3, Django REST Framework     |
| Database        | PostgreSQL                          |
| File Storage    | AWS S3                              |
| Auth & Security | JWT, TOTP Two-Factor Auth           |

