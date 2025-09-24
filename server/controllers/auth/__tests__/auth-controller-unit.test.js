const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');
const { 
  registerUser, 
  loginUser, 
  logoutUser, 
  authMiddleware 
} = require('../auth-controller');

// Mock dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../../models/User');

const app = express();
app.use(express.json());
app.use(require('cookie-parser')());

// Setup routes for testing
app.post('/register', registerUser);
app.post('/login', loginUser);
app.post('/logout', logoutUser);
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ success: true, user: req.user });
});

describe('Auth Controller Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Registration Success', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        userName: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue(null); // No existing user
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      
      // Mock the constructor and save method
      const mockSave = jest.fn().mockResolvedValue(true);
      User.mockImplementation(() => ({
        save: mockSave
      }));

      const response = await request(app)
        .post('/register')
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Registration successful');
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 12);
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('Duplicate Email Registration', () => {
    it('should reject registration with existing email', async () => {
      const userData = {
        userName: 'testuser',
        email: 'existing@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue({ email: userData.email }); // User exists

      const response = await request(app)
        .post('/register')
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User Already exists with the same email! Please try again');
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });

  describe('Invalid Email Registration', () => {
    it('should handle registration errors gracefully', async () => {
      const userData = {
        userName: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      User.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/register')
        .send(userData);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Some error occured');
    });
  });

  describe('User Login Success', () => {
    it('should login user with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword123',
        role: 'user',
        userName: 'testuser'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mocked-jwt-token');

      const response = await request(app)
        .post('/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logged in successfully');
      expect(response.body.user).toEqual({
        email: mockUser.email,
        role: mockUser.role,
        id: mockUser._id,
        userName: mockUser.userName
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser._id,
          role: mockUser.role,
          email: mockUser.email,
          userName: mockUser.userName
        },
        'CLIENT_SECRET_KEY',
        { expiresIn: '60m' }
      );
    });
  });

  describe('Invalid Login Credentials', () => {
    it('should reject login with non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User doesn't exists! Please register first");
    });

    it('should reject login with incorrect password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword123'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Incorrect password! Please try again');
    });
  });

  describe('Database Connection Errors', () => {
    it('should handle login database errors', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      User.findOne.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .post('/login')
        .send(loginData);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Some error occured');
    });
  });

  describe('JWT Token Validation', () => {
    it('should validate valid JWT token', async () => {
      const mockDecodedToken = {
        id: 'user123',
        role: 'user',
        email: 'test@example.com',
        userName: 'testuser'
      };

      jwt.verify.mockReturnValue(mockDecodedToken);

      const response = await request(app)
        .get('/protected')
        .set('Cookie', ['token=valid-jwt-token']);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toEqual(mockDecodedToken);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/protected');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Unauthorised user!');
    });

    it('should reject request with invalid token', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const response = await request(app)
        .get('/protected')
        .set('Cookie', ['token=invalid-jwt-token']);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Unauthorised user!');
    });
  });

  describe('Logout User', () => {
    it('should logout user successfully', async () => {
      const response = await request(app)
        .post('/logout');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logged out successfully!');
    });
  });
});