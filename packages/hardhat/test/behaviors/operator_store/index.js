const shouldBehaveLike = require("./behaviors");

module.exports = () => {
  describe("Set operator", shouldBehaveLike.setOperator);
  describe("Set operators", shouldBehaveLike.setOperators);
  describe("Has permission", shouldBehaveLike.hasPermission);
  describe("Has permissions", shouldBehaveLike.hasPermissions);
};
