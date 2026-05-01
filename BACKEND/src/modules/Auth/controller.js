import * as authService from "./service.js";

export const register = async (req, res) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({ success: true, message: 'User created successfully', user: user.id });
    } catch (err) {
        console.log(err.message)
        res.status(400).json({ message: err.message });
    }
}
export const login = async (req, res) => {
    try {
        const token = await authService.loginUser(req.body);
        res.status(200).json({ success: true, message: 'User logged successfully', token: token });
    } catch (err) {
        console.log(err.message)
        res.status(400).json({ message: err.message });
    }
}