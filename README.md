# PawMart E-Commerce Backend 🐾# Product



Spring Boot REST API for the PawMart pet supply e-commerce platform.This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.6.



## 📥 Download & Setup## Development server



### Option 1: Quick Start with Docker (Recommended)To start a local development server, run:



**Prerequisites:**```bash

- Docker Desktop installedng serve

- Git```



**Steps:**Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

```bash

# 1. Clone the repository## Code scaffolding

git clone https://github.com/paulo-paulino5/PawMart-Ecommerce.git

cd PawMart-EcommerceAngular CLI includes powerful code scaffolding tools. To generate a new component, run:

git checkout backend

```bash

# 2. Start the applicationng generate component component-name

docker-compose up -d```



# 3. Verify it's runningFor a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

curl http://localhost:8080/api/products

``````bash

ng generate --help

The backend will be available at `http://localhost:8080````



### Option 2: Manual Setup## Building



**Prerequisites:**To build the project run:

- Java 17 or higher

- Maven 3.6+```bash

- MySQL 8.0ng build

```

**Steps:**

```bashThis will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

# 1. Clone the repository

git clone https://github.com/paulo-paulino5/PawMart-Ecommerce.git## Running unit tests

cd PawMart-Ecommerce

git checkout backendTo execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:



# 2. Create MySQL database```bash

mysql -u root -png test

CREATE DATABASE PetSupplyEcom;```

exit;

## Running end-to-end tests

# 3. Load test data

mysql -u root -p PetSupplyEcom < sql/complete_database_setup.sqlFor end-to-end (e2e) testing, run:



# 4. Update database credentials```bash

# Edit src/main/resources/application.yml with your MySQL passwordng e2e

```

# 5. Build and run

mvn clean packageAngular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

java -jar target/PetSupply-1.0-SNAPSHOT.jar

```## Additional Resources



## 📊 Included Test DataFor more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


The application comes with pre-populated sample data for testing:

### Products (8 items)
| Category | Product | Price |
|----------|---------|-------|
| Dog | Premium Dog Food - Chicken & Rice | ₱300.00 |
| Dog | Adjustable Dog Leash | ₱250.00 |
| Dog | Orthopedic Dog Bed | ₱500.00 |
| Cat | Natural Cat Litter | ₱400.00 |
| Cat | Feather Wand Cat Toy | ₱150.00 |
| Cat | Cat Scratching Post | ₱400.00 |
| Small Pets | Hamster Habitat Kit | ₱400.00 |
| Small Pets | Small Pet Food Pellets | ₱200.00 |

### Sample Order
- **Order Number:** PET1698123456
- **Customer:** demo@example.com
- **Status:** Pending
- **Items:** Premium Dog Food + Interactive Dog Toy
- **Total:** ₱550.00 (includes ₱100 shipping)

### Test User Account
- **Email:** demo@example.com
- **Password:** password123
- **Name:** Demo User

## 🗄️ Database Structure

### Tables
- `product_data` - Product catalog with categories
- `order_data` - Customer orders and shipping information
- `order_item_data` - Individual order items
- `customer_data` - User accounts and authentication

### SQL Scripts
All located in the `sql/` folder:
- `complete_database_setup.sql` - **Use this** for full setup with test data
- `create_order_tables.sql` - Order system tables
- `create_users_table.sql` - Customer accounts table
- `update_product_table.sql` - Product table modifications
- `view_users.sql` - Query to view all users

## 📡 API Endpoints

### Products
```
GET    /api/products           - Get all products
GET    /api/product/{id}       - Get product by ID
GET    /api/product            - Get products by category
PUT    /api/product            - Create new product
POST   /api/product            - Update product
DELETE /api/product/{id}       - Delete product
```

### Orders
```
POST   /api/orders                        - Create new order
GET    /api/orders/number/{orderNumber}   - Get order by number
GET    /api/orders/customer/email/{email} - Get customer's orders
PATCH  /api/orders/{id}/status            - Update order status
DELETE /api/orders/{id}                   - Delete order
```

### Authentication
```
POST   /api/auth/signup   - Register new user
POST   /api/auth/signin   - User login
```

## 🔧 Configuration

### Docker Configuration
Edit `docker-compose.yml` if needed:
- MySQL port: 3306
- Backend port: 8080
- Database password: `Qwerty123!`

