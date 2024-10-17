import { Schema, model, models } from 'mongoose';

interface IUser {
    username: string;
    password: string;
    role: string;
    createdAt: Date;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const User = models.Users || model<IUser>('Users', userSchema);
export default User;
