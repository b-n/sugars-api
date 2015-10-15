const updateableFields = [ 'name', 'units', 'carbs', 'defaultAmount' ];

export function queryRecord(foodId, userId, db) {
    return db.User.find({
        include: [ { model: db.Food, as: 'Foods', where: { id: foodId } } ],
        where: { firstName: 'Bex', lastName: 'Hill' }
        //where: { id: userId }
    }).then(user => {
        if (user === null) throw new Error(`could not find food with id: ${foodId}`);
        return user;
    });
}

export function queryAll(userId, db) {
    return db.User.find({
        include: [ { model: db.Food, as: 'Foods' } ],
        where: { firstName: 'Bex', lastName: 'Hill' }
        //where: { id: userId }
    });
}

export function createRecords(foods, userId, db, dbTransaction = null) {
    return db.User.find({
        where: { firstName: 'Bex', lastName: 'Hill' }
        //where: { id: userId }
    }).then(user => {
        //set up the transaction
        return db.db.transaction((t) => {
            let createdFood = [];
            //break the foods into elements, and create transactions for each
            return foods.reduce((foodPromises, food) => {
                //each food, append to foods promise chain
                return foodPromises.then(() => {
                    //create item and parent to user
                    return db.Food.create(
                        food,
                        { transaction : dbTransaction || t }
                    ).then(food => {
                        return user.addFood(
                            food,
                            { transaction : t }
                        ).then(user => {
                            createdFood.push(food); return createdFood;
                        });
                    });
                });
            }, Promise.resolve());
        }); 
    });
}

export function dropRecord(foodId, userId, db) {
    return db.User.find({
        include: [ { model: db.Food, as: 'Foods', where: { id: foodId } } ],
        where: { firstName: 'Bex', lastName: 'Hill' }
        //where: { id: userId }
    }).then(user => {
        if (user === null) throw new Error(`could not find food with id: ${foodId}`);
        
        //found record, return the first 
        return user.Foods[0].destroy();
    });
}

export function updateRecord(foodId, food, userId, db) {
    return db.User.find({
        include: [ { model: db.Food, as: 'Foods', where: { id: foodId } } ],
        where: { firstName: 'Bex', lastName: 'Hill' }
        //where: { id: userId }
    }).then(user => {
        if (user === null) throw new Error(`could not find food with id: ${foodId}`);
        
        //found record, return the first
        let foodItem = user.Foods[0];
        updateableFields.forEach(item => {
            if (food[item] !== undefined) foodItem.set(item, food[item]);
        });
        
        return foodItem.save();
    });
}

