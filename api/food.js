//food end point handler

import * as db from 'api/db';

export class Food {

  constructor() {
    this.db = new db.DB();
  }

  getList(request) {
    return new Promise((resolve,reject) => {
      //call the database init.
      this.db.init().then((result) => {
        //success, lets query the request
        return this.db.User.find({
          include: [ { model: this.db.Food, as: 'Foods' } ], 
          where: { firstName: 'Bex', lastName: 'Hill' }
        });
      }).then(function(user) {
        return resolve(user.Foods);
      }).catch(function(err) {
        return reject(err);
      });
    });
  }

  addEntry(request) {
    return new Promise((resolve, reject) => {
      this.db.init().then((result) => {
        return this.db.User.find({
          where: { firstName: 'Bex', lastName: 'Hill' }
        });
      }).then((user) => {
        //reduce the request body, and resolve each promise request in order;
        console.log(request.body);
        return this.db.sequelize.transaction((t) => {
          return request.body.reduce((foods, food) => {
            //add next food item (food) into the promise list (foods)
            return foods.then(() => {
              //create food item, and when complete, link to user
              return this.db.Food.create(
                food,
                { transaction : t }
              ).then((food) => {
                return user.addFood(
                  food,
                  { transaction : t }
                );
              });
            });
          }, Promise.resolve());
        });
      }).then((result) => {
        resolve({status: "success"});   
      }).catch((err) => {
        reject(err);
      });
    });
  }

  modEntry(request) {
    return new Promise((resolve, reject) => {
      this.db.init().then((result) => {
        this.db.User.find({
          where: {
            firstName: 'Bex',
            lastName: 'Hill'
          }
        }).then((user) => {
          console.log(request.params);
          this.db.Food.find({
            where: {
              id: request.query.id
            }
          }).then((food) => {
            if (food.userUuid != user.uuid) {
              reject('Food with ID ' + request.query.id + ' does not exist under this user');
            } else {
              if (request.body.name !== undefined) food.set('name', request.body.name);
              if (request.body.unit !== undefined) food.set('unit', request.body.unit);
              if (request.body.carbs !== undefined) food.set('carbs', request.body.carbs);
              if (request.body.defaultAmount !== undefined) food.set('defaultAmount', request.body.defaultAmount);
              food.save().then(resolve, reject);
            }
          },reject);
        }, reject);
      }, reject);
    });
  }

}

export function handle(request) {
  return new Promise((resolve, reject) => {
    console.log('Food Handler: Request recieved');
    var food = new Food();

    if (request.params.mod === undefined) {
      return resolve(food.getList(request));
    }

    if (request.params.mod === 'add') {
      return resolve(food.addEntry(request));
    }

    if (request.params.mod === 'edit') {
      if (request.query.id === undefined) {
        throw new Error('No value defined under the id parameter');
      }
      return resolve(food.modEntry(request));
    }

    throw new Error('Invalid api call: /api/food/' + request.params.mod);
  }).catch(function (err) {
    console.log('ERROR: ' + err);
    reject(err);
  });
}
