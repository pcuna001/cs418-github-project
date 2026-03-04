import { compareSync, genSaltSync, hashSync } from 'bcrypt';

// Create new hashed password
export function hashPassword(password) {
    const salt = genSaltSync();

    const hashedPassword = hashSync(password, salt);

    return hashedPassword;
}

// Compares hashed password
export function checkPassword(password, hashedPassword) {
    return compareSync(password, hashedPassword);
}