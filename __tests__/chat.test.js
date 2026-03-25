const { server } = require('../app');
const ioClient = require('socket.io-client');

let clientSocket1;
let clientSocket2;

const PORT = 4000;
const URL = `http://localhost:${PORT}`;

beforeAll((done) => {
  if (!server.listening) {
    server.listen(PORT, done);
  } else {
    done();
  }
});

afterAll((done) => {
  if (server.listening) {
    server.close(done);
  } else {
    done();
  }
});

afterEach(() => {
  if (clientSocket1 && clientSocket1.connected) {
    clientSocket1.disconnect();
  }
  if (clientSocket2 && clientSocket2.connected) {
    clientSocket2.disconnect();
  }
});

test('should register new user', (done) => {
  clientSocket1 = ioClient(URL);

  clientSocket1.emit('new user', 'Vaibhav', (res) => {
    expect(res).toBe(true);
    done();
  });
});

test('should reject duplicate username', (done) => {
  clientSocket1 = ioClient(URL);
  clientSocket2 = ioClient(URL);

  clientSocket1.emit('new user', 'Vaibhav', () => {
    clientSocket2.emit('new user', 'Vaibhav', (res) => {
      expect(res).toBe(false);
      done();
    });
  });
});

test('should broadcast message to all users', (done) => {
  clientSocket1 = ioClient(URL);
  clientSocket2 = ioClient(URL);

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

test('should update usernames list', (done) => {
  clientSocket1 = ioClient(URL);
  clientSocket2 = ioClient(URL);

  clientSocket1.on('connect', () => {
    clientSocket2.on('connect', () => {

      const handler = (users) => {
        if (users.includes('A') && users.includes('B')) {
          clientSocket1.off('usernames', handler); // prevent multiple calls
          done();
        }
      };

      clientSocket1.on('usernames', handler);

      clientSocket1.emit('new user', 'A', () => {
        clientSocket2.emit('new user', 'B');
      });

    });
  });
});