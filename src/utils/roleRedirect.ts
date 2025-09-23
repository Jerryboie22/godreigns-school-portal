// Utility functions for role-based redirects

export const roleToPortalMap: Record<string, string> = {
  'admin': '/portals/admin',
  'teacher': '/portals/staff',
  'staff': '/portals/staff',
  'parent': '/portals/parent',
  'student': '/portals/student'
};

export const getPortalPathForRole = (role: string): string => {
  return roleToPortalMap[role] || `/portals/${role}`;
};

export const redirectToRoleBasedPortal = (role: string, delay: number = 1000) => {
  const redirectPath = getPortalPathForRole(role);
  setTimeout(() => {
    window.location.href = redirectPath;
  }, delay);
};

export const getRoleDisplayName = (role: string): string => {
  const displayNames: Record<string, string> = {
    'admin': 'Administrator',
    'teacher': 'Teacher',
    'staff': 'Staff',
    'parent': 'Parent',
    'student': 'Student'
  };
  return displayNames[role] || role;
};