
import * as food from './food'

const foodItemFields = [ 'name', 'carbs', 'foodId', 'quantity', 'unit' ];
const entryFields = [ 'entryDate', 'glucoseLevel', 'exerciseCarbs', 'insulinShort'];
   
export function queryAll(userId, db) {
    return db.User.find({
        include: [ { model: db.Entry, as: 'Entries', include: [ { model: db.Food, as: 'Foods' } ] } ],
        where: { firstName: 'Bex', lastName: 'Hill' }
        //where: { id: userId }
    }).then((user) => {
        let entries = [];
        
        user.Entries.forEach(entry => {
            let newEntry = { foodItems: [] };
            entryFields.forEach(field => newEntry[field] = entry[field]);
            entry.Foods.forEach(food => {
                let newFoodItem = {};
                foodItemFields.forEach(field => newFoodItem[field] = food[field]);
                newEntry.foodItems.push(newFoodItem);
            });
            entries.push(newEntry);
        });
        return entries;
    });
}

export function create(entry, userId, db) {
    return food.queryAll(userId, db).then(userFoods => {
        return db.db.transaction(t => {
            //create userFood id map
            let userFoodMap = new Map();
            userFoods.Foods.forEach(food => {
                userFoodMap.set(food.id, food);
            });
            
            //do a bunch of validation
            entry.foodItems.forEach(food => {
                //make sure all food items with id's exist against this user
                if (food.id && !userFoodMap.has(food.id)) throw new Error(`food does not exist with id: ${food.id}`);
                //all passed items need to hand in quantity and carbs    
                if (!food.id || !food.carbs || !food.quantity) throw new Error(`food must have an id, quantity and carbs`);
            });
            
            let createdEntry = null;            

            return db.Entry.create({
                entryDate: new Date(entry.entryDate),
                glucoseLevel: entry.glucoseLevel,
                exerciseCarbs: entry.exerciseCarbs,
                insulinShort: entry.insulinShort 
            }, { transaction: t }).then(newEntry => {
                createdEntry = newEntry;
                return userFoods.addEntry(newEntry, { transaction: t });
            }).then(() => {
                return Promise.all(
                    entry.foodItems.reduce((items, item) => {
                        return items.concat(createdEntry.addFood(
                            userFoodMap.get(item.id),
                            { quantity: item.quantity, carbs: item.carbs},
                            { transaction: t }
                        ));
                    }, [] )
                );
            });
        });                       
    });
}

