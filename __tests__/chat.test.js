const { server } = require('../app');
const ioClient = require('socket.io-client');

let clientSocket1, clientSocket2;

beforeAll((done) => {
  server.listen(4000, done); // run test server
});

afterAll((done) => {
  server.close(done);
});

beforeEach((done) => {
  clientSocket1 = ioClient("http://localhost:4000");
  clientSocket2 = ioClient("http://localhost:4000");

  let count = 0;
  const checkDone = () => {
    count++;
    if (count === 2) done();
  };

  clientSocket1.on("connect", checkDone);
  clientSocket2.on("connect", checkDone);
});

afterEach(() => {
  clientSocket1.close();
  clientSocket2.close();
});


// ✅ Test 1: user registration
test('should register new user', (done) => {
  clientSocket1.emit('new user', 'Vaibhav', (res) => {
    expect(res).toBe(true);
    done();
  });
});


// ❌ Test 2: duplicate username
test('should reject duplicate username', (done) => {
  clientSocket1.emit('new user', 'SameUser', () => {
    clientSocket2.emit('new user', 'SameUser', (res) => {
      expect(res).toBe(false);
      done();
    });
  });
});


// 💬 Test 3: message broadcast
test('should broadcast message to all users', (done) => {
  clientSocket1.emit('new user', 'User1', () => {
    clientSocket2.emit('new user', 'User2', () => {

      clientSocket2.on('new message', (data) => {
        expect(data.msg).toBe('Hello');
        expect(data.user).toBe('User1');
        done();
      });

      clientSocket1.emit('send message', 'Hello');
    });
  });
});


// 👥 Test 4: usernames broadcast
test('should update usernames list', (done) => {
  let called = false;

  clientSocket1.on('usernames', (users) => {
    if (!called && users.includes('A') && users.includes('B')) {
      called = true;
      done();
    }
  });

  clientSocket1.emit('new user', 'A', () => {
    clientSocket2.emit('new user', 'B', () => {});
  });
});
