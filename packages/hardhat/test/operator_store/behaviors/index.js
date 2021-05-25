const shouldBehaveLikeAddPermission = require("./add_permission");
const shouldBehaveLikeAddPermissions = require("./add_permissions");
const shouldBehaveLikeRemovePermission = require("./remove_permission");
const shouldBehaveLikeRemovePermissions = require("./remove_permissions");
const shouldBehaveLikeSetPackedPermissions = require("./set_packed_permissions");

module.exports = {
  shouldBehaveLikeAddPermission,
  shouldBehaveLikeAddPermissions,
  shouldBehaveLikeRemovePermission,
  shouldBehaveLikeRemovePermissions,
  shouldBehaveLikeSetPackedPermissions
};
