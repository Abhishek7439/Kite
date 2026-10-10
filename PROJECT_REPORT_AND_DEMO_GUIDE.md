# 📚 DBMS Project Report & Demonstration Guide

**Course**: Database Management System (23CT1501)  
**Evaluation Component**: Teacher Assessment (TA) — 04 Marks  
**Submission Date**: October 5, 2026  
**Project Title**: **Kite — Full-Stack Social Media Platform Database Management System**

---

## 📋 1. Executive Summary & Problem Definition

### 1.1 Problem Statement
Modern social networking platforms require high-performance, relational database management systems to handle multi-relational data structures. These include user authentication records, rich user profiles, dynamic feed generation, social graph connections (followers/following), interactive content (likes and saved posts), and real-time user notifications.

**Kite** addresses this real-world problem by providing an end-to-end database-driven application with a responsive web interface (React + TypeScript), a Python Flask backend service, and a MySQL relational database enforcing strict referential integrity through foreign keys and cascade constraints.

### 1.2 Core Objectives Addressed (CO2 & CO5 Alignment)
- **CO2 (Database Modeling & Design)**: Real-world domain analysis, Entity-Relationship (E-R) diagram modeling, conversion to 3NF Relational Schema, and physical schema definition in MySQL.
- **CO5 (Application Integration & SQL Execution)**: Programmatic query construction and execution covering Data Definition Language (**DDL**) and Data Manipulation Language (**DML**) commands (`CREATE`, `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `INNER JOIN`, `LEFT JOIN`, `UNION`).

---

## 📐 2. Database Design & Architecture

### 2.1 Entity-Relationship (E-R) Model

#### Entities & Attributes:
1. **UserAccounts**
   - `_id` (PK, Integer, Auto Increment) — Unique User ID
   - `_uname` (String, Unique) — Username
   - `_email` (String, Unique) — Email Address
   - `_pass` (String) — Account Password
2. **UserProfiles**
   - `_id` (FK -> UserAccounts._id, Integer) — Associated User ID
   - `_rname` (String) — Real/Full Name
   - `_bio` (String) — User Biography
   - `_pfp` (String) — Profile Picture Path
3. **Posts**
   - `_pid` (PK, Integer, Auto Increment) — Unique Post ID
   - `_uid` (FK -> UserAccounts._id, Integer) — Creator User ID
   - `_img` (String) — Image Location Path
   - `_text` (Text) — Post Caption/Content
   - `_private` (Integer, Default 1) — Privacy Flag (0 = Public, 1 = Private)
4. **FriendsRelationship**
   - `_follower` (FK -> UserAccounts._id, Integer) — User who follows
   - `_following` (FK -> UserAccounts._id, Integer) — User being followed
   - *Composite Unique Constraint*: `(_follower, _following)`
5. **Notifications**
   - `_id` (FK -> UserAccounts._id, Integer) — Recipient User ID
   - `_date` (Date) — Notification Date
   - `_msg` (String) — Notification Message Content
   - `_read` (Boolean) — Read Status
6. **PostLikes**
   - `_uid` (FK -> UserAccounts._id, Integer) — User who liked
   - `_pid` (FK -> Posts._pid, Integer) — Liked Post ID
   - *Composite Unique Constraint*: `(_uid, _pid)`
7. **PostSaves**
   - `_uid` (FK -> UserAccounts._id, Integer) — User who saved
   - `_pid` (FK -> Posts._pid, Integer) — Saved Post ID
   - *Composite Unique Constraint*: `(_uid, _pid)`

#### Entity Relationships:
- **UserAccounts 1 : 1 UserProfiles** (Enforced via Primary-Foreign key equality & CASCADE)
- **UserAccounts 1 : N Posts** (One user can publish multiple posts)
- **UserAccounts 1 : N Notifications** (One user receives multiple notifications)
- **UserAccounts N : M UserAccounts** (Follower/Following relationships via `FriendsRelationship` junction table)
- **UserAccounts N : M Posts (Likes)** (User likes post via `PostLikes` junction table)
- **UserAccounts N : M Posts (Saves)** (User saves post via `PostSaves` junction table)

---

### 2.2 Relational Schema (3rd Normal Form - 3NF)

```
UserAccounts( _id [PK], _uname [UNIQUE], _email [UNIQUE], _pass )
UserProfiles( _id [FK -> UserAccounts._id], _rname, _bio, _pfp )
Posts( _pid [PK], _uid [FK -> UserAccounts._id], _img, _text, _private )
FriendsRelationship( _follower [FK -> UserAccounts._id], _following [FK -> UserAccounts._id] )
Notifications( _id [FK -> UserAccounts._id], _date, _msg, _read )
PostLikes( _uid [FK -> UserAccounts._id], _pid [FK -> Posts._pid] )
PostSaves( _uid [FK -> UserAccounts._id], _pid [FK -> Posts._pid] )
```

---

## 💾 3. Physical Database View & Implementation

### 3.1 Physical Engine Details
- **DBMS Engine**: MySQL 8.4 Server
- **Storage Engine**: InnoDB (Supports ACID Transactions, Foreign Key Constraints, Row-Level Locking)
- **Character Set**: `utf8mb4` / `latin1`
- **Host**: `localhost:3306`
- **Database Name**: `Kite`

---

## 💻 4. Programmatic Query Generation & Execution

All SQL operations are programmatically constructed and executed in `server/database.py` using Python's `mysql.connector`.

### 4.1 Data Definition Language (DDL) Commands

#### Database & Tables Creation (`server/setup_db.sql`):
```sql
CREATE DATABASE IF NOT EXISTS Kite;
USE Kite;

CREATE TABLE IF NOT EXISTS UserAccounts(
    _id INT AUTO_INCREMENT PRIMARY KEY, 
    _uname CHAR(255) UNIQUE, 
    _email CHAR(255) UNIQUE, 
    _pass CHAR(255)
);

CREATE TABLE IF NOT EXISTS UserProfiles(
    _id INT, 
    FOREIGN KEY(_id) REFERENCES UserAccounts(_id) ON DELETE CASCADE, 
    _rname CHAR(255), 
    _bio CHAR(255), 
    _pfp CHAR(255)
);

CREATE TABLE IF NOT EXISTS FriendsRelationship(
    _follower INT, 
    _following INT, 
    UNIQUE(_follower, _following), 
    FOREIGN KEY(_follower) REFERENCES UserAccounts(_id), 
    FOREIGN KEY(_following) REFERENCES UserAccounts(_id)
);

CREATE TABLE IF NOT EXISTS Notifications(
    _id INT, 
    FOREIGN KEY(_id) REFERENCES UserAccounts(_id), 
    _date DATE, 
    _msg CHAR(255), 
    _read BOOL
);

CREATE TABLE IF NOT EXISTS Posts(
    _pid INT PRIMARY KEY AUTO_INCREMENT, 
    _uid INT, 
    FOREIGN KEY(_uid) REFERENCES UserAccounts(_id), 
    _img CHAR(255), 
    _text TEXT, 
    _private INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS PostLikes(
    _uid INT, 
    FOREIGN KEY(_uid) REFERENCES UserAccounts(_id) ON DELETE CASCADE, 
    _pid INT, 
    FOREIGN KEY(_pid) REFERENCES Posts(_pid) ON DELETE CASCADE, 
    UNIQUE(_uid, _pid)
);

CREATE TABLE IF NOT EXISTS PostSaves(
    _uid INT, 
    FOREIGN KEY(_uid) REFERENCES UserAccounts(_id) ON DELETE CASCADE, 
    _pid INT, 
    FOREIGN KEY(_pid) REFERENCES Posts(_pid) ON DELETE CASCADE, 
    UNIQUE(_uid, _pid)
);
```

---

### 4.2 Data Manipulation Language (DML) Commands in Code

#### 1. User Account Creation (`INSERT INTO`):
```python
# database.py -> CreateUser()
self.cursor.execute(f""" 
    INSERT INTO UserAccounts(_uname, _pass, _email) VALUE (
        "{data['_uname']}", "{data['_pass']}", "{data['_email']}"
    )
""")
self.connection.commit()
```

#### 2. User Profile Fetching (`SELECT` with `INNER JOIN` & Aggregations):
```python
# database.py -> GetProfile()
self.cursor.execute(f"""
    SELECT AC._uname, UP._rname, UP._bio, UP._pfp, AC._email FROM UserProfiles as UP 
    INNER JOIN UserAccounts as AC ON AC._id = UP._id WHERE AC._id = {data['_id']} AND AC._pass = "{data['_pass']}"
""")
```

#### 3. Home Feed Generation (`SELECT` with `UNION`, `INNER JOIN`, `LEFT JOIN`, `ORDER BY RAND()`, `LIMIT`):
```python
# database.py -> GetHomePosts()
self.cursor.execute(f"""
    SELECT x.*, PostLikes._uid = {data['_id']} as liked, PostSaves._uid = {data['_id']} as saved FROM (
        SELECT Posts.*, UserAccounts._uname, UserProfiles._pfp from Posts
        INNER JOIN FriendsRelationship ON FriendsRelationship._following = Posts._uid
        INNER JOIN UserAccounts ON UserAccounts._id = Posts._uid
        INNER JOIN UserProfiles ON UserProfiles._id = Posts._uid
        WHERE FriendsRelationship._follower = {data['_id']}
        UNION
        SELECT Posts.*, UserAccounts._uname, UserProfiles._pfp from Posts
        INNER JOIN UserAccounts ON UserAccounts._id = Posts._uid
        INNER JOIN UserProfiles ON UserProfiles._id = Posts._uid
        WHERE _private = 0
    ) x
    LEFT JOIN PostLikes ON PostLikes._pid = x._pid
    LEFT JOIN PostSaves ON PostSaves._pid = x._pid
    ORDER BY RAND()
    LIMIT 0,10;
""")
```

#### 4. Updating Profile Details (`UPDATE`):
```python
# database.py -> UpdateProfile()
self.cursor.execute(f"""
    UPDATE UserProfiles SET _rname = "{data['_rname']}", _bio = "{data['_bio']}", _pfp = "{data['_pfp']}" WHERE _id = {data['_id']}
""")
self.cursor.execute(f"""
    UPDATE UserAccounts SET _uname = "{data['_uname']}", _email = "{data['_email']}", _pass = "{data['_repass']}" WHERE _id = {data['_id']};
""")
self.connection.commit()
```

#### 5. Deleting Posts (`DELETE`):
```python
# database.py -> DeletePost()
self.cursor.execute(f"""
    DELETE FROM Posts WHERE _pid = {data['_pid']};
""")
self.connection.commit()
```

#### 6. Live Search Query (`SELECT` with `LIKE` wildcard search):
```python
# database.py -> Search()
self.cursor.execute(f"""
    SELECT AC._uname, UP._rname, UP._pfp FROM UserProfiles as UP
    INNER JOIN UserAccounts as AC ON AC._id = UP._id
    WHERE AC._uname LIKE "%{data['_name']}%" OR UP._rname LIKE "%{data['_name']}%"
""")
```

---

## 🎬 5. Step-by-Step Demonstration Guide (For Evaluator/Teacher Presentation)

When presenting to **Prof. Sharayu Kawale**, follow this exact demo structure:

### Step 1: System Overview (30 seconds)
> *"Respected Ma'am, our project is 'Kite', a database-driven social media application. We designed an E-R model with 7 relational tables, implemented 3NF schema, and built a full-stack system with React on the frontend, Python Flask REST API in the middle layer, and MySQL Database on the backend."*

### Step 2: Show Live Running System (1 minute)
1. Open browser to **`http://localhost:5173`**.
2. **Sign Up Demo**: Click *Sign up*, enter a new username, email, and password. Show how `CreateUser()` generates `INSERT INTO UserAccounts` and `INSERT INTO UserProfiles`.
3. **Create Post Demo**: Click *Create*, type a public post text, click *Save*. Show how `CreatePost()` runs `INSERT INTO Posts`.
4. **Home Feed Demo**: Show how `GetHomePosts()` executes a complex `UNION` query joining `Posts`, `UserAccounts`, `UserProfiles`, and `FriendsRelationship`.
5. **Profile & Edit Demo**: Navigate to Profile, click *Edit Profile*, change bio/real name. Show the `UPDATE` query execution.
6. **Search Demo**: Click *Search*, type a keyword. Show `LIKE "%keyword%"` query in action.

### Step 3: Show Code & Database Verification (1 minute)
1. Open MySQL CLI or workbench and show the database:
   ```sql
   USE Kite;
   SHOW TABLES;
   SELECT * FROM UserAccounts;
   SELECT * FROM Posts;
   ```
2. Open [`database.py`](file:///d:/Projects/DBMS%20Project/Kite/server/database.py) and show the Python method signatures executing DDL/DML queries programmatically.

---

## 🎯 6. Viva Questions & Expected Answers

| # | Question | Ideal Answer |
|---|---|---|
| 1 | **What storage engine is used in MySQL and why?** | We use the **InnoDB** storage engine because it supports ACID compliance, foreign key constraints (`ON DELETE CASCADE`), and row-level locking for multi-table relationships. |
| 2 | **How is referential integrity maintained when a user is deleted?** | Foreign keys in child tables (`UserProfiles`, `PostLikes`, `PostSaves`) use `ON DELETE CASCADE`. If a record in `UserAccounts` is deleted, all dependent rows are automatically deleted by the RDBMS. |
| 3 | **Explain the query used for generating the Home Feed.** | It uses a `UNION` of posts from users you follow (`FriendsRelationship`) and public posts (`_private = 0`), joined with `PostLikes` and `PostSaves` via `LEFT JOIN` to attach liked/saved boolean status. |
| 4 | **How are duplicate follow requests or likes prevented?** | We enforced `UNIQUE(_follower, _following)` constraint in `FriendsRelationship` and `UNIQUE(_uid, _pid)` constraint in `PostLikes` and `PostSaves`. |

---

## 📁 7. Deliverables & Project Files Summary

- **Source Code**: `server/server.py`, `server/database.py`, `src/App.tsx`, `src/pages/*`
- **Database Script**: [`server/setup_db.sql`](file:///d:/Projects/DBMS%20Project/Kite/server/setup_db.sql)
- **Screenshots Directory**: [`project_screenshots/`](file:///d:/Projects/DBMS%20Project/Kite/project_screenshots)
- **Full Report File**: [`PROJECT_REPORT_AND_DEMO_GUIDE.md`](file:///d:/Projects/DBMS%20Project/Kite/PROJECT_REPORT_AND_DEMO_GUIDE.md)
