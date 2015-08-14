# openapi
Expose WebService to OpenAPI

## Database schema

```sql

CREATE TABLE `apis` (
  `id` int(16) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `version` varchar(16) NOT NULL,
  `method` varchar(8) NOT NULL,
  `url` varchar(1024) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `enabled` bit(1) NOT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `creator` int(16) DEFAULT NULL,
  `modifier` int(16) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `merchants` (
  `id` int(16) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `ekey` varchar(3072) NOT NULL ,
  `dkey` varchar(3072) NOT NULL ,
  `enabled` bit(1) NOT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `creator` int(16) DEFAULT NULL,
  `modifier` int(16) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `merchantapiconfigs` (
  `id` int(16) unsigned NOT NULL ,
  `merchantid` int(16) unsigned NOT NULL ,
  `apiid` int(16) unsigned NOT NULL ,
  `daycallnum`   int(16) unsigned NOT NULL,
  `daynumcalled` int(16) unsigned NOT NULL,
  `totalcallnum`   bigint(64) unsigned NOT NULL,
  `totalnumcalled`  bigint(64) unsigned NOT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `creator` int(16) DEFAULT NULL,
  `modifier` int(16) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

## Test data

```sql

INSERT INTO `apis` VALUES ('1', 'openapi.test.helloworld', '1', 'POST', 'http://127.0.0.1:9000/helloworld', 'HelloWorld Test', '1', '2015-08-10 12:31:00', '2015-08-10 12:31:03', '1', '1');
INSERT INTO `merchants` VALUES ('1', 'test', 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlFjiYb3lkRo2ZJUIwT8NX49JsvueIp2GAgOzGR1R9TYZ9eQEKfZtTn4114TA/yGhcDMhwEvFH3p8AkIppQnOsccSR1fkvyF4h6xoq0DovgEft3KdIBqar/f2AAk7cwuKrZNhwG8ANILsVhtUtPhzIDoSNkh0ZJ2412pA3oEY6MPxTZ6gGDQs9xX/DOmxnDDwuWEzfyg1qpwVguHDtHcuxSjozZBaQ6hUxwtC2ATwyGV6TdL6XxzwrgtF8dmpYKX4UhjBQVwofC3FtgNjMpfzVlPhdSxDMb2SZy0AVv+077ETBNGIRVuAeDydzThi9a+YGVmi1ORxS18gAggjGUgxWQIDAQAB\n', 'MIIEowIBAAKCAQEAlFjiYb3lkRo2ZJUIwT8NX49JsvueIp2GAgOzGR1R9TYZ9eQEKfZtTn4114TA/yGhcDMhwEvFH3p8AkIppQnOsccSR1fkvyF4h6xoq0DovgEft3KdIBqar/f2AAk7cwuKrZNhwG8ANILsVhtUtPhzIDoSNkh0ZJ2412pA3oEY6MPxTZ6gGDQs9xX/DOmxnDDwuWEzfyg1qpwVguHDtHcuxSjozZBaQ6hUxwtC2ATwyGV6TdL6XxzwrgtF8dmpYKX4UhjBQVwofC3FtgNjMpfzVlPhdSxDMb2SZy0AVv+077ETBNGIRVuAeDydzThi9a+YGVmi1ORxS18gAggjGUgxWQIDAQABAoIBADMiSDYkvMK9ZE5bSL9Duppby62UKbgI0C5VlCBuCNgbI+usAvtr49WQj4KQUe4fa4Q/O70K4RGuqJwmrjAjJ0oEMnrBAyoWoXMyrImLQC5uOL6FFUABq5xIPlVY2VMYgV6/VIx+NnXjQw+TMCmJEjXjjm+DngsoipRGHcIUgb+Jc2Ira0PYOmOEnPc8wIRKD35z+LO2lJGUpbItYnN8SjYZ0ZSguWjfUMl0X9u2M5t7lipSiZYPAQSbIEEiuBocOLQrPdjIX9sqsUE2jNkJSSmLoyHSqyblpsbzgPx5DxIlbVE1m+v9Fk7dVzAakvu0W11Kt1LV1FBF16YsGLnKAGECgYEA3evR/lwS8SECJnd7VpD4xenShOTCgZ5tM1nOTcUhVm/YW6Amr1tK5UVPPM0fe0g3QotvNFtbcxUoXyG0hvbLYHhXI/N5ZQ2XFwqhUjB82VVyvZUNvhI9t79uXfkttzw3/lUqAFmpGbY2in5qK2lXl11hLOpi6UANaoaB6ztClX0CgYEAqyC4JiyZSXu/HoGxck8SUb5FJN9C6NUSLNrHexe3PVLYBe5Pa9X5vI8GjbayEA5jpJjh4cuKShWWQwiXn5rf15o/+JkheE2VEX1Ou4sossFi0iy0xvgwfD/HEPiwYlebQ/sHAV0fjVtVRBbH1fkBumi4soEfslvBT87Arvj8Ig0CgYA/MzGSptYeJbBfFBfkB1VRx81UW3GpSF0BCspeC436988+CNX7ipxBvwNZ5XDZwy85nEwHNR1OIPBmZ0rqRM6Woq7uZiBkTwKAZV6b8YMcweDzbMeFIdzBv5rG2HfUfynTHJ3hi6dE00elGWtTAaUYTlemWvngQ4WOmM/XFgFYYQKBgE4Y55GcZvRvQiCVBbtqNK0TjZCvR2Tk4J+R1NnrT9fvt+C1Co/nHkscZtxD1W2Yc4cJsoSOlHUM9v9uq2vOjXtizPESSYESvwY1TrouXwt9UDEk7/eiCtaZcKrhI/YtjxFuPZs0uZKUbQxe7SJMuqos4qWsYh/O2iEm9S6lOMP9AoGBAIu2hLs8mNB5+DNo1QaajB/yT95S5ySPvB9SKBF4BiEzwb9tTg4q4C+Sk0LpGkrVyq/hPcgwBonaZJZtohWvzLkrJC++lEvKVb1fvHLrpgddCkcE23SFHpvtgWdCUXfZRcBOaG4UUHiKmhQvBJQuNiTOydEJXW77i3M50vYbJI9L\n', '1', '2015-08-10 11:33:12', '2015-08-10 11:33:17', '1', '1');
INSERT INTO `merchantapiconfigs` VALUES ('1', '1', '1', '10000', '0', '100000', '0', '2015-08-10 11:44:40', '2015-08-24 11:44:45', '1', '1');

