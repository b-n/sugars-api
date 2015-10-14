const foodItemFields = [ 'name', 'carbs', 'foodId', 'quantity', 'unit' ];
const entryFields = [ 'entryDate', 'glucoseLevel', 'exerciseCarbs', 'insulinShort'];
   
export function queryAll(req, db) {
    return new Promise((resolve, reject) => {
        db.User.find({
            include: [ { model: db.Entry, as: 'Entries', include: [ { model: db.Food, as: 'Foods' } ] } ],
            where: { firstName: 'Bex', lastName: 'Hill' }
        }).then((user) => {
            let entries = [];
            
            user.Entries.forEach(entry => {
                let newEntry = { foodItems: [] };
                entryFields.forEach(field => newEntry[field] = entry[field]);
                entry.Foods.forEach(food => {
                    let newFoodItem = {};
                    foodItemFields.forEach(foodItem => newFoodItem[foodItem] = food[foodItem]);
                    newEntry.foodItems.push(newFoodItem);
                });
            });
            resolve(entries);
        }).catch((err) => {
            reject(err);
        })
    });
}

export function create(req, db) {


}

