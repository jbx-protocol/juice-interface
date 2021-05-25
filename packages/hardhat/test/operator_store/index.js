const {
  shouldBehaveLikeAddPermission,
  shouldBehaveLikeAddPermissions,
  shouldBehaveLikeRemovePermission,
  shouldBehaveLikeRemovePermissions,
  shouldBehaveLikeSetPackedPermissions
} = require("./behaviors");

module.exports = () => {
  describe("Add permission", shouldBehaveLikeAddPermission);
  describe("Add permissions", shouldBehaveLikeAddPermissions);
  describe("Remove permission", shouldBehaveLikeRemovePermission);
  describe("Remove permissions", shouldBehaveLikeRemovePermissions);
  describe("Set packed permissions", shouldBehaveLikeSetPackedPermissions);
};
