# Final PC2

Basic web service based in **two containers**, made using **Node.js**, **Express.js** framework and **PostgreSQL** for the database.


## How to use it in PlayWithDocker

First you need to clone this repo to any directory you want using the following command:
```sh
 git clone https://github.com/Pantosta0/FinalPC2.git
 ```
Then you need to get into the `FinalPC2` folder and execute the following command:
```sh
docker-compose up
```
You also need to open the port 5000, and the web service should be up and running in `http://localhost:5000/`
I **strongly** suggest you to use the [**JSON Viewer**](https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh?hl=es) extension to have a better experience navigating this web service.

##  Testing the web service
In case you don't have [**JSON Viewer**](https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh?hl=es) here are the curl commands to test it:

`- curl http://localhost:5000/checkConnection` Checks the connection with the database. It will return ok if its connected or nok if it can't connect to the database.

`- curl http://localhost:5000/hash/:id` Creates a new hash based in the `:id` introduced.

`- curl http://localhost:5000/validate/:id?hash=:hash` Validates if the `:hash` introduced is assigned to the `:id` introduced.

`- curl http://localhost:5000/stable` Shows the S table.

`- curl http://localhost:5000/atable` Shows the A table.

`- curl http://localhost:5000/delete` Deletes all the content in both tables.
