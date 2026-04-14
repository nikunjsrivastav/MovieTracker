import * as userService from "../services/userService.js";

export async function getCurrentUserProfile(req, res) {
  return res.status(200).json({ user: req.user });
}

export async function updateCurrentUserProfile(req, res) {
  const user = await userService.updateCurrentUser(req.user.id, req.body);

  return res.status(200).json({ user });
}

export async function deleteCurrentUserProfile(req, res) {
  await userService.deleteCurrentUser(req.user.id);

  return res.status(204).send();
}
