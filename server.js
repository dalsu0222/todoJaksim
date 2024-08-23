require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
const { log } = require("console");
const MONGO_PASS = process.env.MONGO_PASS;
const MONGODB_URI = `mongodb+srv://dalsu0222:${MONGO_PASS}@cluster0.rav7e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(MONGODB_URI);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static("pubilc"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

async function getDB() {
  await client.connect();
  return client.db("todo");
}

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/list", async (req, res) => {
  try {
    let db = await getDB();
    const posts = await db
      .collection("posts")
      .find()
      .sort({ _id: -1 }) // 역순으로 나열
      // .limit(3)
      .toArray();

    res.render("list", { posts }); // list.ejs에 보내기
  } catch (err) {
    console.error(err);
  }
});

app.post("/add", async (req, res) => {
  const { title, dateOfGoals, dateOfCreate, todoDetail } = req.body;

  try {
    let db = await getDB();
    await db
      .collection("posts")
      .insertOne({ title, dateOfGoals, dateOfCreate, todoDetail });
    console.log("데이터 추가 성공");

    res.redirect("/list");
  } catch (err) {
    console.error(err);
  }
});

app.delete("/delete/:id", async (req, res) => {
  // const _id = req.params.id; // params로 id 받아오기
  // console.log(_id);
  // console.log(typeof _id); // string
  const _id = new ObjectId(req.params.id); // ObjectId로 변환
  console.log(typeof _id);

  try {
    let db = await getDB();
    const result = await db.collection("posts").deleteOne({ _id });
    console.log("데이터 삭제 성공", result); // { acknowledged: true, deletedCount: 1 }

    if (result.deletedCount === 0) {
      res
        .status(404)
        .json({ message: "해당 데이터가 없습니다.", success: false });
    } else {
      // res.sendStatus(200);
      res.json({ message: "성공", success: true });
      // res.redirect("/list");
      // location.reload();
    }

    // 리렌더링 필요
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 에러" });
  }
});

app.get("/detail/:id", async (req, res) => {
  const _id = new ObjectId(req.params.id);

  try {
    let db = await getDB();
    const post = await db.collection("posts").findOne({ _id });
    res.render("detail", { post }); // detail.ejs 파일에 post 정보 보내주기
  } catch (err) {
    console.error(err);
  }
});

app.get("/edit/:id", async (req, res) => {
  // data binding edit page
  const _id = new ObjectId(req.params.id);
  try {
    let db = await getDB();
    const post = await db.collection("posts").findOne({ _id });
    res.render("edit", { post }); // detail.ejs 파일에 post 정보 보내주기
  } catch (err) {
    console.error(err);
  }
});
app.put("/edit/:id", async (req, res) => {
  // edit request
  const _id = new ObjectId(req.params.id);
  const { title, dateOfGoals, dateOfCreate, todoDetail } = req.body;
  try {
    let db = await getDB();
    const response = await db.collection("posts").updateOne(
      { _id },
      { $set: { title, dateOfGoals, dateOfCreate, todoDetail } } // $set 사용하여 수정
    );
    console.log(response.modifiedCount);
    console.log(typeof response.modifiedCount);

    if (response.modifiedCount === 0) {
      res
        .status(404)
        .json({ message: "해당 데이터가 없습니다.", success: false });
      return;
    } else {
      res.json({ message: "성공", success: true });
    }
  } catch (err) {
    console.error(err);
  }
});

app.listen(3000, () => {
  console.log("서버 실행중...");
});
