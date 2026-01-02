import { Project } from "../models/Project.js";
import { ApiError } from "../utils/apiError.js";

export const projectsService = {
  async create({ name, description, startDate, endDate, createdBy, members = [] }) {
    const uniq = Array.from(new Set(members.map(String)));
    return Project.create({
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdBy,
      members: uniq,
    });
  },

  async list({ user, memberId }) {
    const filter = {};
    if (user?.role === "TeamMember") {
      filter.members = user.id;
    } else if (memberId) {
      filter.members = memberId;
    }
    return Project.find(filter).sort({ createdAt: -1 });
  },

  async getById(id) {
    const p = await Project.findById(id);
    if (!p) throw new ApiError(404, "Project not found");
    return p;
  },

  async update(id, patch) {
    const p = await Project.findById(id);
    if (!p) throw new ApiError(404, "Project not found");

    Object.assign(p, patch);

    if (patch.startDate) p.startDate = new Date(patch.startDate);
    if (patch.endDate) p.endDate = new Date(patch.endDate);

    if (patch.members) {
      const uniq = Array.from(new Set(patch.members.map(String)));
      p.members = uniq;
    }

    await p.save();
    return p;
  },

  async remove(id) {
    const p = await Project.findById(id);
    if (!p) throw new ApiError(404, "Project not found");
    await p.deleteOne();
  },
};
