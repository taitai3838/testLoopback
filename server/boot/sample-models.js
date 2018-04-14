// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0
module.exports = function(app) {
  var User = app.models.user;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  var Team = app.models.Team;

  var generator = require("generate-password");

  var password1 = generator.generate({
    length: 10,
    numbers: true
  });

  var password2 = generator.generate({
    length: 10,
    numbers: true
  });

  console.log(password1);
  console.log(password2);
  User.create(
    [
      { username: "John", email: "john@doe.com", password: password1 },
      { username: "Jane", email: "jane@doe.com", password: password2 }
    ],
    function(err, users) {
      if (err) throw err;
      console.log("Created users:", users);
      // create project 1 and make john the owner
      users[0].projects.create(
        {
          name: "project1",
          balance: 100
        },
        function(err, project) {
          if (err) throw err;

          console.log("Created project:", project);

          // add team members
          Team.create(
            [
              { ownerId: project.ownerId, memberId: users[0].id },
              { ownerId: project.ownerId, memberId: users[1].id }
            ],
            function(err, team) {
              if (err) throw err;

              console.log("Created team:", team);
            }
          );
        }
      );

      //create the admin role
      Role.create(
        {
          name: "admin"
        },
        function(err, role) {
          if (err) throw err;

          console.log("Created role:", role);

          //make jane an admin
          role.principals.create(
            {
              principalType: RoleMapping.USER,
              principalId: users[1].id
            },
            function(err, principal) {
              if (err) throw err;

              console.log("Created principal:", principal);
            }
          );
        }
      );
    }
  );
};
