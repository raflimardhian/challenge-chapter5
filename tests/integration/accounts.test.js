const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let account = {};

describe("test POST /api/v1/accounts endpoint", () => {
  beforeAll(async () => {
    await prisma.bank_accounts.deleteMany();
  });
  test("test cari user_id terdaftar didalam database -> sukses", async () => {
    try {
      let users = await prisma.users.findMany();
      let user_id = users[0].id;
      let bank_name = "BRI";
      let bank_account_number = "0123456789";
      let balance = 1000000;

      let { statusCode, body } = await request(app).post("/api/v1/accounts").send({ bank_name, bank_account_number, balance, user_id });

      account = body.data;

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("bank_name");
      expect(body.data).toHaveProperty("bank_account_number");
      expect(body.data).toHaveProperty("balance");
      expect(body.data).toHaveProperty("userId");
      expect(body.data.bank_name).toBe(bank_name);
      expect(body.data.bank_account_number).toBe(bank_account_number);
      expect(body.data.balance).toBe(balance);
      expect(body.data.user_id).toBe(user_id);
    } catch (err) {
      expect(err).toBe(err);
    }
  });

  test("test cari user_id terdaftar didalam database -> sukses", async () => {
    try {
      let users = await prisma.users.findMany();
      let user_id = users[0].id;
      let bank_name = "BCA";
      let bank_account_number = "0123456789";
      let balance = 1000000;

      let { statusCode, body } = await request(app).post("/api/v1/accounts").send({ bank_name, bank_account_number, balance, user_id });

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("bank_name");
      expect(body.data).toHaveProperty("bank_account_number");
      expect(body.data).toHaveProperty("balance");
      expect(body.data).toHaveProperty("userId");
      expect(body.data.bank_name).toBe(bank_name);
      expect(body.data.bank_account_number).toBe(bank_account_number);
      expect(body.data.balance).toBe(balance);
      expect(body.data.user_id).toBe(user_id);
    } catch (err) {
      expect(err).toBe(err);
    }
  });

  it("test cari user_id tidak terdaftar didalam database -> error", async () => {
    let users = await prisma.users.findMany();
    let user_id = users[0] + 1000;
    let bank_name = "BRI";
    let bank_account_number = "0123456789";
    let balance = 1000000;

    let { statusCode, body } = await request(app).post("/api/v1/accounts").send({ bank_name, bank_account_number, balance, user_id });

    expect(statusCode).toBe(500);
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("data");
  });
});

describe("test GET /api/v1/accounts endpoint", () => {
  test("test cari semua accounts -> sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get("/api/v1/accounts");

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("accounts");
    } catch (err) {
      expect(err).toBe("error");
    }
  });
});

describe("test GET /api/v1/accounts/:id endpoint", () => {
  test("test cari account id terdaftar didalam database -> sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get(`/api/v1/accounts/${account.id}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("bank_name");
      expect(body.data).toHaveProperty("bank_account_number");
      expect(body.data).toHaveProperty("userId");
      expect(body.data).toHaveProperty("user");
      expect(body.data.bank_account_number).toBe(account.bank_account_number);
      expect(body.data.balance).toBe(account.balance);
      expect(body.data.userId).toBe(account.userId);
    } catch (err) {
      expect(err).toBe("error");
    }
  });

  test("test cari account id terdaftar didalam database -> error", async () => {
    let { statusCode, body } = await request(app).get(`/api/v1/accounts/${account.id + 1000}`);

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("data");
  });
});
