import { IUser, IUserDocument } from '@interfaces/models/user.interface';
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true
		},
		name: {
			type: String,
			trim: true,
			required: true
		},
		dni: {
			type: String,
			trim: true
		},
		birthDate: {
			type: Date
		},
		address: {
			type: String,
			trim: true
		},
		password: {
			type: String,
			trim: true,
			required: true
		},
		favRestaurants: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'restaurant'
				}
			],
			default: []
		}
	},
	{
		timestamps: true,
		versionKey: false,
		toJSON: {
			transform: (_, ret) => {
				delete ret.password;
				delete ret.createdAt;
				delete ret.updatedAt;
				return ret;
			}
		}
	}
);

userSchema.pre<IUserDocument>('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}
	this.password = await bcrypt.hash(this.password, 8);
	next();
});

userSchema.methods.checkPassword = async function (password: string): Promise<boolean> {
	return bcrypt.compare(password, this.password);
};

export const UserModel = model<IUserDocument>('user', userSchema);
