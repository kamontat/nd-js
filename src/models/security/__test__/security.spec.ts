import "jest-extended";

import { ND } from "../../../constants/nd.const";
import { SECURITY_FAIL_ERR } from "../../../constants/error.const";
import uuid = require("uuid");
import { TEST_NAME, TEST_TOKEN } from "../../../../test/test";
import { TokenValidator } from "../TokenValidator";
import { UsernameValidator } from "../UsernameValidator";
import { Security } from "../../../apis/security";

describe("Security", function() {
  describe("Token validator", function() {
    test("Should checking the token error", function() {
      const shortToken = "GFER";
      const longToken: string[] = [];
      for (let i = 0; i < 20; i++) {
        longToken.push(uuid.v4().replace("-", ""));
      }
      const badToken = longToken.join("");

      expect(function() {
        new TokenValidator(shortToken).isValid();
      }).toThrow();

      expect(badToken.length).toBeGreaterThan(300);
      expect(function() {
        new TokenValidator(badToken).isValid();
      }).toThrow();
    });

    test.each([
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.iOjE12Q7bGZramtqa3NkamZramFrc2RqZmtqc2Rha2Zqa2phc2Rma2pramFzZGZramthc2RqZmtqa2Fkc2Zqa2phc2tkZmpramFzZGYiLCJpYXQiOjE1MTYyaSI6IktDLVNLRSJ9.NpcgNLnExu0jGavuF4mdlgcfm-j0aWx8YVrezEYBGkc",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJrbGFzamRma3F3ZXIiLCJuYW1lIjoiSmFzZGZrbGpxbDt3a2VqcmxrajtsZGtmamw7a2FkZmxramFzZDtsdztla3Jsa3Fqd2Vsa3Jqa2FzamRmIia2xqcWqZmtqRqZmtqa2Fkc2Zqa2p.IVN_yLdjPempfP8pS030yGLBY",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhcbmFtZSI6Ikphc2Rma2xqcWw7d2tlanJsa2o7bGRrZmpsO2thZGZsa2phc2Q7bGZramtqa3NkamZramFrc2RqZmtqzZGZramthc2RqZmtqa2FpYXQiOjE1MTYyMzkwMjJ9.tY-FBR_AO-eAegTj4TgQX51Zzz1tm28bKbC7ddIeBp8"
    ])("Pass '%s' token", function(token: string) {
      expect(new TokenValidator(token).isValid()).toBeTrue();
    });
  });

  describe("Username validator", function() {
    test("Should callback to default value", function() {
      const user_NO_NAME = "SURname email@g.com";

      // user no name
      const unn = new UsernameValidator(user_NO_NAME);

      expect(unn.isValid).toThrow();
      expect(unn.key).toBeEmpty();
      expect(unn.name).toBeEmpty();
      expect(unn.surname).toBeEmpty();
      expect(unn.email).toBeEmpty();
    });

    test("Should getting all name information", function() {
      const real_NAME = "name SURname email@g.com";

      const unn = new UsernameValidator(real_NAME);

      expect(unn.isValid()).toBeTrue();
      expect(unn.name).toEqual("name");
      expect(unn.surname).toEqual("SURname");
      expect(unn.email).toEqual("email@g.com");

      expect(unn.key).not.toBeEmpty();
      expect(unn.key).toInclude(ND.A());
    });

    test.each([
      "NAME",
      "!@#!@#$ SURNAME SDFJ#$!@@@#",
      "123 123 123",
      "NAME ^%&%%# email.com",
      "EMAIL@google.com SURNAME",
      "NAME SURNAME invalid@mail_format"
    ])("Should valid %s as error", function(username: string) {
      const uv = new UsernameValidator(username);
      expect(function() {
        uv.isValid();
      }).toThrowError(SECURITY_FAIL_ERR);
    });
  });

  describe("Static APIs", function() {
    describe("Checking method", function() {
      test("Should able to validator wrong token", function() {
        expect(function() {
          Security.Checking("token", "name surname email@e.com").isValid();
        }).toThrow();

        expect(function() {
          Security.Checking(
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJrbGFzamRma3F3ZXIiLCJuYW1lIjoiSmFzZGZrbGpxbDt3a2VqcmxrajtsZGtmamw7a2FkZmxramFzZDtsdztla3Jsa3Fqd2Vsa3Jqa2FzamRmIiwiaWF0IjoxNTE2MjM5MDIyfQ.IVN_yLdjPempfP8pS030yGLBC3EwwmS2RhyiDbFM_TY",
            "name surname email@e.com"
          ).isValid();
        }).toThrow();
      });

      test("Should able to decode the result in token", function() {
        expect(Security.Checking(TEST_TOKEN, TEST_NAME).isValid()).toBeTrue();
      });
    });
  });
});
