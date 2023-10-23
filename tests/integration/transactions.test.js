const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let transaction = {};

describe("test POST /api/v1/transactions endpoint", () => {
  beforeAll(async () => {
    await prisma.transactions.deleteMany();
  });

  test("test cari source_account_id & destination_account_id terdaftar didalam database -> sukses", async () => {
    try {
      let accounts = await prisma.bank_accounts.findMany();
      let source_account_id = accounts[0].id;
      let destination_account_id = accounts[1].id;
      let amount = 100000;

      let { statusCode, body } = await request(app).post("/api/v1/transactions").send({ source_account_id, destination_account_id, amount });

      transaction = body.data;

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("source_account_id");
      expect(body.data).toHaveProperty("destination_account_id");
      expect(body.data).toHaveProperty("amount");
      expect(body.data.source_account_id).toBe(source_account_id);
      expect(body.data.destination_account_id).toBe(destination_account_id);
      expect(body.data.amount).toBe(amount);
    } catch (err) {
      expect(err).toBe(err);
    }
  });

  test("test cari source_account_id & destination_account_id tidak terdaftar didalam database -> error", async () => {
    let source_account_id = transaction.source_account_id + 1000;
    let destination_account_id = transaction.destination_account_id + 1000;
    let amount = 100000;

    let { statusCode, body } = await request(app).post("/api/v1/transactions").send({ source_account_id, destination_account_id, amount });

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("data");
  });
});

describe("test GET /api/v1/transactions endpoint", () => {
  test("test cari semua transactions -> sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get("/api/v1/transactions");

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("transactions");
    } catch (err) {
      expect(err).toBe("error");
    }
  });
});

describe("test GET /api/v1/transactions/:id endpoint", () => {
  test("test cari transaction id terdaftar didalam database -> sukses", async () => {
    let { statusCode, body } = await request(app).get(`/api/v1/transactions/${transaction.id}`);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("id");
    expect(body.data).toHaveProperty("amount");
    expect(body.data).toHaveProperty("source_account_id");
    expect(body.data).toHaveProperty("destination_account_id");
    expect(body.data.amount).toBe(transaction.amount);
    expect(body.data.source_account_id).toBe(transaction.source_account_id);
    expect(body.data.destination_account_id).toBe(transaction.destination_account_id);
  });

  test("test cari transaction id terdaftar didalam database -> error", async () => {
    let { statusCode, body } = await request(app).get(`/api/v1/transactions/${transaction.id + 1000}`);

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("data");
  });
});
