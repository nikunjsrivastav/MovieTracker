import * as authService from "../services/authService.js";

export async function register(req, res) {
  const user = await authService.registerUser(req.body);

  return res.status(201).json({ user });
}

export async function login(req, res) {
  const result = await authService.loginUser(req.body);

  return res.status(200).json(result);
}
