/**
 * The data containg information associated with the
 * change of the admin password.
 */
export interface ChangeAdminPasswordData {
  adminId: string;
  oldPassword: string;
  newPassword: string;
}
