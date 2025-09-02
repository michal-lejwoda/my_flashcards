# 📝 Flashcard & Language Learning Platform  

🌍 **Demo**: [https://www.language-flashcards.pl](https://www.language-flashcards.pl)  

---

## 🔑 Test Account
### 👤 Login: **testuser**  
### 🔒 Password: **testuser**  

---

## 📖 Overview  

An **interactive language learning platform** focused on **flashcards** and **custom exercises**.  
- In addition to classic flashcards, the platform offers **10 different types of exercises** for both **English** and **German**, helping users improve vocabulary and grammar.  
- Content can be easily managed and customized through an intuitive **Wagtail CMS** interface, enabling administrators to create and organize exercises efficiently.  
- The platform encourages regular practice with features such as **vocabulary revision**, **progress tracking**, and **customizable learning paths**.  

---

## 🚀 Features  

- 🗂️ **Flashcards & Vocabulary Exercises** - interactive methods to boost retention  
- ✏️ **Grammar Practice** - multiple exercise types for English & German  
- 📝 **Exercise Creator** - design and publish new tasks via **Wagtail CMS**  
- 📊 **Progress Tracking** - monitor learning history and improvements  
- 🔄 **Asynchronous Tasks** - background jobs (email reminders, statistics, notifications) handled with **Celery + Redis + Flower**  
- 🛡️ **Error Monitoring** - powered by **Sentry** to ensure reliability  
- 🚀 **CI/CD Pipeline** - automated builds & deployments with **GitHub Actions**  
- 🐳 **Dockerized Infrastructure** - scalable, portable deployment  

---

## 🛠️ Technology Stack  

### 🔙 Backend  
- **Django** - core backend framework  
- **Wagtail** - CMS for managing exercises and content  
- **Celery + Redis + Flower** - asynchronous task management  
- **Pytest** - testing framework  

### 🎨 Frontend  
- **React** - component-based UI  
- **TypeScript** - type-safe development  
- **Formik + Yup** - form handling and validation  

### 🗄️ Database  
- **PostgreSQL**  

### ⚙️ DevOps & Monitoring  
- **Docker** - containerization  
- **Nginx** - serving static files & reverse proxy  
- **GitHub Actions** - CI/CD automation  
- **Sentry** - error monitoring & performance tracking  

---

## 🏗️ Architecture  

🔹 **Frontend (React + TypeScript)** → handles UI & learning interactions  
🔹 **Backend (Django + Wagtail)** → exercises, authentication, CMS logic  
🔹 **Celery + Redis + Flower** → background jobs (emails, reminders, analytics)  
🔹 **PostgreSQL** → main database  
🔹 **Nginx** → static file serving & reverse proxy  
🔹 **Docker + GitHub Actions** → deployment & CI/CD automation  
🔹 **Sentry** → error monitoring & alerting  

---

