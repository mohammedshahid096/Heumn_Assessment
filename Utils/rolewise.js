function hasPermission(role, action) {
  const permissions = {
    admin: ["read", "delete", "update", "create", "assign"],
    manager: ["read", "update", "create", "assign"],
    lead: ["read", "update", "assign"],
    member: ["read", "update"],
  };

  if (!permissions[role]) {
    return false;
  }

  return permissions[role].includes(action);
}
module.exports = hasPermission;
