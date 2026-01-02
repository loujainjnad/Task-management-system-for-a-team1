import request from "supertest";
import argon2 from "argon2";

import app from "../src/app.js";
import { User } from "../src/models/User.js";
import { Roles } from "../src/constants/enums.js";

async function makeUser({ name, email, password, role }) {
  const passwordHash = await argon2.hash(password);
  return User.create({ name, email, passwordHash, role });
}

describe("T3.1 Projects CRUD + Membership", () => {
  test("POST /api/projects (manager only) - requires auth", async () => {
    const res = await request(app).post("/api/projects").send({
      name: "P1",
      startDate: "2026-01-01T00:00:00.000Z",
      endDate: "2026-02-01T00:00:00.000Z",
    });
    expect(res.statusCode).toBe(401);
  });

  test("Manager creates project with members; GET /api/projects returns projects of member", async () => {
    await makeUser({ name: "Manager", email: "m@test.com", password: "Pass1234!", role: Roles.MANAGER });
    const member1 = await makeUser({ name: "Member1", email: "u1@test.com", password: "Pass1234!", role: Roles.MEMBER });
    await makeUser({ name: "Member2", email: "u2@test.com", password: "Pass1234!", role: Roles.MEMBER });

    const loginManager = await request(app).post("/api/auth/login").send({ email: "m@test.com", password: "Pass1234!" });
    const managerToken = loginManager.body.token;

    const createRes = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "Project A",
        description: "test",
        startDate: "2026-01-01T00:00:00.000Z",
        endDate: "2026-02-01T00:00:00.000Z",
        members: [member1._id.toString()],
      });

    expect(createRes.statusCode).toBe(201);
    const projectId = createRes.body._id;

    const loginU1 = await request(app).post("/api/auth/login").send({ email: "u1@test.com", password: "Pass1234!" });
    const tokenU1 = loginU1.body.token;

    const u1Projects = await request(app).get("/api/projects").set("Authorization", `Bearer ${tokenU1}`);
    expect(u1Projects.statusCode).toBe(200);
    expect(u1Projects.body.length).toBe(1);
    expect(u1Projects.body[0]._id).toBe(projectId);

    const loginU2 = await request(app).post("/api/auth/login").send({ email: "u2@test.com", password: "Pass1234!" });
    const tokenU2 = loginU2.body.token;

    const u2Projects = await request(app).get("/api/projects").set("Authorization", `Bearer ${tokenU2}`);
    expect(u2Projects.statusCode).toBe(200);
    expect(u2Projects.body.length).toBe(0);
  });

  test("GET /api/projects?memberId=... (manager filter)", async () => {
    await makeUser({ name: "Manager", email: "m2@test.com", password: "Pass1234!", role: Roles.MANAGER });
    const member = await makeUser({ name: "Member", email: "mbr@test.com", password: "Pass1234!", role: Roles.MEMBER });

    const loginManager = await request(app).post("/api/auth/login").send({ email: "m2@test.com", password: "Pass1234!" });
    const token = loginManager.body.token;

    await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Project B",
        startDate: "2026-01-01T00:00:00.000Z",
        endDate: "2026-02-01T00:00:00.000Z",
        members: [member._id.toString()],
      });

    const filtered = await request(app)
      .get(`/api/projects?memberId=${member._id.toString()}`)
      .set("Authorization", `Bearer ${token}`);

    expect(filtered.statusCode).toBe(200);
    expect(filtered.body.length).toBe(1);
    expect(filtered.body[0].name).toBe("Project B");
  });

  test("PUT/DELETE /api/projects/:id (permissions)", async () => {
    await makeUser({ name: "Manager", email: "m3@test.com", password: "Pass1234!", role: Roles.MANAGER });
    await makeUser({ name: "Member", email: "mem@test.com", password: "Pass1234!", role: Roles.MEMBER });

    const loginManager = await request(app).post("/api/auth/login").send({ email: "m3@test.com", password: "Pass1234!" });
    const managerToken = loginManager.body.token;

    const loginMember = await request(app).post("/api/auth/login").send({ email: "mem@test.com", password: "Pass1234!" });
    const memberToken = loginMember.body.token;

    const created = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({ name: "Project C", startDate: "2026-01-01T00:00:00.000Z", endDate: "2026-02-01T00:00:00.000Z" });
    const id = created.body._id;

    const memberUpdate = await request(app)
      .put(`/api/projects/${id}`)
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ name: "Hacked" });
    expect(memberUpdate.statusCode).toBe(403);

    const updated = await request(app)
      .put(`/api/projects/${id}`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({ name: "Project C Updated" });
    expect(updated.statusCode).toBe(200);

    const memberDelete = await request(app)
      .delete(`/api/projects/${id}`)
      .set("Authorization", `Bearer ${memberToken}`);
    expect(memberDelete.statusCode).toBe(403);

    const del = await request(app)
      .delete(`/api/projects/${id}`)
      .set("Authorization", `Bearer ${managerToken}`);
    expect(del.statusCode).toBe(204);
  });

  test("Validation works on create project", async () => {
    await makeUser({ name: "Manager", email: "m4@test.com", password: "Pass1234!", role: Roles.MANAGER });
    const loginManager = await request(app).post("/api/auth/login").send({ email: "m4@test.com", password: "Pass1234!" });
    const token = loginManager.body.token;

    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Bad", startDate: "not-a-date", endDate: "not-a-date" });

    expect(res.statusCode).toBe(400);
  });
});
