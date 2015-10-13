
export default function(db, DataTypes) {
    let food = db.define('food', {
        name: DataTypes.STRING(255),          //Name        e.g. Pizza
        unit: DataTypes.STRING(255),          //Unit type,    e.g. Slice
        carbs: DataTypes.INTEGER,             //Carbs per unit  e.g. 30
        defaultAmount: DataTypes.INTEGER        //Default       e.g. 1 (as in one slice)
    });
    return food;
}
