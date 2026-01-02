import { Router } from "express";
import * as projects from "../controllers/projects.controller.js";
import * as tasks from "../controllers/tasks.controller.js";
import { requireAuth } from "../middleware/require.auth.middleware.js";
import { requireRole } from "../middleware/require.role.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { createProjectSchema, updateProjectSchema } from "../validators/project.schemas.js"; //!
import { addMembersSchema } from "../validators/projectMembers.schemas.js"; //!
import { createTaskSchema } from "../validators/task.schemas.js"; //!
import { Roles } from "../constants/enums.js";

const router = Router();
router.use(requireAuth);

// Projects CRUD
router.post("/", requireRole([Roles.MANAGER]), validate(createProjectSchema), projects.create);
router.get("/", projects.list);
router.get("/:id", projects.getById);
router.put("/:id", requireRole([Roles.MANAGER]), validate(updateProjectSchema), projects.update);
router.patch("/:id", requireRole([Roles.MANAGER]), validate(updateProjectSchema), projects.update);
router.delete("/:id", requireRole([Roles.MANAGER]), projects.remove);

// Membership (Manager only)
router.post("/:id/members", requireRole([Roles.MANAGER]), validate(addMembersSchema), projects.addMembers);
router.delete("/:id/members/:memberId", requireRole([Roles.MANAGER]), projects.removeMember);

// Create task in project (Manager only)
router.post("/:projectId/tasks", requireRole([Roles.MANAGER]), validate(createTaskSchema), tasks.create);

export default router;
