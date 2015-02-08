DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS test;
DROP TABLE IF EXISTS person2test;
DROP TABLE IF EXISTS person2person;

CREATE TABLE person (
  firstName TEXT,
  lastName TEXT,
  username TEXT PRIMARY KEY UNIQUE,
  password TEXT,
  grader INTEGER
);

CREATE TABLE test (
  tId INTEGER PRIMARY KEY UNIQUE,
  professor TEXT,
  qPerPage INTEGER,
  qTotal INTEGER
);

CREATE TABLE person2person (
  professor TEXT,
  grader TEXT,
  PRIMARY KEY(professor, grader)
);


CREATE TABLE person2test (
  username TEXT,
  tId INTEGER,
  grader INTEGER,
  PRIMARY KEY(username, tId)
);