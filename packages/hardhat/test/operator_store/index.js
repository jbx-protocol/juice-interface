const {
  shouldBehaveLikeAddPermissionToOperator,
  shouldBehaveLikeAddPermissionsToOperators,
  shouldBehaveLikeRemovePermissionsFromOperator,
  shouldBehaveLikeRemovePermissionsFromOperators,
  shouldBehaveLikeSetPackedPermissions,
  shouldBehaveLikeHasPermission,
  shouldBehaveLikeHasPermissions
} = require("./behaviors");

module.exports = () => {
  describe(
    "Add permissions to operator",
    shouldBehaveLikeAddPermissionToOperator
  );
  describe(
    "Add permissions to operators",
    shouldBehaveLikeAddPermissionsToOperators
  );
  describe(
    "Remove permissions from operator",
    shouldBehaveLikeRemovePermissionsFromOperator
  );
  describe(
    "Remove permissions from operators",
    shouldBehaveLikeRemovePermissionsFromOperators
  );
  describe("Set packed permissions", shouldBehaveLikeSetPackedPermissions);
  describe("Has permission", shouldBehaveLikeHasPermission);
  describe("Has permissions", shouldBehaveLikeHasPermissions);
};
