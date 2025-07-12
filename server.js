import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// 소켓 연결 이벤트
io.on('connection', (socket) => {
  console.log('클라이언트 연결됨:', socket.id);
  // 필요시 인증 및 join room 등 구현 가능
});

// 알림 전송 함수 (다른 서비스에서 사용 가능하도록 export)
function sendNotificationToAllClients(notification) {
  io.emit('notification', notification);
}

// 전역에서 사용 가능하도록 export
export { io, sendNotificationToAllClients };

server.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`환경: ${process.env.NODE_ENV}`);
  console.log(`API 문서: http://localhost:${PORT}/api/health`);
});
