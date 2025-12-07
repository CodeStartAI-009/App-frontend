import api from "./api";

/* CREATE GROUP */
export function createSplitGroup(data) {
  return api.post("/split/create", data);
}

/* GROUPS CREATED BY USER */
export function getMyCreatedGroups() {
  return api.get("/split/my-created");
}

/* GROUPS WHERE USER IS MEMBER */
export function getMyParticipantGroups() {
  return api.get("/split/my-participating");
}

/* GROUP DETAILS */
export function getGroupDetails(groupId) {
  return api.get(`/split/${groupId}`);
}

/* UPDATE GROUP (Rename to updateGroup so frontend can use it) */
export function updateGroup(groupId, data) {
  return api.patch(`/split/edit/${groupId}`, data);
}

/* MARK GROUP COMPLETE */
export function markGroupComplete(groupId) {
  return api.post(`/split/complete/${groupId}`);
}
