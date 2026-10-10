-- Kite Database Setup Script
-- Run this after installing MySQL:
--   mysql -u root -p < server/setup_db.sql

CREATE DATABASE IF NOT EXISTS Kite;
USE Kite;

-- User Accounts table
CREATE TABLE IF NOT EXISTS UserAccounts(
    _id INT AUTO_INCREMENT PRIMARY KEY, 
    _uname CHAR(255) UNIQUE, 
    _email CHAR(255) UNIQUE, 
    _pass CHAR(255)
);

-- User Profiles table
CREATE TABLE IF NOT EXISTS UserProfiles(
    _id INT, 
    FOREIGN KEY(_id) REFERENCES UserAccounts(_id) ON DELETE CASCADE, 
    _rname CHAR(255), 
    _bio CHAR(255), 
    _pfp CHAR(255)
);

-- Friends/Follow Relationships table
CREATE TABLE IF NOT EXISTS FriendsRelationship(
    _follower INT, 
    _following INT, 
    UNIQUE(_follower, _following), 
    FOREIGN KEY(_follower) REFERENCES UserAccounts(_id), 
    FOREIGN KEY(_following) REFERENCES UserAccounts(_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS Notifications(
    _id INT, 
    FOREIGN KEY(_id) REFERENCES UserAccounts(_id), 
    _date DATE, 
    _msg CHAR(255), 
    _read BOOL
);

-- Posts table
CREATE TABLE IF NOT EXISTS Posts(
    _pid INT PRIMARY KEY AUTO_INCREMENT, 
    _uid INT, 
    FOREIGN KEY(_uid) REFERENCES UserAccounts(_id), 
    _img CHAR(255), 
    _text TEXT, 
    _private INT DEFAULT 1
);

-- Post Likes table
CREATE TABLE IF NOT EXISTS PostLikes(
    _uid INT, 
    FOREIGN KEY(_uid) REFERENCES UserAccounts(_id) ON DELETE CASCADE, 
    _pid INT, 
    FOREIGN KEY(_pid) REFERENCES Posts(_pid) ON DELETE CASCADE, 
    UNIQUE(_uid, _pid)
);

-- Post Saves table
CREATE TABLE IF NOT EXISTS PostSaves(
    _uid INT, 
    FOREIGN KEY(_uid) REFERENCES UserAccounts(_id) ON DELETE CASCADE, 
    _pid INT, 
    FOREIGN KEY(_pid) REFERENCES Posts(_pid) ON DELETE CASCADE, 
    UNIQUE(_uid, _pid)
);
