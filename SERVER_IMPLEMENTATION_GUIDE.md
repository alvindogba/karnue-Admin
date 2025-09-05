# Server-Side Implementation Guide for Riders Management

This guide provides detailed instructions for implementing the backend API endpoints to support the Riders management system in your Karnue Admin dashboard.

## Overview

The frontend expects a REST API with the following base URL structure:
```
http://localhost:5000/api/admin
```

All endpoints require JWT authentication via the `Authorization: Bearer <token>` header.

## Required Database Schema

### Riders Table
```sql
CREATE TABLE riders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    total_rides INTEGER DEFAULT 0,
    status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    join_date DATE NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0,
    avatar VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Indexes for Performance
```sql
CREATE INDEX idx_riders_status ON riders(status);
CREATE INDEX idx_riders_email ON riders(email);
CREATE INDEX idx_riders_join_date ON riders(join_date);
CREATE INDEX idx_riders_name ON riders(name);
```

## API Endpoints Implementation

### 1. GET /api/admin/riders
**Purpose**: Fetch paginated list of riders with filtering and search

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for name, email, or phone
- `status` (optional): Filter by status ('Active', 'Inactive', 'Suspended')
- `sortBy` (optional): Sort field (default: 'name')
- `sortOrder` (optional): 'asc' or 'desc' (default: 'asc')

**Response Format**:
```json
{
  "riders": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@email.com",
      "phone": "+1234567890",
      "totalRides": 45,
      "status": "Active",
      "joinDate": "2024-01-15",
      "rating": 4.8,
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "stats": {
    "totalRiders": 1247,
    "activeRiders": 1089,
    "newThisMonth": 158,
    "averageRating": 4.7
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 125,
    "totalItems": 1247,
    "itemsPerPage": 10
  }
}
```

**Implementation Example (Node.js/Express)**:
```javascript
app.get('/api/admin/riders', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    let whereClause = '1=1';
    const params = [];
    
    if (search) {
      whereClause += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }
    
    // Get riders
    const ridersQuery = `
      SELECT * FROM riders 
      WHERE ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `;
    
    const riders = await db.query(ridersQuery, [...params, parseInt(limit), offset]);
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM riders WHERE ${whereClause}`;
    const totalResult = await db.query(countQuery, params);
    const totalItems = totalResult[0].total;
    
    // Get stats
    const stats = await getRidersStats();
    
    res.json({
      riders: riders.map(rider => ({
        ...rider,
        joinDate: rider.join_date,
        totalRides: rider.total_rides,
        createdAt: rider.created_at,
        updatedAt: rider.updated_at
      })),
      stats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch riders' });
  }
});
```

### 2. GET /api/admin/riders/stats
**Purpose**: Get riders statistics

**Response Format**:
```json
{
  "totalRiders": 1247,
  "activeRiders": 1089,
  "newThisMonth": 158,
  "averageRating": 4.7
}
```

**Implementation**:
```javascript
app.get('/api/admin/riders/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await getRidersStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

async function getRidersStats() {
  const totalRiders = await db.query('SELECT COUNT(*) as count FROM riders');
  const activeRiders = await db.query('SELECT COUNT(*) as count FROM riders WHERE status = "Active"');
  const newThisMonth = await db.query(`
    SELECT COUNT(*) as count FROM riders 
    WHERE join_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
  `);
  const avgRating = await db.query('SELECT AVG(rating) as avg FROM riders WHERE rating > 0');
  
  return {
    totalRiders: totalRiders[0].count,
    activeRiders: activeRiders[0].count,
    newThisMonth: newThisMonth[0].count,
    averageRating: parseFloat(avgRating[0].avg || 0)
  };
}
```

### 3. GET /api/admin/riders/:id
**Purpose**: Get single rider details

**Response Format**:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@email.com",
  "phone": "+1234567890",
  "totalRides": 45,
  "status": "Active",
  "joinDate": "2024-01-15",
  "rating": 4.8,
  "avatar": "https://example.com/avatar.jpg",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### 4. POST /api/admin/riders
**Purpose**: Create new rider

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@email.com",
  "phone": "+1234567890"
}
```

**Implementation**:
```javascript
app.post('/api/admin/riders', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required' });
    }
    
    // Check if email already exists
    const existing = await db.query('SELECT id FROM riders WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const result = await db.query(`
      INSERT INTO riders (name, email, phone, join_date)
      VALUES (?, ?, ?, CURDATE())
    `, [name, email, phone]);
    
    const newRider = await db.query('SELECT * FROM riders WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      ...newRider[0],
      joinDate: newRider[0].join_date,
      totalRides: newRider[0].total_rides
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create rider' });
  }
});
```

### 5. PATCH /api/admin/riders/:id
**Purpose**: Update rider information

**Request Body** (all fields optional):
```json
{
  "name": "Updated Name",
  "email": "updated@email.com",
  "phone": "+1234567890",
  "status": "Suspended"
}
```

### 6. DELETE /api/admin/riders/:id
**Purpose**: Delete rider

**Response**:
```json
{
  "success": true,
  "id": 1
}
```

### 7. PATCH /api/admin/riders/:id/suspend
**Purpose**: Suspend a rider

**Implementation**:
```javascript
app.patch('/api/admin/riders/:id/suspend', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.query('UPDATE riders SET status = "Suspended" WHERE id = ?', [id]);
    
    const updatedRider = await db.query('SELECT * FROM riders WHERE id = ?', [id]);
    
    res.json({
      ...updatedRider[0],
      joinDate: updatedRider[0].join_date,
      totalRides: updatedRider[0].total_rides
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to suspend rider' });
  }
});
```

### 8. PATCH /api/admin/riders/:id/activate
**Purpose**: Activate a rider

**Implementation**: Similar to suspend, but sets status to "Active"

## Authentication Middleware

```javascript
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}
```

## Error Handling

Ensure all endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional details if needed"
}
```

## Testing the Integration

1. Start your backend server on `http://localhost:5000`
2. Ensure all endpoints return the expected response format
3. Test authentication by including the JWT token in requests
4. Verify pagination, search, and filtering work correctly
5. Test all CRUD operations

## Environment Variables

Add these to your `.env` file:
```
JWT_SECRET=your_jwt_secret_key
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=karnue_admin
```

## Database Seeding (Optional)

Create sample data for testing:

```sql
INSERT INTO riders (name, email, phone, total_rides, status, join_date, rating) VALUES
('John Doe', 'john.doe@email.com', '+1234567890', 45, 'Active', '2024-01-15', 4.8),
('Jane Smith', 'jane.smith@email.com', '+1234567891', 32, 'Active', '2024-02-20', 4.6),
('Mike Johnson', 'mike.johnson@email.com', '+1234567892', 18, 'Inactive', '2024-03-10', 4.2),
('Sarah Wilson', 'sarah.wilson@email.com', '+1234567893', 67, 'Active', '2023-12-05', 4.9);
```

This implementation will ensure your frontend Riders management system works seamlessly with real backend data.
