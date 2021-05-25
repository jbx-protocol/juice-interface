const shouldBehaveLikeAddPermissionToOperator = require("./add_permissions_to_operators");
const shouldBehaveLikeAddPermissionsToOperators = require("./add_permissions_to_operators");
const shouldBehaveLikeRemovePermissionsFromOperator = require("./remove_permissions_from_operator");
const shouldBehaveLikeRemovePermissionsFromOperators = require("./remove_permissions_from_operators");
const shouldBehaveLikeSetPackedPermissions = require("./set_packed_permissions");
const shouldBehaveLikeHasPermission = require("./has_permission");
const shouldBehaveLikeHasPermissions = require("./has_permissions");

module.exports = {
  shouldBehaveLikeAddPermissionToOperator,
  shouldBehaveLikeAddPermissionsToOperators,
  shouldBehaveLikeRemovePermissionsFromOperator,
  shouldBehaveLikeRemovePermissionsFromOperators,
  shouldBehaveLikeSetPackedPermissions,
  shouldBehaveLikeHasPermission,
  shouldBehaveLikeHasPermissions
};
