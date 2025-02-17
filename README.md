# Warehouse Management Application

## Project Overview
This application is designed to help a warehouse streamline and simplify its stock management process. It provides warehousemen with an intuitive platform to track inventory, add or remove products, and view detailed stock reports in real-time. The primary goal is to reduce human errors and improve the efficiency of stock handling.

## Features

### 1. Authentication
- Each warehouseman has a secret key that allows them to access the application.
- Authentication is done via a POST request to `/auth/login`.

### 2. Product Management
- **Product Identification**: 
  - Products can be scanned using an integrated barcode scanner (`expo-camera`).
  - Manual barcode entry is supported in case of scanner issues.
  - The application will check the product's existence in the database:
    - **If product exists**: The system allows adding/removing stock quantities.
    - **If product does not exist**: A form is provided to create a new product with fields like name, type, price, supplier, initial stock, and product image (optional).
  
### 3. Product List
- Displays detailed information about stored products including name, type, price, quantity available, and stock status (in stock, out of stock).
- Visual indicators for low stock (yellow) and out of stock (red).
- Action buttons for stock management ("Restock" to increase quantity and "Unload" to decrease quantity).

### 4. Advanced Features
- **Search and Filtering**: 
  - Products can be filtered by name, type, price, or supplier.
- **Sorting**: 
  - Products can be sorted by price (ascending/descending), name (alphabetical), or quantity.

### 5. Stock Summary & Statistics
- The dashboard includes:
  - Total number of products.
  - Total number of warehouses.
  - Number of products out of stock.
  - Total stock value.
  - Most added and removed products.

### 6. Data Backup and Export
- Data can be exported as a PDF using the `expo-print` library.

---

## Setup Instructions

### Backend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/warehouse-management.git
   cd warehouse-management

## Routes

### 1. Authentication
- `POST /auth/login`

### 2. Product Management
- `GET /products/:barcode`
- `POST /products`
- `PUT /stocks/:productId/:stockId`

### 3. Product List
- `GET /products`

### 4. Statistics
- `GET /statistics/:warehouseId`
