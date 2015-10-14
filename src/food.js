const updateableFields = [ 'name', 'units', 'carbs', 'defaultAmount' ];

export function queryRecord(req, db) {
    return new Promise((resolve, reject) => {
        let id = req.params.id;
        db.User.find({
            include: [ { model: db.Food, as: 'Foods', where: { id: id } } ],
            where: { firstName: 'Bex', lastName: 'Hill' }
        }).then((user) => {
            if (user === null) throw new Error(`could not find food with id: ${id}`);
            
            //found record, return the first 
            resolve(user.Foods[0]);
        }).catch((err) => {
            reject(err);
        })
    });
}

export function queryAll(req, db) {
    return new Promise((resolve, reject) => {
        db.User.find({
            include: [ { model: db.Food, as: 'Foods' } ],
            where: { firstName: 'Bex', lastName: 'Hill' }
        }).then((user) => {
            resolve(user.Foods);
        }).catch((err) => {
            reject(err);
        })
    });
}

export function createRecords(req, db) {
    return new Promise((resolve, reject) => {
        db.User.find({
            where: { firstName: 'Bex', lastName: 'Hill' }
        }).then((user) => {
            //set up the transaction
            return db.db.transaction((t) => {
                //break the body into elements, and create transactions for each
                return req.body.reduce((foods, food) => {
                    //each food, append to foods promise chain
                    return foods.then(() => {
                        //create item and parent to user
                        return db.Food.create(
                            food,
                            { transaction : t }
                        ).then((food) => {
                            return user.addFood( food, { transaction : t });
                        });
                    });
                }, Promise.resolve());
            }); 
        }).then(() => {
            resolve({ status: 'success'});
        });
    }); 
}


//TODO validate user before drop
export function dropRecord(req, db) {
    return new Promise((resolve, reject) => {
        let id = req.params.id;
        db.Food.find({
            where: { id: id }
        }).then((food) => {
            if (food === null) throw new Error(`could not find record with id: ${id}`);

            return food.destroy(); 
        }).then(() => {
            resolve({ status: 'success'});
        }).catch((err) => {
            reject(err);
        });
    });
}

//TODO validate user before update
export function updateRecord(req, db) {
    return new Promise((resolve, reject) => {
        let id = req.params.id;
        
        db.Food.find({
            where: { id: id }
        }).then((food) => {
            if (food === null) throw new Error(`could not find record with id: ${id}`);
            
            updateableFields.forEach((item) => {
                if (req.body[item] !== undefined) food.set(item, req.body[item]);
            });
            
            return food.save();
        }).then((food) => {
            resolve({ status: 'success', record: food })
        }).catch((err) => {
            reject(err);
        });
    });
}

