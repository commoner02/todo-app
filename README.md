# Todo-ist

A full-stack todo application with JWT authentication, built with React, Express, and MySQL.

## 🌟 Features

- **User Authentication**
  - Register/Login with username & password
  - JWT-based authentication with refresh tokens
  - Password reset functionality
  - Secure cookie storage for tokens

- **Todo Management**
  - Create, read, update, and delete todos
  - Mark todos as complete/incomplete
  - Filter todos by status (all/active/completed)
  - Real-time statistics and progress tracking

- **Security**
  - Password hashing with bcrypt
  - HTTPS with SSL certificates
  - CORS configuration for cross-origin requests
  - SQL injection prevention with parameterized queries

## 🏗️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Express.js** - Node.js framework
- **MySQL** - Database (Aiven hosted)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
├── backend/
│   ├── config/          # Database & JWT configuration
│   ├── controllers/     # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middlewares/    # Authentication middleware
│   └── server.js       # Main server file
├── frontend/
│   ├── src/
│   │   ├── api/        # API client configuration
│   │   ├── auth/       # Authentication context
│   │   ├── components/ # Reusable UI components
│   │   ├── lib/        # Utility functions
│   │   ├── pages/      # Page components
│   │   └── router/     # Route protection
│   └── vite.config.js  # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL database (Aiven recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure environment variables
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env  # Set API URL
   npm run dev
   ```

4. **Database Setup**
   ```bash
   cd backend
   node config/db-setup.js
   ```

### Environment Variables

**Backend (.env)**
```env
PORT=5005
CORS_ORIGINS=http://localhost:5173
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
db_host=your_db_host
db_port=your_db_port
db_user=your_db_user
db_password=your_db_password
db_name=your_db_name
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5005
```

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Todos
- `GET /api/todos` - Get all todos for user
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `PUT /api/todos/:id/toggle` - Toggle todo completion
- `DELETE /api/todos/:id` - Delete todo

## 🔐 Authentication Flow

1. User logs in with credentials
2. Server generates:
   - Access token (15min expiry) - stored in secure cookie
   - Refresh token (7 days expiry) - stored in database & cookie
3. Frontend includes cookies automatically in requests
4. Access token expires → Frontend automatically refreshes using refresh token
5. User logs out → Both tokens are invalidated

## 🌐 Deployment

### Vercel (Recommended)
Both frontend and backend are configured for Vercel deployment:

1. Push code to GitHub
2. Import projects to Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment
- Backend: Node.js server with PM2
- Frontend: Build with `npm run build` and serve with Nginx
- Database: Aiven MySQL with SSL

## 📊 Database Schema

```sql
users: id, username, password, created_at, updated_at
todos: id, user_id, todo, completed, created_at, updated_at
refresh_tokens: id, user_id, token, expires_at, created_at
```

## 📝 License

MIT License - see LICENSE file for details

## 🐛 Troubleshooting

Common issues:
- **CORS errors**: Check `CORS_ORIGINS` environment variable
- **Database connection**: Verify SSL certificates and credentials
- **Token issues**: Clear browser cookies and re-login
- **Build errors**: Ensure Node.js version is 18+

## 🔗 Related Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/)
- [JWT.io](https://jwt.io/)
- [Aiven MySQL](https://aiven.io/mysql)

---

Built with ❤️ using modern web technologies
