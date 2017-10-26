
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
                                                "references": minischedule.child("references").val(),
                                                "isrecurring": minischedule.child("isrecurring").val(),
                                                "recurringkey": minischedule.child("recurringkey").val(),
                                                "onlyrecurring": minischedule.child("onlyrecurring").val(),
                                                "minute": minischedule.child("minute").val(),
                                                "hour": minischedule.child("hour").val(),
                                                "type": minischedule.child("type").val(),
                                                "combined": miniministadiums.child("combined").val(),
                                                "relatedto": miniministadiums.child("relatedto").val(),
                                                "iscombined": minischedule.child("iscombined").val()

                                            };

                                        if (minischedule.child("type").val() == "T") {
                                            Data.challengekey = minischedule.child("challengekey").val();
                                        }

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

            GetBookingsByRecurringId: function (Booking, callback) {

                console.log(Booking);
                SchedulesByDay = [];
                var user = firebase.auth().currentUser;

                var id = user.uid;

                firebase.database().ref('/stadiums/' + Booking.key + '/ministadiums').once('value', function (stadium) {
                    SchedulesByDay = [];
                    stadium.forEach(function (ministadiums) {

                        ministadiums.child("schedules").forEach(function (years) {
                            //var mininame = ministadiums.child("name").val();
                            years.forEach(function (months) {

                                months.forEach(function (days) {

                                    days.forEach(function (schedules) {

                                        if (schedules.child('maindata').val()) {

                                            if (Booking.recurringkey == schedules.child("recurringkey").val()) {


                                                var startdate = schedules.child("fullstartdate").val();
                                                var startdate = new Date();


                                                startdate.setMinutes(schedules.child('minute').val());
                                                startdate.setFullYear(schedules.child('year').val());
                                                startdate.setMonth(schedules.child('month').val());
                                                startdate.setHours(schedules.child('hour').val());
                                                startdate.setDate(schedules.child('day').val());

                                                if (startdate > new Date()) {
                                                    var enddate = new Date();

                                                    enddate.setMinutes(schedules.child('minute').val());
                                                    enddate.setFullYear(schedules.child('year').val());
                                                    enddate.setMonth(schedules.child('month').val());
                                                    enddate.setHours(schedules.child('hour').val());
                                                    enddate.setDate(schedules.child('day').val());

                                                    enddate.setMinutes(enddate.getMinutes() + schedules.child('duration').val() * 1);


                                                    var Data =
                                                        {

                                                            "daykey": schedules.key,
                                                            "key": Booking.key,
                                                            "name": schedules.child("name").val(),

                                                            "minikey": ministadiums.key,
                                                            "mininame": schedules.child("description").val(),
                                                            "day": schedules.child("day").val(),
                                                            "month": schedules.child("month").val(),
                                                            "year": schedules.child("year").val(),
                                                            "minute": schedules.child("minute").val(),
                                                            "hour": schedules.child("hour").val(),
                                                            "fullenddate": enddate,
                                                            "fullstartdate": startdate,

                                                            "starthour": schedules.child('hour').val(),
                                                            "startminute": schedules.child('minute').val() == 0 ? "00" : schedules.child('minute').val(),

                                                            "firstname": schedules.child("firstname").val(),
                                                            "references": schedules.child("references").val(),

                                                            "isrecurring": schedules.child("isrecurring").val(),
                                                            "recurringkey": schedules.child("recurringkey").val(),
                                                            "onlyrecurring": schedules.child("onlyrecurring").val(),

                                                            "references": schedules.child("references").val()


                                                        };

                                                    SchedulesByDay.push(Data);
                                                }
                                            }

                                        }
                                    })

                                });
                            })
                        });

                    })


                    callback(SchedulesByDay);
                }, function (error) {

                });

            },

            GetMyBalances: function (month, callback) {


                MyBalances = [];
                var user = firebase.auth().currentUser;
                var id = user.uid;

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

                                                        if (schedule.child('maindata').val()) {
                                                            var total;
                                                            var price;
                                                            var booked = false;

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

                // Write the new post's data simultaneously in the posts list and the user's post list.
                var updates = {};
                updates['/stadiums/' + stadiums.name] = stadium;
                updates['/admins/' + id + '/stadiums/' + stadiums.name] = stadium;

                return firebase.database().ref().update(updates);
            },

            AddMiniStadium: function (key, stadiums) {

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
                                "bookings": numbookings - PlayerSnapshot.child("cancelled").val(),
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

                    var recurringkey = "";
                    if (counter != 1) {
                        var recurringkey = firebase.database().ref().child('stadiums').push().key;
                    }

                    for (var index = 0; index < counter; index++) {

                        var newkey = subkey
                            + year.toString()
                            + month.toString()
                            + day.toString()
                            + hour.toString()
                            + minute.toString()

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
                            reservationnumber: details.stadiumname.charAt(0) + subkey.charAt(0) + year.toString() + month.toString() + day.toString() + hour.toString() + minute.toString(),
                            isrecurring: counter != 1,
                            recurringkey: recurringkey,
                            onlyrecurring: recurringkey,
                            iscombined: details.iscombined,
                            cancelled: false,
                            didnotshowup: false
                        };

                        var extraslots = {
                            usercode: id,
                            type: "B",
                            maindata: false
                        };

                        updates['/players/' + id + '/upcomingmatches/' + newkey] = postData;


                        var numslots = details.duration / 30;
                        var references = [];

                        for (i = 1; i < numslots; i++) {
                            search.date.setMinutes(search.date.getMinutes() + 30);

                            newkey = subkey +
                                search.date.getFullYear().toString() +
                                search.date.getMonth().toString() +
                                search.date.getDate().toString() +
                                search.date.getHours().toString() +
                                search.date.getMinutes().toString()

                            var refdata = {
                                key: newkey
                            }
                            references.push(refdata);

                            var extrakeys = [];
                            if (details.iscombined) {
                                for (var itemkey in details.combined) {
                                    extrakeys.push(itemkey);
                                }
                                extrakeys.forEach(function (element) {

                                    newkey = element +
                                        search.date.getFullYear().toString() +
                                        search.date.getMonth().toString() +
                                        search.date.getDate().toString() +
                                        search.date.getHours().toString() +
                                        search.date.getMinutes().toString()

                                    var refdata = {
                                        key: newkey
                                    }

                                    references.push(refdata);

                                    updates['/stadiums/' + key + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;
                                    updates['/stadiumshistory/' + key + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;
                                }, this);
                            }
                            newkey = subkey +
                                search.date.getFullYear().toString() +
                                search.date.getMonth().toString() +
                                search.date.getDate().toString() +
                                search.date.getHours().toString() +
                                search.date.getMinutes().toString()

                            var refdata = {
                                key: newkey
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
                            iscombined: details.iscombined
                        };



                        updates['/stadiums/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;
                        updates['/stadiumshistory/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;

                        var keys = [];
                        if (details.iscombined) {
                            for (var itemkey in details.combined) {
                                keys.push(itemkey);
                            }

                            keys.forEach(function (element) {

                                var mainkey = element
                                    + year.toString()
                                    + month.toString()
                                    + day.toString()
                                    + hour.toString()
                                    + minute.toString()

                                updates['/stadiums/' + key + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;
                                updates['/stadiumshistory/' + key + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;
                            }, this);
                        }

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

                /*var counter = 1;
                if (booking.isrecurring) {
                    counter = 54;
                }*/

                //for (var index = 0; index < counter; index++) {

                var newkey = booking.minikey
                    + booking.year.toString()
                    + booking.month.toString()
                    + booking.day.toString()
                    + booking.hour.toString()
                    + booking.minute.toString();

                updates['/stadiums/' + booking.key
                    + '/ministadiums/' + booking.minikey
                    + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + newkey] = null;

                updates['/stadiumshistory/' + booking.key
                    + '/ministadiums/' + booking.minikey
                    + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + newkey] = null;



                booking.references.forEach(function (element) {

                    updates['/stadiums/' + booking.key
                        + '/ministadiums/' + booking.minikey
                        + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + element.key] = null;

                    updates['/stadiumshistory/' + booking.key
                        + '/ministadiums/' + booking.minikey
                        + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + element.key] = null;

                }, this);



                /*var BookDate = new Date();
                BookDate.setFullYear(booking.year);
                BookDate.setMonth(booking.month);
                BookDate.setDate(booking.day);
            
                BookDate.setDate(BookDate.getDate() + 7);
            
                booking.year = BookDate.getFullYear();
                booking.month = BookDate.getMonth();
                booking.day = BookDate.getDate();*/

                //}

                return firebase.database().ref().update(updates);

            },
            DeleteRecurringBooking: function (book) {
                var updates = {};
                book.forEach(function (booking) {

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
                }, this);

                //console.log(updates);

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
                    var daynumber = 0;
                    switch (promotion.date) {

                        case "Monday":
                            daynumber = 1;
                            break;

                        case "Tuesday":
                            daynumber = 2;
                            break;

                        case "Wednesday":
                            daynumber = 3;
                            break;

                        case "Thursday":
                            daynumber = 4;
                            break;

                        case "Friday":
                            daynumber = 5;
                            break;

                        case "Saturday":
                            daynumber = 6;
                            break;
                        case "Saturday":
                            daynumber = 7;
                            break;

                        case "Sunday":
                            daynumber = 0;
                            break;
                    }

                    promotion.startyear = promotion.starttime.getFullYear();
                    promotion.startmonth = promotion.starttime.getMonth();
                    promotion.startday = promotion.starttime.getDate();
                    promotion.starthour = promotion.starttime.getHours();
                    promotion.startminute = promotion.starttime.getMinutes();



                    promotion.endyear = promotion.endtime.getFullYear();
                    promotion.endmonth = promotion.endtime.getMonth();
                    promotion.endday = promotion.endtime.getDate();
                    promotion.endhour = promotion.endtime.getHours();
                    promotion.endminute = promotion.endtime.getMinutes();

                    promotion.daynumber = daynumber;


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
                                    newprice: promotions.child("newprice").val(),
                                    newprice: promotions.child("name").val()


                                };
                                MyPromotions.push(Data);

                            })

                        });
                    }

                    callback(MyPromotions);
                }, function (error) {
                    alert(error.message);
                });

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
                updates['/admins/' + id + '/mycustomers/' + Customer.key + '/telephone'] = Customer.telephone;
                updates['/admins/' + id + '/mycustomers/' + Customer.key + '/firstname'] = Customer.firstname;

                return firebase.database().ref().update(updates);

            },
            GetChallengeByKey: function (myid, key, callback) {

                try {
                    ChallengeDetails = {};
                    var team1players = [];
                    var team2players = [];
                    firebase.database().ref('/challenges/' + key).once('value', function (challenges) {

                        if (challenges.exists()) {

                            var challengedate = new Date();


                            var isadmin = challenges.child("admin").val() == myid;

                            challengedate.setMinutes(challenges.child("minute").val());
                            challengedate.setFullYear(challenges.child("year").val());
                            challengedate.setMonth(challenges.child("month").val());
                            challengedate.setHours(challenges.child("hour").val());
                            challengedate.setDate(challenges.child("day").val());

                            if (challenges.child("team1players").exists()) {

                                challenges.child("team1players").forEach(function (pl) {

                                    var data = {

                                        key: pl.key,
                                        status: pl.child("status").val()

                                    }
                                    team1players.push(data);

                                })

                            }

                            if (challenges.child("team2players").exists()) {

                                challenges.child("team2players").forEach(function (p2) {

                                    var data2 = {

                                        key: p2.key,
                                        status: p2.child("status").val()

                                    }
                                    team2players.push(data2);

                                })

                            }

                            var challengedata = {
                                key: challenges.key,
                                accepted: challenges.child("accepted").val(),
                                day: challenges.child("day").val(),
                                hour: challenges.child("hour").val(),
                                minute: challenges.child("minute").val(),
                                month: challenges.child("month").val(),
                                stadiums: challenges.child("stadiums").val(),
                                team1adminid: challenges.child("team1adminid").val(),
                                team1key: challenges.child("team1key").val(),
                                team1logo: challenges.child("team1logo").val(),
                                team1name: challenges.child("team1name").val(),
                                team1rank: challenges.child("team1rank").val(),
                                team1jersey: challenges.child("team1jersey").val(),

                                team2adminid: challenges.child("team2adminid").val(),
                                team2key: challenges.child("team2key").val(),
                                team2logo: challenges.child("team2logo").val(),
                                team2name: challenges.child("team2name").val(),
                                team2rank: challenges.child("team2rank").val(),
                                team2jersey: challenges.child("team2jersey").val(),

                                challengeradmin: challenges.child("challengeradmin").val(),
                                year: challenges.child("year").val(),
                                date: challengedate,
                                isadmin: isadmin,
                                team1players: team1players,
                                team2players: team2players,

                                adminphoto: challenges.child("adminphoto").val(),
                                admintelephon: challenges.child("admintelephon").val(),
                                adminname: challenges.child("adminname").val(),
                                numplayers: challenges.child("numplayers").val()


                            }

                            ChallengeDetails = challengedata;
                        }
                        console.log(ChallengeDetails);
                        // alert(JSON.stringify(ChallengeDetails));
                        callback(ChallengeDetails);

                    }, function (error) {
                        alert(error.message);
                    });

                } catch (error) {
                    alert(error.message);
                }

            },

            ChooseWinner: function (Challenge, Winner) {
                var updates = {};

                var mainkey = Challenge.stadiums.ministadiumkey
                    + Challenge.year.toString()
                    + Challenge.month.toString()
                    + Challenge.day.toString()
                    + Challenge.hour.toString()
                    + Challenge.minute.toString();

                switch (Winner) {
                    case 1:
                        //updates['/stadiums/' + Challenge.stadiums.stadiumkey + '/ministadiums/' + Challenge.stadiums.ministadiumkey + '/schedules/' + Challenge.year + '/' + Challenge.month + '/' + Challenge.day + '/' + mainkey + '/status'] = 1;
                        updates['/challenges/' + Challenge.challengekey + '/status'] = 1;
                        updates['/teams/' + Challenge.team1key + '/upcominteamgmatches/' + Challenge.key + '/status'] = 1;
                        updates['/teams/' + Challenge.team2key + '/upcominteamgmatches/' + Challenge.key + '/status'] = 2;
                        break;

                    case 2:
                        //updates['/stadiums/' + Challenge.stadiums.stadiumkey + '/ministadiums/' + Challenge.stadiums.ministadiumkey + '/schedules/' + Challenge.year + '/' + Challenge.month + '/' + Challenge.day + '/' + mainkey + '/status'] = 2;
                        updates['/challenges/' + Challenge.challengekey + '/status'] = 2;
                        updates['/teams/' + Challenge.team1key + '/upcominteamgmatches/' + Challenge.key + '/status'] = 2;
                        updates['/teams/' + Challenge.team2key + '/upcominteamgmatches/' + Challenge.key + '/status'] = 1;

                        break;

                    case 3:
                        // updates['/stadiums/' + Challenge.stadiums.stadiumkey + '/ministadiums/' + Challenge.stadiums.ministadiumkey + '/schedules/' + Challenge.year + '/' + Challenge.month + '/' + Challenge.day + '/' + mainkey + '/status'] = 3;
                        updates['/challenges/' + Challenge.challengekey + '/status'] = 3;
                        updates['/teams/' + Challenge.team1key + '/upcominteamgmatches/' + Challenge.key + '/status'] = 3;
                        updates['/teams/' + Challenge.team2key + '/upcominteamgmatches/' + Challenge.key + '/status'] = 3;
                        break;

                    default:
                        break;
                }

                return firebase.database().ref().update(updates);

            }

        }
    })