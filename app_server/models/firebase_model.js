var admin = require("firebase-admin");

// Fetch the service account key JSON file contents
var serviceAccount = require("./SafeDisk-a9b94def562f.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://safedisk-2fc9b.firebaseio.com/"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();

module.exports = {

    /**
     * target default
     */

    // 讀取指定資料
    read_targetData: function (dbRef, target_key, target_name, callback) {
        let ref = db.ref(dbRef);
        let target_list = {};
        let target_data = {};
        let resData = {};

        ref.orderByChild(target_key)
            .equalTo(target_name)
            .once("value")
            .then(function (snapshot) {

                if (snapshot.exists()) {

                    snapshot.forEach(function (childSnapshot) {

                        target_list[childSnapshot.key] = childSnapshot.val();

                    });

                } else {
                    throw new Error(" cant find any data !");
                }

            }).then(function () {
                resData.status = true;
                // console.log("[Success] => [Model][read_targetData] msg => " + dbRef + "/" + target_key + "/" + target_name + " : ");
                // console.log("data => %j", target_list);
                callback(resData, target_list);
            })
            .catch(function (error) {
                resData.status = false;
                resData.error = "" + error;
                console.error("[Error] => [Model][read_targetData] error => " + error);
                callback(resData, target_data);
            });
    },
    // 編輯指定資料
    editor_targetData: function (dbRef, target_key, target_name, target_data, callback) {
        let ref = db.ref(dbRef);
        let resData = {};

        ref.orderByChild(target_key)
            .equalTo(target_name)
            .once("value")
            .then(function (snapshot) {

                if (snapshot.exists()) {
                    snapshot.forEach(function (childSnapshot) {
                        ref.child(childSnapshot.key).update(target_data);
                    });
                } else {
                    throw new Error(" data : " + target_name + " not found !");
                }

            })
            .then(function () {
                console.log("[Success] => [Model][editor_targetData] msg => " + dbRef + "/" + target_key + "/" + target_name + " : ");
                console.log("data => %j", target_data);
                resData.status = true;
                callback(resData);
            })
            .catch(function (error) {
                console.error("[Error] => [Model][editor_targetData] error => " + error);
                resData.status = false;
                resData.error = error;
                callback(resData);
            });
    },
    // 刪除指定資料
    delete_targetData: function (dbRef, target_data, callback) {

    },
    // 新增指定資料
    new_data: function (dbRef, target_data, callback) {
        let resdata = {};

        db.ref(dbRef).update(target_data).then(function () {
            console.log("[Success] => [Model][new_data] msg => " + dbRef + " : ");
            console.log("data => %j", target_data);
            resdata.status = true;
            callback(resdata);
        }).catch(function (error) {
            console.error("[Error] => [Model][new_data] error => " + error);
            resdata.status = false;
            resdata.error = "" + error;
            callback(resdata);
        });
    },

    /**
     * manger default
     */

    // 讀取所有資料
    read_allData: function (dbRef, callback) {

        let ref = db.ref(dbRef);
        let resData = {};
        let target_data = {};
        let showData = "";

        ref.once("value").then(function (snapshot) {

                if (snapshot.exists()) {
                    target_data = snapshot.val();
                } else {
                    throw new Error(" cant find any USB !");
                }

            })
            .then(function () {
                console.log("[Success] => [Model][read_allData] msg => " + dbRef + " : ");
                console.log("data => %j", target_data);
                resData.status = true;
                callback(resData, target_data);
            })
            .catch(function (error) {
                console.error("[Error] => [Model][read_allData] error => " + error);
                resData.status = false;
                resData.error = "" + error;
                callback(resData, target_data);
            });
    },
    // 賭取資料總數
    read_allcount: function (dbRef, callback) {

        let ref = db.ref(dbRef);
        let resData = {};
        let target_data = {};
        let dataCount = 0;

        ref.once("value").then(function (snapshot) {

                if (snapshot.exists()) {

                    snapshot.forEach(function (childSnapshot) {
                        ++dataCount;
                    });

                } else {
                    throw new Error(" cant find any data !");
                }

            })
            .then(function () {
                console.log("[Success] => [Model][read_allcount] msg => " + dbRef + " : ");
                console.log("data => %j", dataCount);
                resData.status = true;
                target_data.count = dataCount;
                callback(resData, target_data);
            })
            .catch(function (error) {
                console.error("[Error] => [Model][read_allcount] error => " + error);
                resData.status = false;
                resData.error = "" + error;
                callback(resData, target_data);
            });
    },
}