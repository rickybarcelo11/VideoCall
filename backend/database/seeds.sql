CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_by INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    room_id INT REFERENCES rooms(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM rooms;
SELECT * FROM participants;

INSERT INTO users (name, email, password) 
VALUES ('Juan Pérez', 'juan@example.com', '123456');

INSERT INTO rooms (name, created_by) 
VALUES ('Reunión de Oración', 1);

INSERT INTO participants (user_id, room_id) 
VALUES (1, 1);

SELECT * FROM users;
SELECT * FROM rooms;
SELECT * FROM participants;