### Application Configuration
Edit `src/main/resources/application.yml`:
```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/PetSupplyEcom
    username: root
    password: YOUR_PASSWORD
```

## 🛠️ Development Commands

```bash
# Build the project
mvn clean install

# Run tests
mvn test

# Rebuild Docker image
docker-compose build backend
docker-compose up -d backend

# View backend logs
docker logs petsupply-backend-1 --follow

# View database logs
docker logs petsupply-mysqldb-1 --follow

# Stop all containers
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v
```

## 🌐 Frontend Integration

The Angular frontend is in the `main` branch:
```bash
git checkout main
cd product
npm install
ng serve
```

Frontend will run on `http://localhost:4200`

## 📦 Technology Stack

- **Framework:** Spring Boot 2.7.5
- **Language:** Java 17
- **Database:** MySQL 8.0
- **ORM:** Hibernate/JPA
- **Build Tool:** Maven 3.8.6
- **Containerization:** Docker & Docker Compose

## 🔐 Security & CORS

- **CORS enabled** for `http://localhost:4200` (Angular dev server)
- Basic authentication implemented
- Password encryption using BCrypt
- JWT tokens for session management

## 🆘 Troubleshooting

### Cannot connect to database
```bash
# Check if MySQL is running
docker ps

# Restart MySQL container
docker restart petsupply-mysqldb-1

# Check MySQL logs
docker logs petsupply-mysqldb-1
```

### Port 8080 already in use
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Stop the process or change port in application.yml
```

### Backend not starting
```bash
# Check backend logs
docker logs petsupply-backend-1 --tail 100

# Rebuild and restart
docker-compose build backend
docker-compose up -d backend
```

### Database is empty
```bash
# Access MySQL container
docker exec -it petsupply-mysqldb-1 mysql -uroot -pQwerty123! PetSupplyEcom

# Check if tables exist
SHOW TABLES;

# Reload test data
docker exec -i petsupply-mysqldb-1 mysql -uroot -pQwerty123! PetSupplyEcom < sql/complete_database_setup.sql
```

## 📸 Testing the API

### Using cURL
```bash
# Get all products
curl http://localhost:8080/api/products

# Get product by ID
curl http://localhost:8080/api/product/1

# Create an order (requires JSON payload)
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerEmail":"test@example.com","total":500}'
```

### Using Postman
Import the following base URL: `http://localhost:8080`

## 📝 Project Structure

```
PetSupply/
├── src/
│   ├── main/
│   │   ├── java/com/paulino/
│   │   │   ├── controller/      # REST API endpoints
│   │   │   ├── entity/          # JPA entities
│   │   │   ├── model/           # Data models
│   │   │   ├── repository/      # Database repositories
│   │   │   ├── service/         # Business logic
│   │   │   └── serviceimpl/     # Service implementations
│   │   └── resources/
│   │       └── application.yml  # Configuration
│   └── test/                    # Unit tests
├── sql/                         # Database scripts
├── docker-compose.yml           # Docker configuration
├── Dockerfile                   # Backend container setup
└── pom.xml                      # Maven dependencies
```

## 📄 License

This project is for educational purposes.

## 👨‍💻 Author

**Paulo Rommel Paulino**
- GitHub: [@paulo-paulino5](https://github.com/paulo-paulino5)
- Repository: [PawMart-Ecommerce](https://github.com/paulo-paulino5/PawMart-Ecommerce)

## 🤝 Contributing

This is a learning project. Feel free to fork and experiment!

## ⭐ Features

- ✅ Complete REST API for e-commerce operations
- ✅ Product catalog management
- ✅ Order processing system
- ✅ User authentication & authorization
- ✅ Docker containerization
- ✅ Test data included
- ✅ Comprehensive error handling
- ✅ CORS configuration for frontend
- ✅ MySQL database with JPA
- ✅ Lombok for boilerplate reduction

## 🎯 Next Steps After Setup

1. Access the API at `http://localhost:8080/api/products`
2. Check out the frontend in the `main` branch
3. Test the endpoints using cURL or Postman
4. Review the database structure in MySQL
5. Start building your own features!

---

**Need help?** Check the troubleshooting section or create an issue on GitHub.
