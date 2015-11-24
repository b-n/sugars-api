const updateableFields = [ 'name', 'units', 'carbs', 'defaultAmount' ];

export function queryRecords(foodIds, userId, db) {
    return db.User.find({
        include: [ { model: db.Food, as: 'Foods', where: { id: { $in : foodIds } } } ],
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
    let createdFood = new Set();
    return db.User.find({
        where: { firstName: 'Bex', lastName: 'Hill' }
        //where: { id: userId }
    }).then(user => {
        //set up the transaction
        return db.db.transaction((t) => {
            //break the foods into elements, and create transactions for each
            return foods.reduce((foodPromises, food) => {
                //each food, append to foods promise chain
                return foodPromises.then(() => {
                    //create item and parent to user
                    return db.Food.create(
                        food,
                        { transaction : dbTransaction || t }
                    ).then(food => {
                        console.log('here');
                        createdFood.add(food.id);
                        console.log('here too');
                        return user.addFood(
                            food,
                            { transaction : t }
                        );
                    });
                });
            }, Promise.resolve());
        }); 
    }).then(() => {
        return queryRecords(Array.from(createdFood), userId, db);
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

