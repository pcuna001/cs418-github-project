import { Router } from "express";
import { connection } from "../database/connection.js";
import { sendEmail } from "../helper/emailsend.js";
import { checkPassword, hashPassword } from "../helper/util.js";
const user = Router();

// Query users
user.get("/",async(req,res) => {
    try {
        const[rows] = await connection.execute("SELECT * FROM account_info")

        res.status(200).json({
            status: 200,
            message: "Successfully obtained users.",
            data: rows
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
            data: null
        });
    }
});

// Get user by ID
user.get("/:id", async(req,res) => {
    try {
        const[rows] = await connection.execute("SELECT * FROM account_info WHERE u_id = ?", [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "User not found.",
                data: null
            });
        }
        res.status(200).json({
            status: 200,
            message: "Successfully obtained user.",
            data: rows
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
            data: null
        });
    }
})

// Add new user to the database
user.post("/", async(req,res) => {
    try {
        const {
            u_username,
            u_firstname,
            u_lastname,
            u_email,
            u_password,
            u_verified,
            u_admin
        } = req.body;

        if (!u_username || !u_firstname || !u_lastname || !u_email || !u_password) {
            return res.status(400).json({
                status: 400,
                message: "Required fields empty.",
                data: null
            });
        }

        const hashedPassword = hashPassword(u_password);

        const[result] = await connection.execute(
            `INSERT INTO account_info
            (u_username, u_firstname, u_lastname, u_email, u_password, u_verified, u_admin)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                u_username,
                u_firstname,
                u_lastname,
                u_email,
                hashedPassword,
                u_verified ?? 0,
                u_admin ?? 0
            ]
        );

        res.status(201).json({
            status: 201,
            message: "Added new user to the database successfully.",
            data: { insertID: result.insertID }
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
            data: null
        });
    }
});

// Update user info
user.put("/updateinfo", async(req,res) => {
    try {
        const{ u_username, u_firstname, u_lastname, u_password } = req.body;

        if (!u_username || !u_firstname || !u_lastname || !u_password) {
            return res.status(400).json({
                status: 400,
                message: "Required fields empty.",
                data: null
            });
        }

        const hashedPassword = hashPassword(u_password);

        const[result] = await connection.execute(
            `UPDATE account_info SET u_username = ?, u_firstname = ?, u_lastname = ?, u_password = ? WHERE u_id = ?`,
            [u_username, u_firstname, u_lastname, hashedPassword, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "User not found.",
                data: null
            });
        }

        res.status(200).json({
            status: 200,
            message: "Successfully updated user info.",
            data: rows
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
            data: null
        });
    }
});

// Password reset
user.put("/resetpassword", async(req,res) => {
    try {
        const{ u_password } = req.body;

        if (!u_password) {
            return res.status(400).json({
                status: 400,
                message: "Required fields empty.",
                data: null
            });
        }

        const hashedPassword = hashPassword(u_password);

        const[result] = await connection.execute(
            `UPDATE account_info SET u_password = ? WHERE u_id = ?`,
            [u_username, hashedPassword, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "User not found.",
                data: null
            });
        }

        res.status(200).json({
            status: 200,
            message: "Successfully reset password.",
            data: rows
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
            data: null
        });
    }
});

// Delete user from database
user.delete("/:id", async(req,res) => {
    try {
        const[result] = await connection.execute(
            "DELETE FROM account_info WHERE u_id = ?", [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "User not found.",
                data: null
            });
        }

        res.status(200).json({
            status: 200,
            message: "Successfully deleted user.",
            data: rows
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
            data: null
        });
    }
})

// User login API
user.post("/login", async(req,res) => {
    try {
        const { u_username, u_email, u_password } = req.body || {};

        // Check input
        if (!(u_username || u_email) || !u_password) {
            return res.status(400).json({
                status: 400,
                message: "Required username/email and password empty.",
                data: null
            });
        }

        // Query user
        const[rows] = await connection.execute("SELECT * FROM account_info WHERE u_username = ? LIMIT 1", [u_username]);
        if (rows.length === 0) {
            return res.status(401).json({
                status: 401,
                message: "Invalid username.",
                data: null
            });
        }

        const accountInfo = rows[0];

        // Check password
        if (!checkPassword(u_password, accountInfo.u_password)) {
            return res.status(401).json({
                status: 401,
                message: "Invalid password.",
                data: null
            });
        }

        // Start 2FA via OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiration = new Date(Date.now() + 5 * 60 * 1000);

        await connection.execute(`INSERT INTO 2fa_check (email, otp, expiration) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = VALUES(otp), expiration = VALUES(expiration)`,
            [   
                accountInfo.u_email, 
                otp,
                expiration
            ]
        );

        // Send OTP
        const subject = "Two-factor authentication: please enter your code"
        const body = `<h2>An one-time password has been sent.</h2>
                     <h1 style="letter-spacing:2px;">${otp}</h1>
                     <p>This code expires in 5 minutes.</p>`
        
        sendEmail(accountInfo.u_email, subject, body);

        // Remove password
        const { u_password: _, ...safeUser } = accountInfo;

        return res.status(200).json({
            status: 200,
            message: "A one-time password has been sent to your email account. Please check and use code to verify your login.",
            email: accountInfo.u_email
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
            data: null
        });
    }
});


// 2FA-OTP API
user.post("/verify-otp", async(req,res) => {
    try {
        const { email, otp } = req.body || {};
        if (!email || !otp) {
            return res.status(400).json({
                status: 400,
                message: "Email and OTP not detected.",
                data: null
            });
        }

        const [rows] = await connection.execute(
            `SELECT otp, expiration FROM 2fa_check WHERE email = ? LIMIT 1`, [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                status: 401,
                message: "OTP not found. Please send in a new 2FA request.",
                data: null
            });
        }

        const record = rows[0];
        const expiration = new Date(record.expiration);

        if (Date.now() > expiration.getTime()) {
            await connection.execute(`DELETE FROM 2fa_check WHERE email = ? LIMIT 1`, [email]);
            return res.status(400).json({
                status: 400,
                message: "OTP has expired. Please send in a new 2FA request.",
                data: null
            });
        }

        if (record.otp !== otp) {
            return res.status(400).json({
                status: 400,
                message: "OTP is incorrect. Please check your email for the correct OTP.",
                data: null
            });
        }

        // If OTP is correct, end 2FA and delete OTP
        await connection.execute(`DELETE FROM 2fa_check WHERE email = ? LIMIT 1`, [email]);

        // Get user information and return safe user
        const[userRows] = await connection.execute(
            "SELECT * FROM account_info WHERE u_email = ? LIMIT 1",
            [email]
        );

        const accountInfo = userRows[0];
        const { u_password: _, ...safeUser } = accountInfo;

        return res.status(200).json({
            status: 200,
            message: "2FA successful. Login has now been completed.",
            email: accountInfo.u_email
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
            data: null
        });
    }
})

export default user;