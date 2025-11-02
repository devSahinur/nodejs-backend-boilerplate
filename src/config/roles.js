const allRoles = {
  user: ['getUsers', 'manageUsers'],
  admin: ['getUsers', 'manageUsers', 'getProducts', 'manageProducts', 'getOrders', 'manageOrders'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

export { roles, roleRights };
export default { roles, roleRights };
