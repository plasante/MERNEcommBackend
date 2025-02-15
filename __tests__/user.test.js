jest.mock('../models/user');
const User = require('../models/user');
const userController = require('../controllers/auth');

// Test pour 'sayHi'
test('sayHi', () => {
  const mockRes = {
    json: jest.fn(),
  };

  userController.sayHi(undefined, mockRes);

  expect(mockRes.json).toHaveBeenCalledWith({ message: 'Hello Json!' });
});

// test('signUp', () => {
//   const mockReq = {
//     body: {
//       username: 'testuser',
//       password: 'testpassword'
//     }
//   };
//
//   const mockRes = {
//     json: jest.fn(),
//   };
//
//   userController.signUp(mockReq, mockRes);
//
//   expect(mockRes.json).toHaveBeenCalledWith({ message: 'User signed up successfully' });
// })

describe('signUp', () => {
  it('should save a user and return it', async () => {
    const mockUser = {
      save: jest.fn().mockResolvedValue({
        _id: '1',
        name: 'Test User',
        email: 'testuser@gmail.com',
        salt: 'random_salt',
        hashedPassword: 'random_hashed_password',
      }),
    };
    User.mockImplementation(() => mockUser);

    const req = {body: {name: 'Test User', email: 'testuser@gmail.com'}};
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({json});
    const res = {json, status};

    await userController.signUp(req, res);

    expect(mockUser.save).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      savedUser: {
        _id: '1',
        name: 'Test User',
        email: 'testuser@gmail.com',
      },
    });
  });

  it('should return an error if user save operation fails', async () => {
    const mockUser = {
      save: jest.fn().mockRejectedValue({ message: 'Save operation failed' }),
    };
    User.mockImplementation(() => mockUser);

    const req = { body: { name: 'Test User', email: 'testuser@gmail.com' } };
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { json, status };

    await userController.signUp(req, res);

    expect(mockUser.save).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    // expect(res.status(400).json).toHaveBeenCalledWith({
    //   err: 'Save operation failed',
    // });
  });
})