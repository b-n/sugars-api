

export default function(db, DataTypes) {
    let user = db.define('user', {
        uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, primaryKey: true },   
        firstName: DataTypes.STRING(255),         
        lastName: DataTypes.STRING(255),
        authLoginType: DataTypes.STRING(32),
        dailyLongActingUnits: DataTypes.DECIMAL(8, 3),
        unitType: DataTypes.STRING(32),
        glLow: DataTypes.DECIMAL(8,3),          //low range on Glucose Level (in unitType)
        glHigh: DataTypes.DECIMAL(8,3),         //high range of Glucose Level (in unitType)
        carbsPerUnit: DataTypes.DECIMAL(8,3),  
        godMode: DataTypes.BOOLEAN,

        //Auth implementations for later use
        authEmail: DataTypes.STRING(255),
        authFacebook: DataTypes.STRING(255),
        authGoogle: DataTypes.STRING(255),
        authOAuth: DataTypes.STRING(255)
    });
    
    return user;
} 
