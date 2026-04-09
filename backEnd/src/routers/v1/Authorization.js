import { Router } from "express";
import Login from "../../controllers/Login.js";
import { OTPverification, Reset  } from "../../controllers/Reset.js";
import verifyToken from "../../middleWares/Tokens.js";
import { assignPermissionsToRole, deleteAllMembers, getPermissionsByRole, getRolesAndPermissions, getUserRolesAndPermissions , listAllMembers, listAllUsersRolesPermissions, registerPermissions, registerRoles  , registerUser} from "../../controllers/roles-permisions/roles_permissions.js";
import { assignRolePermissionValidator, registerPermissionValidator, registerRoleValidator } from "../../validatoter/index.js";
import { validate } from "../../middleWares/validateRequestBody.js";

// authRoutes
// description on login the complete uri will be /authentication/v1/login
const route = Router();

route.post("/login", Login);
route.post("/reset", Reset);
route.post("/reset-email", verifyToken, Reset);
route.post("/otp/:regNo", OTPverification);


// function for registering  roles, permissions and assign permissions to roles , and registering a user with a role
route.post("/register",   registerUser);
route.post("/roles",registerRoleValidator , validate, registerRoles);
route.post("/permissions", registerPermissionValidator , validate, registerPermissions);
route.post("/role-permissions" , assignRolePermissionValidator, validate, assignPermissionsToRole);

// function for admin to manage roles and permissions, this is for testing purposes only, in production we will have an admin interface to manage users, roles and permissions
route.get("/list-roles-permissions", getRolesAndPermissions);
route.get("/list-permissions-by-role", getPermissionsByRole);
route.get("/users-role-permissions", getUserRolesAndPermissions);
route.get("/list-all-memebrs-roles-permisions", listAllUsersRolesPermissions);
route.get("/list-all-memebrs", listAllMembers);
route.get("/delete-all-memebers", deleteAllMembers);

export default route;
