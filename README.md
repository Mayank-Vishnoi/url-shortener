# url-shortener
This is a personal project.
Using counters and base 62 encoding to generate unique id everytime of a strict length 6.
Allowing users to enter custom URL' but with length >= 7 as the whole point of using counter is to avoid collisions.
In race conditions, have to apply some restrictions. The service now is pretty fast though.
Also when there are multiple servers, we could reserve counter ranges for each and even manage efficiently using a zookeeper.
User Analytics are also tracked, such as the time of creation of the link and number of clicks on it and all the links generated by a particular user.
Having a login authentication module is a pre-requistite for the same.