

export function queryAll(req, db) {
    return new Promise((resolve, reject) => {
        db.User.find({
            include: [ { model: db.Entry, as: 'Entries', include: [ { model: db.Food, as: 'Foods' } ] } ],
            where: { firstName: 'Bex', lastName: 'Hill' }
        }).then((user) => {
            let entries = [];
            
            user.Entries.forEach((entry) => {
                entries.push({
                
                });
            });
            resolve(user.Foods);
        }).catch((err) => {
            reject(err);
        })
    });
}

