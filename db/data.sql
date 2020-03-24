INSERT INTO "users"
    ("email", "username", "password", "first_name", "last_name", "gender", "postal_code", "city", "country", "profile_picture_url", "birth_date", "about")
VALUES
    ('ildana@gmail.com', 'ruzybayeva', '123qwe213kh', 'ildana', 'ruzybayeva', 'female', '075236', 'Malmo', 'Sweden', 'https://pbs.twimg.com/profile_images/1158430026175602688/n2wj26Tz_400x400.jpg', '1995-11-14', 'web developer'),
    ('emma@gmail.com', 'emmabb', '123qwe213kh', 'Emma', 'Boberg', 'female', '05236', 'Malmo', 'Sweden', 'https://static-cdn.sr.se/sida/images/96/6dc3600c-8979-4928-8009-fc12d3fd7b48.jpg', '1994-10-20', 'researcher')


INSERT INTO "posts"
    ("user_id", "caption", "location")
VALUES
    (1, 'i have pasta', 1);


INSERT INTO "comments"
    ("post_id", "user_id", "content")
VALUES
    (1, 2, 'i can take it');


INSERT INTO "messages"
    ("user_id_from", "user_id_to", "content")
VALUES
    (1, 2, 'hello take my pasta'),
    (2, 1, 'ok i will come by tonight');



