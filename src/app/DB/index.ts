import config from "../config";
import { USER_ROLE } from "../modules/user/user.constant";
import { User } from "../modules/user/user.model";

const superUser = {
    userName: 'superadmin',
    name: { firstName: 'Super', lastName: 'Admin' },
    email: config.super_admin_email,
    password: config.super_admin_password,
    role: 'superAdmin',
    isEmailVerified: true,
    isBanned: false,
    isDeleted: false,
    needsPasswordChange: false
};
const seedSuperAdmin = async () => {
    const isSuperAdminExist = await User.findOne({ role: USER_ROLE.superAdmin });
    if (!isSuperAdminExist) {
        await User.create(superUser);
    }
};
export default seedSuperAdmin;