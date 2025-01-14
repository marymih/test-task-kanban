# Kanban Board

This project is the third test task for a frontend developer as part of the Hexlet and Habr Carreer challenge.

## Description

This is a single-page application (SPA) representing a Kanban board for managing documents. It allows users to add, manage, and move documents across different stages: "In Progress", "Under Review", and "Completed".

## Functionality

- **Three Columns:**  
  Displays documents in three categories: In Progress, Under Review, and Completed.
- **Drag-and-Drop:**  
  Allows users to drag documents between columns for easy organization.
- **Adding Documents:**  
  Users can add a new document to the "In Progress" column.

## Launch Instructions
1. Clone the repository:
  ```sh
  git clone https://github.com/marymih/test-task-kanban.git
  ```

2. Navigate to the project directory:
  ```sh
  cd test-task-kanban
  ```

3. Install dependencies:
  ```sh
  npm install
  ```
4. Run the app:
  ```sh
  npm run dev
  ```
  The application will be available at http://localhost:3000.

## Technologies Used
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

## Future Features
- State Persistence: Save the board state in the browser's local storage (LocalStorage).
- Document Filtering: Add a filter feature to search for documents by title across all columns.
