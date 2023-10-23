const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let user = {};

describe("test POST /api/v1/users endpoint", () => {
  beforeAll(async () => {
    await prisma.transactions.deleteMany();
    await prisma.bank_accounts.deleteMany();
    await prisma.profiles.deleteMany();
    await prisma.users.deleteMany();
  });

  test("test email belum terdaftar -> sukses", async () => {
    try {
      let name = "usertest";
      let email = "usertest@mail.com";
      let password = "pasword123";
      let identity_type = "KTP";
      let identity_number = "1234567890";
      let address = "Jalan Sudirman No. 123";

      let { statusCode, body } = await request(app).post("/api/v1/users").send({ name, email, password, identity_type, identity_number, address });

      user = body.data.newUser;

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("newUser");
      expect(body.data.newUser).toHaveProperty("id");
      expect(body.data.newUser).toHaveProperty("name");
      expect(body.data.newUser).toHaveProperty("email");
      expect(body.data.newUser).toHaveProperty("password");
      expect(body.data.newUser.name).toBe(user.name);
      expect(body.data.newUser.email).toBe(user.email);
      expect(body.data.newUser.password).toBe(user.password);
    } catch (err) {
      expect(err).toBe("error");
    }
  });

  test("test email sudah terdaftar -> error", async () => {
    let name = "usertest";
    let email = "usertest@mail.com";
    let password = "pasword123";
    let identity_type = "KTP";
    let identity_number = "1234567890";
    let address = "Jalan Sudirman No. 123";

    let { statusCode, body } = await request(app).post("/api/v1/users").send({ name, email, password, identity_type, identity_number, address });

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("data");
  });
});

describe("test GET /api/v1/users endpoint", () => {
  test("test cari semua users -> sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get("/api/v1/users");

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("users");
    } catch (err) {
      expect(err).toBe("error");
    }
  });
});

describe("test GET /api/v1/users/:id endpoint", () => {
  test("test cari user id terdaftar didalam database -> sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get(`/api/v1/users/${user.id}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("email");
      expect(body.data).toHaveProperty("password");
      expect(body.data.name).toBe(user.name);
      expect(body.data.email).toBe(user.email);
      expect(body.data.password).toBe(user.password);
    } catch (err) {
      expect(err).toBe("error");
    }
  });

  test("test cari user id terdaftar didalam database -> error", async () => {
    let { statusCode, body } = await request(app).get(`/api/v1/users/${user.id + 1000}`);

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("data");
  });
});

describe("test POST /api/v1/users/auth/register endpoint", () => {
  test("test email belum terdaftar -> sukses", async () => {
    try {
      let name = "usertest2";
      let email = "usertest2@mail.com";
      let password = "pasword123";
      let password_confirmation = "pasword123";

      let { statusCode, body } = await request(app).post("/api/v1/users/auth/register").send({ name, email, password, password_confirmation });

      user = body.data.newUser;

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("newUser");
      expect(body.data.newUser).toHaveProperty("id");
      expect(body.data.newUser).toHaveProperty("name");
      expect(body.data.newUser).toHaveProperty("email");
      expect(body.data.newUser).toHaveProperty("password");
      expect(body.data.newUser.name).toBe(user.name);
      expect(body.data.newUser.email).toBe(user.email);
      expect(body.data.newUser.password).toBe(user.password);
    } catch (err) {
      expect(err).toBe("error");
    }
  });

  test("test email sudah terdaftar -> error", async () => {
    let name = "usertest2";
    let email = "usertest2@mail.com";
    let password = "pasword123";
    let password_confirmation = "pasword123";

    let { statusCode, body } = await request(app).post("/api/v1/users/auth/register").send({ name, email, password, password_confirmation });

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("data");
  });
});

describe("test POST /api/v1/users/auth/login endpoint", () => {
  test("test login user -> sukses", async () => {
    try {
      let email = "usertest2@mail.com";
      let password = "pasword123";

      let { statusCode, body } = await request(app).post("/api/v1/users/auth/login").send({ email, password });

      user = body.data;

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("user");
      expect(body.data).toHaveProperty("token");
      expect(body.data.user).toHaveProperty("id");
      expect(body.data.user).toHaveProperty("name");
      expect(body.data.user).toHaveProperty("email");
      expect(body.data.user).toHaveProperty("password");
      expect(body.data.user.name).toBe(user.user.name);
      expect(body.data.user.email).toBe(user.user.email);
      expect(body.data.user.password).toBe(user.user.password);
    } catch (err) {
      expect(err).toBe("error");
    }
  });

  test("test email & password salah -> error", async () => {
    let email = "usertest3@mail.com";
    let password = "pasword1234";

    let { statusCode, body } = await request(app).post("/api/v1/users/auth/login").send({ email, password });

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("data");
  });
});

describe("test GET /api/v1/users/auth/authenticate endpoint", () => {
  test("test cari user menggunakan token -> sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get(`/api/v1/users/auth/authenticate`).set("Authorization", `Bearer ${user.token}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("user");
      expect(body.data.user).toHaveProperty("id");
      expect(body.data.user).toHaveProperty("name");
      expect(body.data.user).toHaveProperty("email");
      expect(body.data.user).toHaveProperty("password");
      expect(body.data.user.name).toBe(user.user.name);
      expect(body.data.user.email).toBe(user.user.email);
      expect(body.data.user.password).toBe(user.user.password);
    } catch (err) {
      expect(err).toBe("error");
    }
  });

  test("test cari user menggunakan token -> error", async () => {
    let { statusCode, body } = await request(app)
      .get(`/api/v1/users/auth/authenticate`)
      .set("Authorization", `Bearer ${"hashags" + user.token}`);

    expect(statusCode).toBe(401);
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("data");
  });
});
