let db;

class Post {
  static async injectDB(conn) {
    if (db) return;
    try {
      db = conn.db("todo"); // await 제거
      console.log("DB 연결 성공");
    } catch (err) {
      console.error("DB연결 실패 :", err);
    }
  }
  static async getAll() {
    return await db.collection("posts").find().sort({ _id: -1 }).toArray();
  }

  static async create(postData) {
    return await db.collection("posts").insertOne(postData);
  }

  static async delete(postId) {
    return await db.collection("posts").deleteOne({ _id: postId });
  }

  static async getOne(postId) {
    return await db.collection("posts").findOne({ _id: postId });
  }

  static async update(postId, postData) {
    return await db
      .collection("posts")
      .updateOne({ _id: postId }, { $set: postData });
  }
}

export default Post;
