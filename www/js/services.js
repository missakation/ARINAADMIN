
angular.module('football.services', [])
    .factory('AdminStore', function () {
        var Availables = [];
        var SchedulesByDay = [];
        var MyStadiums = [];
        var MyMiniStadiums = [];
        var MyBalances = [];
        var Customers = [];
        var MyPromotions = [];
        var MyCustomers = [];

        var customerinfo = {};

        return {
            GetMyStadiums: function (callback) {
                MyStadiums = [];

                var user = firebase.auth().currentUser;

                var id = user.uid;
                //alert(id);
                firebase.database().ref('/admins/' + id + '/stadiums').once('value', function (snapshot) {

                    // alert("test");
                    snapshot.forEach(function (mainstadiumSnapshot) {
                        //alert(mainstadiumSnapshot.child("name").val());
                        var Data = {
                            "key": mainstadiumSnapshot.key,
                            "name": mainstadiumSnapshot.key,
                            "photo": mainstadiumSnapshot.child("photo").val()

                        };
                        MyStadiums.push(Data);

                    });

                    callback(MyStadiums);
                }, function (error) {
                    alert(error.message);
                });

                //alert(Availables.length());
                return Availables;
            },

            GetMyMiniStadiums: function (stadiumid, callback) {


                var user = firebase.auth().currentUser;

                var id = user.uid;
                //alert(id);
                firebase.database().ref('/stadiums/' + stadiumid + '/ministadiums').once('value', function (snapshot) {
                    MyMiniStadiums = [];
                    // alert("test");
                    snapshot.forEach(function (mainstadiumSnapshot) {
                        //alert(mainstadiumSnapshot.child("name").val());
                        var Data = {
                            "key": mainstadiumSnapshot.key,
                            "name": mainstadiumSnapshot.key,
                            "name2": mainstadiumSnapshot.child("description").val(),
                            "photo": mainstadiumSnapshot.child("photo").val(),
                            "endhour": mainstadiumSnapshot.child("endhour").val(),
                            "endminute": mainstadiumSnapshot.child("endminute").val(),
                            "price": mainstadiumSnapshot.child("price").val(),
                            "starthour": mainstadiumSnapshot.child("starthour").val(),
                            "rating": mainstadiumSnapshot.child("rating").val(),
                            "startminute": mainstadiumSnapshot.child("startminute").val(),
                            "type": mainstadiumSnapshot.child("type").val(),
                            "rating": 1,
                            //"freetimes": freetimes,
                            "SortPoints": 0,
                            "latitude": snapshot.child("cordovalatitude").val(),
                            "longitude": snapshot.child("cordovalongitude").val(),
                            "iscombined": mainstadiumSnapshot.child("iscombined").val(),
                            "combined": mainstadiumSnapshot.child("combined").val(),
                            "city": snapshot.child("city").val(),
                            "telephone": snapshot.child("telephone").val()

                        };
                        MyMiniStadiums.push(Data);

                    });

                    callback(MyMiniStadiums);
                }, function (error) {
                    alert(error.message);
                });

                //alert(Availables.length());
                return Availables;
            },
            GetMyStadiumsByDay: function (search, callback) {


                //alert(search.date.getMonth());
                //alert("TEST");
                SchedulesByDay = [];
                var user = firebase.auth().currentUser;


                var id = user.uid;

                //alert(id);

                var year = search.date.getFullYear();
                var month = search.date.getMonth();
                var day = search.date.getDate();

                firebase.database().ref('/stadiums').orderByChild("admin").equalTo(id).on('value', function (snapshot) {
                    SchedulesByDay = [];
                    snapshot.forEach(function (ministadiums) {
                        //var mininame = ministadiums.child("name").val();
                        ministadiums.child("ministadiums").forEach(function (miniministadiums) {


                            if (miniministadiums.child('schedules/' + year + '/' + month + '/' + day).exists()) {
                                miniministadiums.child('schedules/' + year + '/' + month + '/' + day).forEach(function (minischedule) {

                                    var color = "white";
                                    if (minischedule.child('bookedadmin').exists()) {
                                        if (minischedule.child('bookedadmin').val()) {
                                            var color = "lightgray";
                                        }
                                    }
                                    if (minischedule.child('maindata').val()) {
                                        var startdate = minischedule.child("fullstartdate").val();

                                        var startdate = new Date();


                                        startdate.setMinutes(minischedule.child('minute').val());
                                        startdate.setFullYear(year);
                                        startdate.setMonth(month);
                                        startdate.setHours(minischedule.child('hour').val());
                                        startdate.setDate(minischedule.child('day').val());

                                        var enddate = new Date();

                                        enddate.setMinutes(minischedule.child('minute').val());
                                        enddate.setFullYear(year);
                                        enddate.setMonth(month);
                                        enddate.setHours(minischedule.child('hour').val());
                                        enddate.setDate(minischedule.child('day').val());

                                        enddate.setMinutes(enddate.getMinutes() + minischedule.child('duration').val() * 1)

                                        //  alert(startdate);
                                        //  var enddate = new Date(minischedule.child("fullstartdate").val());
                                        //  alert(enddate);

                                        //  enddate.setMinutes(enddate.getMinutes()*1 + minischedule.child("duration").val());

                                        var Data =
                                            {

                                                "daykey": minischedule.key,
                                                "key": ministadiums.key,
                                                "name": minischedule.child("name").val(),

                                                "minikey": miniministadiums.key,
                                                "mininame": miniministadiums.child("description").val(),
                                                "day": day,
                                                "month": month,
                                                "year": year,
                                                "fullenddate": enddate,
                                                "fullstartdate": startdate,

                                                "starthour": minischedule.child('hour').val(),
                                                "startminute": minischedule.child('minute').val() == 0 ? "00" : minischedule.child('minute').val(),

                                                "firstname": minischedule.child("firstname").val(),
                                                "user": minischedule.child("usercode").val(),
                                                "username": "",
                                                "telephone": minischedule.child("telephone").val(),
                                                //"telephone": miniministadiums.child("telephone").val(),
                                                "price": minischedule.child("price").val(),
                                                "color": color,
                                                "references": minischedule.child("references").val()

                                            };

                                        SchedulesByDay.push(Data);
                                    }



                                });
                            }
                        });

                    });
                    callback(SchedulesByDay);
                }, function (error) {
                    alert(error.message);
                });

            },
            GetMyBalances: function (month, callback) {


                //alert(search.date.getMonth());
                //     alert("TEST");
                MyBalances = [];
                var user = firebase.auth().currentUser;
                var id = user.uid;

                //alert(id);
                try {

                    firebase.database().ref('/stadiums').orderByChild("admin").equalTo(id).on('value', function (snapshot) {

                        MyBalances = [];
                        snapshot.forEach(function (ministadiums) {

                            ministadiums.child("ministadiums").forEach(function (miniministadiums) {


                                if (miniministadiums.child('schedules').exists()) {

                                    miniministadiums.child('schedules').forEach(function (yearschedule) {


                                        yearschedule.forEach(function (monthschedule) {

                                            if (monthschedule.key == month) {

                                                monthschedule.forEach(function (dayschedule) {

                                                    dayschedule.forEach(function (schedule, i) {
                                                        //  alert(i);

                                                        if (schedule.child('maindata').val()) {
                                                            var total;
                                                            var price;
                                                            var booked = false;

                                                            //  alert(counter);

                                                            if (dayschedule.child('bookedadmin').exists()) {

                                                                if (minischedule.child('bookedadmin').val()) {
                                                                    price = schedule.child("price").val();
                                                                    total = schedule.child("price").val();

                                                                }
                                                                else {

                                                                    booked = true;
                                                                }

                                                            }
                                                            else {

                                                                booked = true;

                                                            }
                                                            price = schedule.child("price").val();
                                                            total = schedule.child("price").val();
                                                            var Data =
                                                                {
                                                                    "key": ministadiums.key,
                                                                    "minikey": miniministadiums.key,

                                                                    "reservationnum": schedule.key,
                                                                    "type": schedule.child("type").val(),

                                                                    "year": schedule.child("year").val(),
                                                                    "month": (schedule.child("month").val() + 1),
                                                                    "day": schedule.child("day").val(),
                                                                    "hour": schedule.child("hour").val(),
                                                                    "minute": schedule.child("minute").val() == 0 ? "00" : schedule.child("minute").val(),
                                                                    //"telephone": miniministadiums.child("telephone").val(),
                                                                    "price": price,
                                                                    "percentage": 0,
                                                                    "total": total.toFixed(2),
                                                                    "perc": 0

                                                                };
                                                            MyBalances.push(Data);
                                                        }
                                                    });
                                                });

                                            }

                                        });
                                    });
                                }//if


                            });
                        });
                        callback(MyBalances);
                    }, function (error) {
                        alert(error.message);
                    });
                }
                catch (error) {
                    alert(error.message);
                }

            },

            AddStadium: function (stadiums) {


                //alert(user.teamname);
                // Get a key for a new Post.

                var user = firebase.auth().currentUser;
                var id = user.uid;


                var stadium = {

                    admin: id,
                    name: stadiums.name,
                    telephone: stadiums.telephone != null ? stadiums.telephone : "",
                    city: stadiums.city != null ? stadiums.city : "",
                    address1: stadiums.address1 != null ? stadiums.address1 : "",
                    address2: stadiums.address2 != null ? stadiums.address2 : "",
                    email: stadiums.email != null ? stadiums.email : "",
                    description: stadiums.description != null ? stadiums.description : "",
                    cancelationpolicy: stadiums.cancelationpolicy != null ? stadiums.city : "",
                    rating: 0,
                    water: true,
                    photo: ""

                };
                var newPostKey = firebase.database().ref().child('stadiums').push().key;


                //alert(newPostKey);
                // Write the new post's data simultaneously in the posts list and the user's post list.
                var updates = {};
                updates['/stadiums/' + stadiums.name] = stadium;
                updates['/admins/' + id + '/stadiums/' + stadiums.name] = stadium;

                return firebase.database().ref().update(updates);
            },

            AddMiniStadium: function (key, stadiums) {


                //alert(user.teamname);
                // Get a key for a new Post.
                try {

                    var user = firebase.auth().currentUser;
                    var id = user.uid;


                    var stadium = {

                        description: stadiums.name,
                        width: stadiums.width != null ? stadiums.width : "",
                        length: stadiums.heigth != null ? stadiums.heigth : "",

                        price: stadiums.price != null ? stadiums.price : "",
                        type: stadiums.type != null ? stadiums.type : "",
                        typefloor: stadiums.typefloor != null ? stadiums.typefloor : "",

                        photo: stadiums.photo != null ? stadiums.photo : "",
                        rating: "0",
                        numplayers: stadiums.numplayers

                    };

                    var newPostKey = firebase.database().ref().child('/stadiums/' + key + '/ministadiums/').push().key;

                    var updates = {};
                    updates['/stadiums/' + key + '/ministadiums/' + newPostKey] = stadium;
                    updates['/stadiumsinfo/' + key + '/ministadiums/' + newPostKey] = stadium;

                    return firebase.database().ref().update(updates);
                }

                catch (error) {
                    alert(error.message);
                }
            },
            GetCustomers: function (callback) {
                Customers = [];
                try {
                    firebase.database().ref('/players').on('value', function (snapshot) {
                        Customers = [];
                        snapshot.forEach(function (PlayerSnapshot) {
                            var numbookings = 0;
                            if (PlayerSnapshot.child("upcomingmatches").exists()) {
                                numbookings = PlayerSnapshot.child("upcomingmatches").numChildren();
                            }

                            var Data = {
                                "key": PlayerSnapshot.key,
                                "firstname": PlayerSnapshot.child("firstname").val(),
                                "lastname": PlayerSnapshot.child("lastname").val(),
                                "email": PlayerSnapshot.child("email").val(),
                                "telephone": PlayerSnapshot.child("telephone").val(),
                                "bookings": numbookings,
                                "cancelled": PlayerSnapshot.child("cancelled").val(),
                                "didnotshowup": PlayerSnapshot.child("didnotshowup").val(),
                                "cancelledweather": PlayerSnapshot.child("cancelledweather").val(),

                            };
                            Customers.push(Data);

                        });

                        callback(Customers);
                    }, function (error) {
                        alert(error.message);
                    });
                }
                catch (error) {
                    alert(error.message);
                }


                //alert(Availables.length());
                return Customers;
            },
            GetCustomerByCode: function (code, callback) {
                customerinfo = {};
                try {
                    firebase.database().ref('/players/' + code).once('value', function (snapshot) {

                        if (snapshot.exists()) {
                            var numbookings = 0;

                            var Data = {
                                "key": snapshot.key,
                                "firstname": snapshot.child("firstname").val(),
                                "lastname": snapshot.child("lastname").val(),
                                "email": snapshot.child("email").val(),
                                "telephone": snapshot.child("telephone").val(),
                                //  "bookings": numbookings,
                                "showedup": snapshot.child("showedup").val(),
                                "cancelled": snapshot.child("cancelled").val(),
                                "didnotshowup": snapshot.child("didnotshowup").val(),
                                "cancelledweather": snapshot.child("cancelledweather").val(),

                            };
                            customerinfo = Data;
                        }


                        callback(customerinfo);
                    }, function (error) {
                        alert(error.message);
                    });
                }
                catch (error) {
                    alert(error.message);
                }


                //alert(Availables.length());
                return Customers;
            },

            UpdateScores: function (customer) {

                var updates = {};
                updates['/players/' + customer.key + '/cancelledweather'] = customer.cancelledweather;
                updates['/players/' + customer.key + '/didnotshowup'] = customer.didnotshowup;
                updates['/players/' + customer.key + '/cancelled'] = customer.cancelled;

                return firebase.database().ref().update(updates);

            },

            GetMyCustomers: function (callback) {
                MyCustomers = [];

                var user = firebase.auth().currentUser;


                var id = user.uid;
                try {
                    firebase.database().ref('/admins/' + id + '/mycustomers').on('value', function (snapshot) {
                        MyCustomers = [];
                        snapshot.forEach(function (PlayerSnapshot) {
                            var Data = {
                                "key": PlayerSnapshot.key,
                                "firstname": PlayerSnapshot.child("firstname").val(),
                                "telephone": PlayerSnapshot.child("telephone").val(),

                            };
                            MyCustomers.push(Data);

                        });

                        callback(MyCustomers);
                    }, function (error) {
                        alert(error.message);
                    });
                }
                catch (error) {
                    alert(error.message);
                }


                //alert(Availables.length());
                return Customers;
            },

            AddBooking: function (stadiumdata, search, details) {
                //alert("here");

                try {

                    var maindate = new Date();

                    maindate.setFullYear(search.date.getFullYear());
                    maindate.setMonth(search.date.getMonth());
                    maindate.setDate(search.date.getDate());
                    maindate.setHours(search.date.getHours());
                    maindate.setMinutes(search.date.getMinutes());

                    var year = search.date.getFullYear();
                    var month = search.date.getMonth();
                    var day = search.date.getDate();

                    var hour = search.date.getHours();
                    var minute = search.date.getMinutes();

                    var key = stadiumdata.key;
                    var subkey = stadiumdata.subkey;

                    var username = stadiumdata.firstname;


                    var adminuser = firebase.auth().currentUser;

                    var adminid = adminuser.uid;

                    var id = stadiumdata.customer;

                    var counter = 0;

                    switch (details.recurring) {
                        case 'Once':
                            counter = 1;
                            break;
                        case '4 weeks':
                            counter = 4;
                            break;
                        case '6 weeks':
                            counter = 6;
                            break;
                        case '8 weeks':
                            counter = 8;
                            break;
                        case '10 weeks':
                            counter = 10;
                            break;
                        case '16 weeks':
                            counter = 16;
                            break;
                        case '24 weeks':
                            counter = 16;
                            break;
                        default:
                            break;
                    }
                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};

                    for (var index = 0; index < counter; index++) {

                        var newkey = subkey + year.toString() + month.toString() + day.toString() + hour.toString() + minute.toString();
                        var mainkey = newkey;


                        var postData = {
                            usercode: id,
                            name: username,
                            telephone: stadiumdata.telephone,
                            hour: hour,
                            minute: minute,
                            day: day,
                            discount: "0",
                            month: month,
                            nettotal: "",
                            price: details.price,
                            starthour: "",
                            startmin: "",
                            teamone: "",
                            teamonescore: "",
                            teamtwo: "",
                            teamtwoscore: "",
                            year: year,
                            percentage: "0",
                            type: "B",
                            total: details.price,
                            bookedadmin: true,
                            duration: details.duration,
                            maindata: true,
                            fullstartdate: search.date,
                            fullenddate: "",
                            references: "",
                            telephone: details.telephone,
                            combined: details.combined,
                            reservationnumber: details.stadiumname.charAt(0) + subkey.charAt(0) + year.toString() + month.toString() + day.toString() + hour.toString() + minute.toString()
                        };

                        var extraslots = {
                            usercode: id,
                            type: "B",
                            maindata: false
                        };

                        var numslots = details.duration / 30;
                        var references = [];

                        for (i = 1; i < numslots; i++) {
                            search.date.setMinutes(search.date.getMinutes() + 30);

                            newkey = subkey + search.date.getFullYear().toString() + search.date.getMonth().toString() + search.date.getDate().toString() + search.date.getHours().toString() + search.date.getMinutes().toString();
                            var refdata = {
                                key: newkey
                            }
                            references.push(refdata);

                            var extrakeys = [];
                            if (details.iscombined) {
                                for (var key in details.combined) {
                                    extrakeys.push(key);
                                }
                                console.log(extrakeys);
                                extrakeys.forEach(function (element) {
                                    updates['/stadiums/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;
                                    updates['/stadiumshistory/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;
                                }, this);
                            }

                            updates['/stadiums/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;
                            updates['/stadiumshistory/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;

                        }

                        postData.references = references;

                        var accountinfo = {
                            usercode: id,
                            hour: hour,
                            minute: minute,
                            day: day,
                            discount: "0",
                            month: month,
                            nettotal: "",
                            price: details.price,
                            starthour: "",
                            startmin: "",
                            year: year,
                            percentage: "0",
                            type: "B",
                            year: year,
                            total: details.price,
                            bookedadmin: true,
                            fullstartdate: search.date,
                            fullenddate: "",

                        };

                        updates['/stadiums/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;


                        maindate.setDate(maindate.getDate() + 7);

                        search.date.setFullYear(maindate.getFullYear());
                        search.date.setMonth(maindate.getMonth());
                        search.date.setDate(maindate.getDate());
                        search.date.setHours(maindate.getHours());
                        search.date.setMinutes(maindate.getMinutes());

                        var year = search.date.getFullYear();
                        var month = search.date.getMonth();
                        var day = search.date.getDate();

                        var hour = search.date.getHours();
                        var minute = search.date.getMinutes();

                    }
                    updates['/players/' + id + '/upcomingmatches/' + mainkey] = postData;
                    updates['/accounting/' + id + '/' + mainkey] = accountinfo;

                    return firebase.database().ref().update(updates);
                }
                catch (error) {
                    alert(error.message);
                }

            },
            DeleteBooking: function (booking, type) {

                var updates = {};

                var user = firebase.auth().currentUser;

                var id = user.uid;

                updates['/stadiums/' + booking.key
                    + '/ministadiums/' + booking.minikey
                    + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + booking.daykey] = null;

                updates['/stadiumshistory/' + booking.key
                    + '/ministadiums/' + booking.minikey
                    + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + booking.daykey] = null;



                booking.references.forEach(function (element) {

                    updates['/stadiums/' + booking.key
                        + '/ministadiums/' + booking.minikey
                        + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + element.key] = null;

                    updates['/stadiumshistory/' + booking.key
                        + '/ministadiums/' + booking.minikey
                        + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + element.key] = null;

                }, this);

                return firebase.database().ref().update(updates);


            },
            AddUser: function (newuser, newPostKey) {

                var user = firebase.auth().currentUser;
                var id = user.uid;

                if (newuser != null) {
                    var usertoadd =
                        {
                            email: newuser.email,
                            winstreak: 0,
                            userdescription: "",
                            telephone: newuser.telephone,
                            enableinvitations: true,
                            highestrating: 1500,
                            firstname: newuser.name,
                            lastname: newuser.lastname,
                            status: "0",
                            playposition: "Defender",
                            displayname: "",
                            favouritesport: "football",
                            middlename: "",
                            ranking: 100,
                            cancelled: 0,
                            cancelledweather: 0,
                            didnotshowup: 0

                        }


                    var mycustomer =
                        {
                            uid: newPostKey,
                            telephone: newuser.telephone,
                            firstname: newuser.name,
                            lastname: newuser.lastname,

                        }

                    var updates = {};

                    var ready = false;
                    try {

                        var query = firebase.database().ref('/telephones/' + newuser.telephone);

                        query.once('value', function (snapshot) {

                            if (snapshot.exists()) {

                                var pid = snapshot.child("uid").val();
                                var existingcustomer =
                                    {
                                        uid: pid,
                                        telephone: newuser.telephone,
                                        firstname: newuser.name
                                    }

                                updates['/admins/' + id + '/mycustomers/' + newPostKey] = existingcustomer;
                                return firebase.database().ref().update(updates);
                                // ready = true;
                            }
                            else {
                                updates['/players/' + newPostKey] = usertoadd;
                                updates['/playersinfo/' + newPostKey] = usertoadd;
                                updates['/telephones/' + newuser.telephone] = mycustomer;
                                updates['/admins/' + id + '/mycustomers/' + newPostKey] = mycustomer;
                                return firebase.database().ref().update(updates);
                                // ready = true;

                            }

                        });

                    }
                    catch (error) {
                        alert(error.message);
                    }


                    return firebase.database().ref().update(updates);
                }


            },
            AddPromotion: function (promotion) {

                if (promotion != null) {

                    var promkey = firebase.database().ref().child('/promotions/' + promotion.stadium + '/' + promotion.ministadium).push().key;
                    //alert(newPostKey);
                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};
                    updates['/promotions/' + promotion.stadium + '/' + promotion.ministadium + '/' + promkey] = promotion;


                    return firebase.database().ref().update(updates);
                }

            },
            GetPromotions: function (key, callback) {

                var user = firebase.auth().currentUser;

                var id = user.uid;
                //alert(id);
                firebase.database().ref('/promotions').on('value', function (snapshot) {



                    MyPromotions = [];
                    // alert("test");

                    if (snapshot.child(key).exists()) {
                        snapshot.child(key).forEach(function (mainstadiumSnapshot) {

                            //  alert(mainstadiumSnapshot.key);

                            mainstadiumSnapshot.forEach(function (promotions) {

                                //     alert(promotions.key);
                                var Data = {
                                    key: promotions.key,
                                    name: promotions.child("name").val(),
                                    //  photo: promotions.child("photo").val(),
                                    stadium: key,
                                    ministadium: mainstadiumSnapshot.key,
                                    date: promotions.child("date").val(),
                                    starttime: promotions.child("starttime").val(),
                                    endtime: promotions.child("endtime").val(),
                                    discount: promotions.child("discount").val(),
                                    weekly: promotions.child("weekly").val(),
                                    newprice: promotions.child("newprice").val()


                                };
                                MyPromotions.push(Data);

                            })

                        });
                    }




                    callback(MyPromotions);
                }, function (error) {
                    alert(error.message);
                });

                //alert(Availables.length());
                return Availables;
            },
            DeletePromotion: function (promotion) {

                if (promotion != null) {
                    //alert(newPostKey);
                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};
                    updates['/promotions/' + promotion.stadium + '/' + promotion.ministadium + '/' + promotion.key] = null;


                    return firebase.database().ref().update(updates);
                }

            },
            SaveCustomer: function (Customer) {

                var user = firebase.auth().currentUser;
                var id = user.uid;

                var updates = {};
                 updates['/admins/' + id + '/mycustomers/'+Customer.key +'/telephone'] = Customer.telephone;
                 updates['/admins/' + id + '/mycustomers/'+Customer.key +'/firstname'] = Customer.firstname;
                
                return firebase.database().ref().update(updates);

            },


        }
    })