import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const MONGO_PASS = process.env.MONGO_PASS;
const MONGODB_URI = `mongodb+srv://dalsu0222:${MONGO_PASS}@cluster0.rav7e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(MONGODB_URI);

// 데이터베이스 연결 함수
async function connectDB() {
  try {
    await client.connect();
    // db = client.db("todo");
    // global.db = client.db("todo");
    console.log("DB 연결 성공");
    return client;
  } catch (err) {
    console.error("DB 연결 실패", err);
    process.exit(1); // 서버 종료
  }
}

export default connectDB;
