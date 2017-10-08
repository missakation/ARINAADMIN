
angular.module('football.controllers')
    .controller('AdminController', function ($scope, $ionicLoading, AdminStore, $ionicPopup) {


        try {


            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            AdminStore.GetMyStadiums(function (leagues) {
                $ionicLoading.hide();
                $scope.mystadiums = leagues;
                //}

            }, function (error) {
                alert(error.message);
            })
        }
        catch (error) {
            alert(error.message);
        }




    })

    .controller('AdminAddController', function ($scope, $ionicLoading, AdminStore, $ionicPopup) {



        $scope.addstadium = function (stadium) {

            try {

                AdminStore.AddStadium(stadium)
                    .then(function (value) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Success',
                            template: 'New Stadium Added'
                        });
                        $state.go("app.adminpage");
                    }, function (error) {
                        alert(error.message);

                        alertPopup.then(function (res) {
                            // Custom functionality....
                        });

                    })
            }
            catch (error) {
                alert(error.message);
            }
        };
    })


    .controller('AdminMiniController', function ($scope, $stateParams, $ionicLoading, AdminStore, $ionicPopup) {


        $scope.key = $stateParams.stadiumid;

        try {


            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            AdminStore.GetMyMiniStadiums($stateParams.stadiumid, function (leagues) {
                $ionicLoading.hide();
                $scope.myministadiums = leagues;

                if (leagues.length == 0) {

                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Mini Stadiums Found'
                    });

                    //  alert(JSON.stringify(leagues, null, 4));
                }

            }, function (error) {
                alert(error.message);
            })
        }
        catch (error) {
            alert(error.message);
        }


    })

    .controller('AdminAddMiniController', function ($scope, $stateParams, $ionicLoading, AdminStore, $ionicPopup) {

        //  alert("test");
        //alert($stateParams.stadiumid);

        $scope.ministadium =
            {
                name: "",
                typefloor: "indoor",
                type: "grass",
                price: "100",
                photo: "",
                width: "",
                length: "",
                numplayers: ""
            }

        $scope.addministadium = function () {
            try {

                //  alert(ministadium.typefloor);
                // alert($scope.ministadium.name);



                AdminStore.AddMiniStadium($stateParams.stadiumid, $scope.ministadium)
                    .then(function (value) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Success',
                            template: 'New Stadium Added'
                        });
                        $state.go("app.adminpagedetails");
                    }, function (error) {
                        alert(error.message);

                        alertPopup.then(function (res) {
                            // Custom functionality....
                        });
                        //$scope.allfreestadiums.

                    })
            }
            catch (error) {
                alert(error.message);
            }
        };
    })

    .controller('AdminScheduleController', function ($scope, $ionicPopover, AdminStore, $ionicPopup, $ionicLoading, $timeout, $state) {


        var today = new Date();

        $scope.search = {
            date: today
        }

        $scope.SelectedBooking = {};

        $scope.scheduleswithday = [];
        $scope.nostadium = false;

        // .fromTemplate() method
        var template1 = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

        $scope.popover1 = $ionicPopover.fromTemplate(template1, {
            scope: $scope
        });


        $ionicPopover.fromTemplateUrl('templates/my-popover-editbooking.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover1 = popover;
        });


        $scope.openEditPopover = function ($event, item) {
            $scope.SelectedBooking = item;
            $scope.popover1.show($event);

        };

        try {
            var today = new Date();

            var onsearch = {
                date: today
            };

            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            AdminStore.GetMyStadiumsByDay(onsearch, function (leagues) {
                $ionicLoading.hide();
                $scope.scheduleswithday = leagues;

                console.log(leagues);

                if (leagues.length == 0) {

                    $scope.nostadium = true;

                }
                else {
                    $scope.nostadium = false;
                }

            }, function (error) {
                alert(error.message);
            })
        }
        catch (error) {
            alert(error.message);
        }

        $scope.gogamedetails = function (gameid) {


            $state.go('app.gamedetails',
                {
                    gameid: gameid.challengekey
                })


        }

        $scope.ReloadPage = function () {

            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            AdminStore.GetMyStadiumsByDay($scope.search, function (leagues) {
                $ionicLoading.hide();
                $scope.scheduleswithday = leagues;
                console.log($scope.scheduleswithday);
                if (leagues.length == 0) {
                    $scope.nostadium = true;
                }
                else {
                    $scope.nostadium = false;
                }
            }, function (error) {
                alert(error.message);
            })
            $scope.$digest();


            // alert("changed");
        };


        $scope.goback = function () {

            //  alert($scope.search.date)
            $scope.search.date.setDate($scope.search.date.getDate() - 1);
            $scope.ReloadPage();
        }

        $scope.gofront = function () {
            // alert($scope.search.date)
            $scope.search.date.setDate($scope.search.date.getDate() + 1);
            // alert($scope.search.date)
            $scope.ReloadPage();
        }



        var indexedTeams = [];
        $scope.playersToFilter = function () {
            indexedTeams = [];
            console.log("HERE");
            console.log($scope.scheduleswithday);
            return $scope.scheduleswithday;
        };

        $scope.filterTeams = function (player) {
            var teamIsNew = indexedTeams.indexOf(player.minikey) == -1;
            if (teamIsNew) {
                indexedTeams.push(player.minikey);
            }
            return teamIsNew;
        };


        $scope.editmode = false;

        $scope.GoEditMode = function () {
            $scope.editmode = !$scope.editmode;
        }

        $scope.setToday = function () {
            $scope.search.date = new Date();
            $scope.ReloadPage();
        }

        $scope.DeleteBooking = function (type) {

            var message = ""

            if (type == 0) {
                message = 'Are you sure you want to cancel?'
            }
            else
                if (type == 1) {
                    message = 'Are you sure you want to cancel due weather?'
                }
                else {
                    message = 'Are you sure he did not show up?'
                }

            var confirmPopup = $ionicPopup.confirm({
                title: 'Show Up',
                template: message
            });
            confirmPopup.then(function (res) {

                if (res) {
                    if (type != 3) {

                        if ($scope.SelectedBooking.iscombined) {
                            $scope.scheduleswithday.forEach(function (element) {
                                if (element.relatedto == $scope.SelectedBooking.relatedto) {

                                    AdminStore.DeleteBooking(element, type)
                                        .then(function (value) {
                                            AdminStore.GetCustomerByCode($scope.SelectedBooking.user, function (result) {
                                                if (result == "") {
                                                    alert("Could Not Update User Infos");
                                                }
                                                else {

                                                    if (type == 0) {

                                                        result.cancelled = result.cancelled * 1 + 1;
                                                    }
                                                    else
                                                        if (type == 1) {

                                                            result.cancelledweather = result.cancelledweather * 1 + 1;
                                                        }
                                                        else {
                                                            result.didnotshowup = result.didnotshowup * 1 + 1;
                                                        }


                                                    AdminStore.UpdateScores(result)
                                                    {
                                                        var alertPopup = $ionicPopup.alert({
                                                            title: 'Cancelled',
                                                            template: 'Successfully Cancelled'
                                                        });
                                                        $scope.popover1.hide();
                                                    }
                                                }


                                            });


                                        }, function (error) {
                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Error',
                                                template: error.message
                                            });

                                            alertPopup.then(function (res) {
                                            });

                                        })
                                }
                            }, this);
                        }
                        else {
                            AdminStore.DeleteBooking($scope.SelectedBooking, type)
                                .then(function (value) {
                                    AdminStore.GetCustomerByCode($scope.SelectedBooking.user, function (result) {
                                        if (result == "") {
                                            alert("Could Not Update User Infos");
                                        }
                                        else {

                                            if (type == 0) {

                                                result.cancelled = result.cancelled * 1 + 1;
                                            }
                                            else
                                                if (type == 1) {

                                                    result.cancelledweather = result.cancelledweather * 1 + 1;
                                                }
                                                else {
                                                    result.didnotshowup = result.didnotshowup * 1 + 1;
                                                }


                                            AdminStore.UpdateScores(result)
                                            {
                                                var alertPopup = $ionicPopup.alert({
                                                    title: 'Cancelled',
                                                    template: 'Successfully Cancelled'
                                                });
                                                $scope.popover1.hide();
                                            }
                                        }


                                    });


                                }, function (error) {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Error',
                                        template: error.message
                                    });

                                    alertPopup.then(function (res) {
                                    });

                                })
                        }

                    }
                    else {
                        AdminStore.GetBookingsByRecurringId($scope.SelectedBooking, function (result) {
                            
                            AdminStore.DeleteRecurringBooking(result).then(function (results) {
                            });
                        }, function (error) {

                        })
                    }
                } else {

                }

            });

        }

    })

    .controller('AdminBalanceController', function ($scope, AdminStore, $ionicPopup, $ionicLoading, $timeout, $state) {


        var user = firebase.auth().currentUser;
        var id = user.uid;

        $scope.mybalances = [];

        var today = new Date();


        $scope.search = {
            date: today
        }

        $scope.ReloadPage = function () {
            $scope.totalbalance = 0.0;
            try {

                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                AdminStore.GetMyBalances($scope.search.date.getMonth() + 1, function (leagues) {
                    $ionicLoading.hide();
                    $scope.mybalances = leagues;

                    if (leagues.length == 0) {


                    }
                    else {
                        var perc = 0.00;

                        if (perc >= 15) {
                            perc = 0.15;
                        }
                        else {
                            perc = 10.0 + (0.25 * leagues.length);
                        }


                        var total = 0;
                        for (var i = 0; i < leagues.length; i++) {
                            $scope.mybalances[i].percentage = perc;
                            $scope.mybalances[i].total = leagues[i].price * (perc / 100);
                            total = total + Number(leagues[i].price * perc / 100);
                        }
                        $scope.totalbalance = total.toFixed(2);

                    }
                }, function (error) {
                    alert(error.message);
                })
            }
            catch (error) {
                alert(error.message);
            }

        }

        $scope.ReloadPage();


        $scope.goback = function () {

            //  alert($scope.search.date)
            $scope.search.date.setMonth($scope.search.date.getMonth() - 1);
            $scope.ReloadPage();

        }

        $scope.gofront = function () {
            // alert($scope.search.date)
            $scope.search.date.setMonth($scope.search.date.getMonth() + 1);
            $scope.ReloadPage();


        }

    })

    .controller('AdminHistory', function ($scope, AdminStore, $ionicPopup, $ionicLoading, $timeout, $state) {


        var user = firebase.auth().currentUser;
        var id = user.uid;

        $scope.mybalances = [];
        //alert($scope.search.date);



        var today = new Date();


        $scope.search = {
            date: today
        }


        $scope.ReloadPage = function () {
            try {

                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                AdminStore.GetMyBalances($scope.search.date.getMonth() + 1, function (leagues) {
                    $ionicLoading.hide();
                    $scope.mybalances = leagues;

                    if (leagues.length == 0) {

                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: 'No Schedules Till Now'
                        });

                    }
                    else {
                        var total = 0;
                        for (var i = 0; i < leagues.length; i++) {
                            total = total + Number(leagues[i].total);
                        }
                        $scope.totalbalance = total.toFixed(2);

                    }
                }, function (error) {
                    alert(error.message);
                })
            }
            catch (error) {
                alert(error.message);
            }
        }

        $scope.ReloadPage();





        $scope.goback = function () {

            //  alert($scope.search.date)
            $scope.search.date.setMonth($scope.search.date.getMonth() - 1);
            $scope.ReloadPage();
        }

        $scope.gofront = function () {
            // alert($scope.search.date)
            $scope.search.date.setMonth($scope.search.date.getMonth() + 1);
            $scope.ReloadPage();

        }



        //var commentsRef = firebase.database().ref('/stadiums');
        //commentsRef.on('child_added', function (data) {
        //    alert("WIHA");
        //});


    })



    .controller('AdminAddBooking', function ($scope, $ionicPopover, $ionicHistory, AdminStore, $ionicPopup, $ionicLoading, $timeout, $state, pickerView) {
        /** picker view stuff **/
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        tomorrow.setHours(21);
        tomorrow.setMinutes(0);
        tomorrow.setMilliseconds(0);
        tomorrow.setSeconds(0);

        $scope.search = {
            date: tomorrow,
            text: "Tomorrow, 9:00PM" //- " + ($scope.myprofile.favstadium != null && $scope.myprofile.favstadium != "" ?$scope.myprofile.favstadium:"Near me")
        };

        function getDateFromDayName(selectedDay) {
            var selectedDate = new Date();
            if (selectedDay == "Tomorrow") {
                selectedDate.setDate(selectedDate.getDate() + 1);
                return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
            }
            if (selectedDay == "Today") {
                selectedDate.setDate(selectedDate.getDate());
                return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
            }
            selectedDate.setDate(selectedDate.getDate() + 2);
            for (var i = 0; i < 7; i++) {
                console.log("i is:" + i);
                if (weekdayFull[selectedDate.getDay()] == selectedDay)
                    return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
                selectedDate.setDate(selectedDate.getDate() + 1);
            }
        }

        var stadiums = [];
        $scope.allfreestadiums = [];
        $scope.gotlocation = false;


        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });


        //toRad function
        if (typeof (Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function () {
                return this * Math.PI / 180;
            }
        }

        $ionicLoading.hide();

        $scope.openPickerView = function openPickerView() {

            var picker = pickerView.show({
                titleText: '', // default empty string
                doneButtonText: 'OK', // dafault 'Done'
                cancelButtonText: 'Close', // default 'Cancel'
                items: [{
                    values: dateArrayThingy,
                    defaultIndex: 1
                }, {
                    values: [' 7:00 AM ', ' 7:30 AM ', ' 8:00 AM ', ' 8:30 AM ', ' 9:00 AM ', '9:30 AM ', ' 10:00 AM ', ' 10:30 AM', ' 11:00 AM ', ' 11:30 AM ', ' Noon ', ' 1:00 PM ', ' 1:30 PM ', ' 2:00 PM ', ' 2:30 PM ', ' 3:00 PM ', ' 3:30 PM ', ' 4:00 PM ', ' 4:30 PM ', ' 5:00 PM ', ' 5:30 PM ', ' 6:00 PM ', ' 6:30 PM ', ' 7:00 PM ', ' 7:30 PM ', ' 8:00 PM', ' 8:30 PM ', ' 9:00 PM ', ' 9:30 PM ', ' 10:00 PM ', ' 10:30 PM ', ' 11:00 PM', '11:30 PM '],
                    defaultIndex: 27
                }/*, {
            values: stadiums,
            defaultIndex: 0
        }
        */
                ]
            });

            if (picker) {
                picker.then(function pickerViewFinish(output) {
                    if (output) {
                        // output is Array type
                        var correctDate;
                        var selectedDate = output[0];
                        var selectedTime = output[1];
                        if (!Date.parse(selectedDate) || Date.parse(selectedDate) === undefined || Date.parse(selectedDate) === null) {
                            selectedDate = getDateFromDayName(selectedDate);
                            console.log("Output is: " + output[0]);
                            console.log(selectedDate);
                        }
                        else
                            console.log("why?");
                        $scope.search.date = new Date(selectedDate + " " + selectedTime + ", " + (new Date()).getFullYear());
                        //$scope.search.players = (output[2].split(" "))[1];
                        console.log($scope.search.date);
                        $scope.search.text = output.join(" - ");
                        //$scope.checkfree();
                    }
                });
            }



        };

        //Cleanup the picker when we're done with it!
        $scope.$on('$destroy', function () {
            //$scope.openPickerView.picker.hide();
            console.log("hello");
            pickerView.close();
            $scope.openPickerView = 0;
        });
        /** End picker view stufgf**/
        $scope.extrainfo = {
            bookingprice: 85000,
            duration: "90",
            recurring: "Once"
        }

        $scope.stadiumdata =
            {
                customer: "",
                name: "",
                telephone: "",
                key: "",
                subkey: ""

            }

        $scope.newcustomer = {
            name: "",
            lastname: "",
            email: "",
            telephone: "",
            key: ""
        }

        $scope.notselected = false;

        $scope.addcustomer = function () {
            if ($scope.newcustomer.name === "" || $scope.newcustomer.telephone === "") {

                alert("please fill some info");
                $scope.notselected = true;
            }
            else {

                var user = firebase.auth().currentUser;
                var id = user.uid;

                var query = firebase.database().ref('/admins/' + id + '/mycustomers').orderByChild("telephone").equalTo($scope.newcustomer.telephone.trim());

                query.once('value', function (snapshot) {

                    if (snapshot.exists()) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: 'This Number Already Exists'
                        });
                    }
                    else {
                        var newPostKey = firebase.database().ref().child('players').push().key;
                        AdminStore.AddUser($scope.newcustomer, newPostKey).then(function (value) {

                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: 'Customer Saved'
                            });

                            alertPopup.then(function (res) {
                                $scope.newcustomer.key = newPostKey;
                                $scope.closePopover1($scope.newcustomer);
                            })

                        }, function (error) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: error.message
                            });

                        })
                    }


                })

            }
        }

        // .fromTemplate() method
        var template1 = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

        $scope.popover1 = $ionicPopover.fromTemplate(template1, {
            scope: $scope
        });


        $ionicPopover.fromTemplateUrl('templates/my-popover-addcustomer.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover1 = popover;
        });


        $scope.openPopover = function ($event) {
            $scope.popover1.show($event);

        };

        // .fromTemplate() method
        var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

        $scope.popover = $ionicPopover.fromTemplate(template, {
            scope: $scope
        });



        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('templates/my-popover-search.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });


        $scope.openPopover = function ($event) {
            $scope.popover.show($event);

        };
        $scope.closePopover = function (item) {
            try {
                $scope.searchtel.currenttelephone = item.telephone;
                $scope.popover.hide();


                for (i = 0; i < $scope.customers.length; i++) {
                    if (item.telephone == $scope.customers[i].telephone) {
                        $scope.currentUser = $scope.customers[i];
                        $scope.selectedcustomer = $scope.customers[i];

                        $scope.stadiumdata.customer = $scope.customers[i].key;

                        $scope.stadiumdata.telephone = $scope.customers[i].telephone;
                        $scope.stadiumdata.firstname = $scope.customers[i].firstname;
                        $scope.notselected = false;
                        break;

                    }
                }
                $scope.newcustomer = {
                    name: "",
                    lastname: "",
                    email: "",
                    telephone: "",
                    key: ""
                }


            }
            catch (error) {
                alert(error.message);
            }

        };


        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.popover.remove();
        });


        $scope.mybalances = [];
        //alert($scope.search.date);
        $scope.customers = [];

        $scope.selectedcustomer = {};

        //comment1

        try {

            /* $ionicLoading.show({
                 content: 'Loading',
                 animation: 'fade-in',
                 showBackdrop: true,
                 maxWidth: 200,
                 showDelay: 0
             });*/


            AdminStore.GetCustomers(function (leagues) {
                $scope.customers = leagues;

                AdminStore.GetMyStadiums(function (stadiums) {

                    $scope.mystadiums = stadiums;

                    if (stadiums.length == 0) {

                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: 'No Stadiums Found'
                        });

                    }

                    else {
                        var stadid = stadiums[0].key;
                        $scope.stadiumdata.key = stadid;
                        AdminStore.GetMyMiniStadiums(stadid, function (ministadiums) {

                            $scope.myministadiums = ministadiums;


                            if (ministadiums.length == 0) {

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: 'No Mini Stadiums Found'
                                });


                            }
                            else {
                                try {
                                    $scope.stadiumdata.subkey = $scope.myministadiums[0].name;
                                    $scope.$digest();
                                }
                                catch (error) {
                                    alert(error.message)
                                }

                            }


                            AdminStore.GetMyCustomers(function (mycustomers) {
                                console.log(mycustomers);
                                $ionicLoading.hide();
                                $scope.mycustomers = mycustomers;

                            });

                        }, function (error) {
                            alert(error.message);
                        })
                    }
                    $scope.$digest();

                })
            }, function (error) {
                alert(error.message);
            })
        }
        catch (error) {
            alert(error.message);
        }


        $scope.searchtel = {
            currenttelephone: ""
        };



        $scope.closePopover1 = function (item) {
            $scope.searchtel.currenttelephone = item.telephone;
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            try {
                AdminStore.GetCustomers(function (leagues) {
                    $ionicLoading.hide();
                    $scope.customers = leagues;
                    $scope.LoadCustomer();
                    $scope.popover1.hide();
                })


            }
            catch (error) {
                alert(error.message);
            }

        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.popover1.remove();
        });

        $scope.LoadCustomer = function () {
            for (i = 0; i < $scope.customers.length; i++) {
                if ($scope.searchtel.currenttelephone == $scope.customers[i].telephone) {

                    $scope.selectedcustomer = $scope.customers[i];
                    $scope.stadiumdata.customer = $scope.customers[i].key;
                    $scope.stadiumdata.telephone = $scope.customers[i].telephone;
                    $scope.stadiumdata.firstname = $scope.customers[i].firstname;
                    $scope.notselected = false;
                    break;
                }
            }
            $scope.newcustomer = {
                name: "",
                lastname: "",
                email: "",
                telephone: "",
                key: ""
            }

        }

        $scope.LoadCustomer1 = function () {
            if ($scope.searchtel.currenttelephone.length == 8) {
                for (i = 0; i < $scope.customers.length; i++) {
                    if ($scope.searchtel.currenttelephone == $scope.customers[i].telephone) {

                        $scope.selectedcustomer = $scope.customers[i];

                        $scope.stadiumdata.customer = $scope.customers[i].key;
                        $scope.stadiumdata.telephone = $scope.customers[i].telephone;
                        $scope.stadiumdata.firstname = $scope.customers[i].firstname;

                        $scope.notselected = false;
                        break;
                    }
                    else {
                        if (i == $scope.customers.length - 1) {
                            $scope.notselected = true;
                        }
                    }



                }
                $scope.newcustomer = {
                    name: "",
                    lastname: "",
                    email: "",
                    telephone: "",
                    key: ""
                }
            }
            else {
                $scope.selectedcustomer = {};
                $scope.stadiumdata.customer = "";
                $scope.stadiumdata.telephone = "";
                $scope.stadiumdata.firstname = "";
                $scope.notselected = true;
            }


        }


        $scope.addbooking = function () {
            try {

                $scope.stadiumdata.key = $scope.stadiumdata.key.trim();
                $scope.stadiumdata.subkey = $scope.stadiumdata.subkey.trim();
                $scope.stadiumdata.customer = $scope.stadiumdata.customer.trim();
                // $scope.stadiumdata.firstname = $scope.stadiumdata.firstname.trim();

                alert($scope.stadiumdata.subkey);
                if ($scope.stadiumdata.key === "" || $scope.stadiumdata.subkey.trim() == "" || $scope.stadiumdata.customer === "") {

                    alert("please fill some info");
                    if ($scope.stadiumdata.customer === "") {
                        $scope.notselected = true;
                    }
                }
                else if ($scope.notselected == true) {
                    alert("Please Select a Customer");
                }
                else {


                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Reserve Stadium',
                        template: 'Are you sure you want to book the stadium at ' + '<br>' + $scope.search.date.toLocaleString() + '</br>'
                    });

                    confirmPopup.then(function (res) {
                        if (res) {

                            var details = {};

                            for (i = 0; i < $scope.myministadiums.length; i++) {

                                if ($scope.myministadiums[i].key == $scope.stadiumdata.subkey) {
                                    details = {
                                        price: $scope.extrainfo.bookingprice,
                                        duration: $scope.extrainfo.duration,
                                        recurring: $scope.extrainfo.recurring,
                                        percentage: "1",
                                        type: "B",
                                        nettotal: 0,
                                        photo: $scope.myministadiums[i].photo,
                                        stadiumname: $scope.myministadiums[i].name2,
                                        combined: $scope.myministadiums[i].combined,
                                        iscombined: $scope.myministadiums[i].iscombined,
                                        telephone: $scope.stadiumdata.telephone
                                    };
                                    break;
                                }
                            }
                            AdminStore.AddBooking($scope.stadiumdata, $scope.search, details)
                                .then(function (value) {

                                    $scope.stadiumdata =
                                        {
                                            customer: "",
                                            name: "",
                                            telephone: "",
                                            key: "",
                                            subkey: ""

                                        }
                                    $scope.searchtel = {
                                        currenttelephone: ""
                                    };

                                    $scope.selectedcustomer = {};
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Success',
                                        template: 'Successfully Booked'
                                    }).then(function () {
                                        $ionicHistory.goBack();
                                    });

                                }, function (error) {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Error',
                                        template: "Schedule Conflict. Please Choose Another Time"
                                    });


                                })

                        } else {

                        }

                    });
                }

            }
            catch (error) {
                alert(error.message);
            }


        }


        $scope.changeprice = function () {

            for (i = 0; i < $scope.myministadiums.length; i++) {
                if ($scope.myministadiums[i].key == $scope.stadiumdata.subkey.trim()) {
                    $scope.extrainfo.bookingprice = $scope.myministadiums[i].price;
                    break;

                }
            }


        }




    }).factory('pickerView', ['$compile', '$rootScope', '$timeout', '$q', '$ionicScrollDelegate', '$ionicBackdrop',
        function ($compile, $rootScope, $timeout, $q, $ionicScrollDelegate, $ionicBackdrop) {

            var i, j, k, tmpVar;

            var domBody, pickerCtnr, pickerInfo;

            var isInit, isShowing;

            var setElementRotate = function setElementRotate(elemList, ni) {
                if (ni < 0 || ni === undefined) { return; }

                if (ni - 2 >= 0)
                    angular.element(elemList[ni - 2]).removeClass('pre-select');
                if (ni - 1 >= 0)
                    angular.element(elemList[ni - 1]).removeClass('selected').addClass('pre-select');

                angular.element(elemList[ni]).removeClass('pre-select').addClass('selected');
                if (ni + 1 < elemList.length)
                    angular.element(elemList[ni + 1]).removeClass('selected').addClass('pre-select');
                if (ni + 2 < elemList.length)
                    angular.element(elemList[ni + 2]).removeClass('pre-select');
            };

            var init = function init() {
                if (isInit) { return; }

                var template =
                    '<div class="picker-view"> ' +
                    '<div class="picker-accessory-bar">' +
                    '<a class="button button-clear" on-tap="pickerEvent.onCancelBuuton()" ng-bind-html="pickerOptions.cancelButtonText"></a>' +
                    '<h3 class="picker-title" ng-bind-html="pickerOptions.titleText"></h3>' +
                    '<a class="button button-clear" on-tap="pickerEvent.onDoneBuuton()" ng-bind-html="pickerOptions.doneButtonText"></a>' +
                    '</div>' +
                    '<div class="picker-content">' +
                    '<ion-scroll ng-repeat="(idx, item) in pickerOptions.items track by $index" ' +
                    'class="picker-scroll" ' +
                    'delegate-handle="{{ \'pickerScroll\' + idx }}" ' +
                    'direction="y" ' +
                    'scrollbar-y="false" ' +
                    'has-bouncing="true" ' +
                    'overflow-scroll="false" ' +
                    'on-touch="pickerEvent.scrollTouch(idx)" ' +
                    'on-release="pickerEvent.scrollRelease(idx)" ' +
                    'on-scroll="pickerEvent.scrollPicking(event, scrollTop, idx)">' +

                    '<div ng-repeat="val in item.values track by $index" ng-bind-html="val"></div>' +
                    '</ion-scroll>' +
                    '</div>' +
                    '</div>';

                pickerCtnr = $compile(template)($rootScope);
                pickerCtnr.addClass('hide');

                ['webkitAnimationStart', 'animationstart'].forEach(function runAnimStartHandle(eventKey) {
                    pickerCtnr[0].addEventListener(eventKey, function whenAnimationStart() {
                        if (pickerCtnr.hasClass('picker-view-slidein')) {
                            // Before Show Picker View
                            $ionicBackdrop.retain();
                            isShowing = true;
                        } else if (pickerCtnr.hasClass('picker-view-slideout')) {
                            // Before Hide Picker View
                            isShowing = false;
                        }
                    }, false);
                });

                ['webkitAnimationEnd', 'animationend'].forEach(function runAnimEndHandle(eventKey) {
                    pickerCtnr[0].addEventListener(eventKey, function whenAnimationEnd() {
                        if (pickerCtnr.hasClass('picker-view-slidein')) {
                            // After Show Picker View
                            pickerCtnr.removeClass('picker-view-slidein');
                        } else if (pickerCtnr.hasClass('picker-view-slideout')) {
                            // After Hide Picker View
                            pickerCtnr.addClass('hide').removeClass('picker-view-slideout');
                            $ionicBackdrop.release();
                        }
                    }, false);
                });

                if (!domBody) { domBody = angular.element(document.body); }
                domBody.append(pickerCtnr);
                isInit = true;
            };

            var dispose = function dispose() {
                pickerCtnr.remove();

                for (k in $rootScope.pickerOptions) { delete $rootScope.pickerOptions[k]; }
                delete $rootScope.pickerOptions;
                for (k in $rootScope.pickEvent) { delete $rootScope.pickEvent[k]; }
                delete $rootScope.pickEvent;

                pickerCtnr = pickerInfo = i = j = k = tmpVar = null;

                isInit = isShowing = false;
            };

            var close = function close() {
                if (!isShowing) { return; }

                pickerCtnr.addClass('picker-view-slideout');
            };

            var show = function show(opts) {
                if (!isInit || typeof opts !== 'object') { return undefined; }

                var pickerShowDefer = $q.defer();

                opts.titleText = opts.titleText || '';
                opts.doneButtonText = opts.doneButtonText || 'Done';
                opts.cancelButtonText = opts.cancelButtonText || 'Cancel';

                pickerInfo = [];
                for (i = 0; i < opts.items.length; i++) {
                    if (opts.items[i].defaultIndex === undefined) {
                        opts.items[i].defaultIndex = 0;
                    }

                    // push a empty string to last, because the scroll height problem
                    opts.items[i].values.push('&nbsp;');

                    pickerInfo.push({
                        scrollTopLast: undefined,
                        scrollMaxTop: undefined,
                        eachItemHeight: undefined,
                        nowSelectIndex: opts.items[i].defaultIndex,
                        output: opts.items[i].values[opts.items[i].defaultIndex],
                        isTouched: false,
                        isFixed: false,
                        scrollStopTimer: null
                    });
                }

                for (k in $rootScope.pickerOptions) { delete $rootScope.pickerOptions[k]; }
                delete $rootScope.pickerOptions;
                for (k in $rootScope.pickEvent) { delete $rootScope.pickEvent[k]; }
                delete $rootScope.pickEvent;

                $rootScope.pickerOptions = opts;
                $rootScope.pickerEvent = {
                    onDoneBuuton: function onDoneBuuton() {
                        var pickerOutput = (function () {
                            var totalOutput = [];
                            for (i = 0; i < $rootScope.pickerOptions.items.length; i++) {
                                totalOutput.push(pickerInfo[i].output);
                            }
                            return totalOutput;
                        })();
                        pickerShowDefer.resolve(pickerOutput);
                        close();
                    },
                    onCancelBuuton: function onCancelBuuton() {
                        pickerShowDefer.resolve();
                        close();
                    },
                    scrollTouch: function scrollTouch(pickerIdx) {
                        pickerInfo[pickerIdx].isTouched = true;
                        pickerInfo[pickerIdx].isFixed = false;
                    },
                    scrollRelease: function scrollRelease(pickerIdx) {
                        pickerInfo[pickerIdx].isTouched = false;
                    },
                    scrollPicking: function scrollPicking(e, scrollTop, pickerIdx) {
                        if (!$rootScope.pickerOptions) { return; }

                        if (!pickerInfo[pickerIdx].isFixed) {
                            pickerInfo[pickerIdx].scrollTopLast = scrollTop;

                            // update the scrollMaxTop (only one times)
                            if (pickerInfo[pickerIdx].scrollMaxTop === undefined) {
                                pickerInfo[pickerIdx].scrollMaxTop = e.target.scrollHeight - e.target.clientHeight + e.target.firstElementChild.offsetTop;
                            }

                            // calculate Select Index
                            tmpVar = Math.round(pickerInfo[pickerIdx].scrollTopLast / pickerInfo[pickerIdx].eachItemHeight);

                            if (tmpVar < 0) {
                                tmpVar = 0;
                            } else if (tmpVar > e.target.firstElementChild.childElementCount - 2) {
                                tmpVar = e.target.firstElementChild.childElementCount - 2;
                            }

                            if (pickerInfo[pickerIdx].nowSelectIndex !== tmpVar) {
                                pickerInfo[pickerIdx].nowSelectIndex = tmpVar;
                                pickerInfo[pickerIdx].output = $rootScope.pickerOptions.items[pickerIdx].values[pickerInfo[pickerIdx].nowSelectIndex];

                                // update item states
                                setElementRotate(e.target.firstElementChild.children,
                                    pickerInfo[pickerIdx].nowSelectIndex);
                            }
                        }


                        if (pickerInfo[pickerIdx].scrollStopTimer) {
                            $timeout.cancel(pickerInfo[pickerIdx].scrollStopTimer);
                            pickerInfo[pickerIdx].scrollStopTimer = null;
                        }
                        if (!pickerInfo[pickerIdx].isFixed) {
                            pickerInfo[pickerIdx].scrollStopTimer = $timeout(function () {
                                $rootScope.pickerEvent.scrollPickStop(pickerIdx);
                            }, 80);
                        }
                    },
                    scrollPickStop: function scrollPickStop(pickerIdx) {
                        if (pickerInfo[pickerIdx].isTouched || pickerIdx === undefined) {
                            return;
                        }

                        pickerInfo[pickerIdx].isFixed = true;

                        // check each scroll position
                        for (j = $ionicScrollDelegate._instances.length - 1; j >= 1; j--) {
                            if ($ionicScrollDelegate._instances[j].$$delegateHandle !== ('pickerScroll' + pickerIdx)) { continue; }

                            // fixed current scroll position
                            tmpVar = pickerInfo[pickerIdx].eachItemHeight * pickerInfo[pickerIdx].nowSelectIndex;
                            if (tmpVar > pickerInfo[pickerIdx].scrollMaxTop) {
                                tmpVar = pickerInfo[pickerIdx].scrollMaxTop;
                            }
                            $ionicScrollDelegate._instances[j].scrollTo(0, tmpVar, true);
                            break;
                        }
                    }
                };

                (function listenScrollDelegateChanged(options) {
                    var waitScrollDelegateDefer = $q.defer();

                    var watchScrollDelegate = $rootScope.$watch(function getDelegate() {
                        return $ionicScrollDelegate._instances;
                    }, function delegateChanged(instances) {
                        watchScrollDelegate(); // remove watch callback
                        watchScrollDelegate = null;

                        var waitingScrollContentUpdate = function waitingScrollContentUpdate(prIdx, sDele) {
                            $timeout(function contentRefresh() {
                                watchScrollDelegate = $rootScope.$watch(function getUpdatedScrollView() {
                                    return sDele.getScrollView();
                                }, function scrollViewChanged(sView) {
                                    watchScrollDelegate();
                                    watchScrollDelegate = null;

                                    pickerInfo[prIdx].eachItemHeight = sView.__content.firstElementChild.clientHeight;

                                    // padding the first item
                                    sView.__container.style.paddingTop = (pickerInfo[prIdx].eachItemHeight * 1.5) + 'px';

                                    // scroll to default index (no animation)
                                    sDele.scrollTo(0, pickerInfo[prIdx].eachItemHeight * options.items[prIdx].defaultIndex, true);

                                    // update item states
                                    setElementRotate(sView.__content.children,
                                        options.items[prIdx].defaultIndex);
                                });
                            }, 20);
                        };

                        var dele;
                        for (i = 0; i < options.items.length; i++) {
                            dele = null;
                            for (j = instances.length - 1; j >= 1; j--) {
                                if (instances[j].$$delegateHandle === undefined) { continue; }

                                if (instances[j].$$delegateHandle === ('pickerScroll' + i)) {
                                    dele = instances[j];
                                    break;
                                }
                            }

                            if (dele) { waitingScrollContentUpdate(i, dele); }
                        }

                        waitScrollDelegateDefer.resolve();
                    });

                    return waitScrollDelegateDefer.promise;
                })(opts).then(function preparePickerViewFinish() {
                    if (!isShowing) {
                        pickerCtnr.removeClass('hide').addClass('picker-view-slidein');
                    }
                });

                pickerShowDefer.promise.close = close;
                return pickerShowDefer.promise;
            };

            var getIsInit = function getIsInit() { return isInit; };
            var getIsShowing = function getIsShowing() { return isShowing; };

            ionic.Platform.ready(init); // when DOM Ready, init Picker View

            return {
                init: init,
                dispose: dispose,
                show: show,
                close: close,

                isInit: getIsInit,
                isShowing: getIsShowing
            };
        }])







    .controller('AdminPromotions', function ($scope, $ionicPopover, AdminStore, $ionicPopup, $ionicLoading) {

        $scope.promotion =
            {
                stadium: "",
                ministadium: "",
                date: "Monday",
                starttime: "",
                endtime: "",
                discount: "15",
                newprice: "50000",
                weekly: false
            }


        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        try {



            AdminStore.GetMyStadiums(function (leagues) {
                $scope.mystadiums = leagues;
                $scope.promotion.stadium = $scope.mystadiums[0].key;

                AdminStore.GetMyMiniStadiums($scope.promotion.stadium, function (leagues) {
                    $scope.myministadiums = leagues;

                    AdminStore.GetPromotions($scope.mystadiums[0].key, function (leagues) {
                        $ionicLoading.hide();
                        $scope.mypromotions = leagues;
                        // alert(JSON.stringify(leagues));

                    }, function (error) {
                        alert(error.message);
                    })


                }, function (error) {
                    alert(error.message);
                })

                alert(error.message);


            })
        }
        catch (error) {
            alert(error.message);
        }


        $scope.addpromotion = function () {
            try {

                //  alert(ministadium.typefloor);
                // alert($scope.ministadium.name);



                AdminStore.AddPromotion($scope.promotion)
                    .then(function (value) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Success',
                            template: 'Promotion Added'
                        });
                    }, function (error) {
                        alert(error.message);

                        alertPopup.then(function (res) {
                            // Custom functionality....
                        });
                        //$scope.allfreestadiums.

                    })
            }
            catch (error) {
                alert(error.message);
            }
        }


        $scope.deletepromotion = function (item) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            try {

                //  alert(ministadium.typefloor);
                // alert($scope.ministadium.name);



                AdminStore.DeletePromotion(item)
                    .then(function (value) {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Success',
                            template: 'Promotion Successfully Deleted'
                        });
                    }, function (error) {
                        alert(error.message);

                        alertPopup.then(function (res) {
                            // Custom functionality....
                        });
                        //$scope.allfreestadiums.

                    })
            }
            catch (error) {
                alert(error.message);
            }


        }





    })


    .controller('GameDetailsController', function ($scope, /*HomeStore*/ $ionicPopup, $ionicLoading, $state, $stateParams, AdminStore, $timeout) {

        console.log($state.params.gameid);

        $scope.loadingphase = false;
        $scope.isadmin = false;
        $scope.first = true;
        $scope.currentteam = "";


        $scope.rating = {};
        $scope.rating.rate = 3;
        $scope.rating.max = 5;


        $scope.myplayers = [];

        $scope.gameid = $state.params.gameid;

        //alert($scope.gameid);

        $scope.opponent = "" //for game details title

        $scope.notloaded = true;
        try {
            $scope.profile = {};

            $scope.user = firebase.auth().currentUser;
            $scope.myid = $scope.user.uid;


            AdminStore.GetChallengeByKey($scope.myid, $scope.gameid, function (challengedetails) {

                if (challengedetails.hasOwnProperty("key")) {
                    $scope.challenge = challengedetails;

                    //alert(JSON.stringify($scope.challenge)); 

                    if ($scope.challenge.team1adminid === $scope.myid) {
                        $scope.isadmin = true;
                        $scope.first = true;
                        $scope.currentteam = $scope.challenge.team1key;
                        $scope.opponent = $scope.challenge.team2name;

                    }
                    else if ($scope.challenge.team2adminid === $scope.myid) {
                        $scope.isadmin = true;
                        $scope.first = false;
                        $scope.currentteam = $scope.challenge.team2key;
                        $scope.opponent = $scope.challenge.team1name;
                    }
                    else {
                        $scope.isadmin = false;
                    }
                    $scope.$apply();


                    $scope.notloaded = false;

                    var oppositecaptain = $scope.first ? $scope.challenge.team2adminid : $scope.challenge.team1adminid;
                    firebase.database().ref('/playersinfo/' + oppositecaptain).on('value', function (snapshot) {
                        if (snapshot.exists()) {

                            $scope.challenge.adminname = snapshot.val().firstname + " " + snapshot.val().lastname;
                            $scope.challenge.adminphoto = snapshot.val().photoURL == "" ? 'img/PlayerProfile.png' : snapshot.val().photoURL;
                            $scope.challenge.admintelephon = snapshot.val().telephone;

                            $scope.challenge.lastseen =
                                {
                                    year: 0,
                                    month: 0,
                                    day: 0,
                                    hour: 0,
                                    minute: 0
                                };
                            $scope.challenge.lastseen.year = snapshot.val().lastseen.loginyear;
                            $scope.challenge.lastseen.month = snapshot.val().lastseen.loginmonth;
                            $scope.challenge.lastseen.day = snapshot.val().lastseen.loginday;
                            $scope.challenge.lastseen.hour = snapshot.val().lastseen.loginhour;
                            $scope.challenge.lastseen.minute = snapshot.val().lastseen.loginminute;

                            $scope.challenge.lastseen.date = new Date();
                            $scope.challenge.lastseen.date.setMinutes(snapshot.val().lastseen.loginminute);
                            $scope.challenge.lastseen.date.setFullYear(snapshot.val().lastseen.loginyear);
                            $scope.challenge.lastseen.date.setMonth(snapshot.val().lastseen.loginmonth);
                            $scope.challenge.lastseen.date.setHours(snapshot.val().lastseen.loginhour);
                            $scope.challenge.lastseen.date.setDate(snapshot.val().lastseen.loginday);

                            var difference = (new Date() - $scope.challenge.lastseen.date) / 1000 / 60;

                            if (difference < 20) {
                                $scope.challenge.lastseen.text = "Online";
                            }
                            else
                                if (difference <= 60) {
                                    $scope.challenge.lastseen.text = Math.floor(difference) + " mins. ago";
                                }
                                else
                                    if (difference <= 24 * 60) {
                                        $scope.challenge.lastseen.text = Math.floor(difference / 60) + " hrs. ago";
                                    }
                                    else
                                        if (difference >= 24 * 60 && difference <= 48 * 60) {
                                            $scope.challenge.lastseen.text = "Yesterday";
                                        }
                                        else {
                                            $scope.challenge.lastseen.text = (Math.floor((difference / 60 / 24))) + " days ago";
                                        }


                        }
                    })

                    firebase.database().ref('/teampoints/' + $scope.challenge.team1key).on('value', function (snapshot) {
                        if (snapshot.exists()) {

                            $scope.challenge.team1rank = snapshot.val().rating;
                            $scope.challenge.team1rating = snapshot.val().rank;

                            switch ($scope.challenge.team1rank) {
                                case 1:
                                    $scope.challenge.team1rankdescription = $scope.challenge.team1rank + 'st';
                                    break;
                                case 2:
                                    $scope.challenge.team1rankkdescription = $scope.challenge.team1rank + 'nd';
                                    break;
                                case 3:
                                    $scope.challenge.team1rankdescription = $scope.challenge.team1rank + 'rd';
                                    break;

                                default:
                                    $scope.challenge.team1rankdescription = $scope.challenge.team1rank + 'th';
                                    break;
                            }


                            firebase.database().ref('/teampoints/' + $scope.challenge.team2key).on('value', function (snapshot) {
                                if (snapshot.exists()) {

                                    $scope.challenge.team2rank = snapshot.val().rating;
                                    $scope.challenge.team2rating = snapshot.val().rank;

                                    switch ($scope.challenge.team2rank) {
                                        case 1:
                                            $scope.challenge.team2rankdescription = $scope.challenge.team2rank + 'st';
                                            break;
                                        case 2:
                                            $scope.challenge.team2rankdescription = $scope.challenge.team2rank + 'nd';
                                            break;
                                        case 3:
                                            $scope.challenge.team2rankdescription = $scope.challenge.team2rank + 'rd';
                                            break;

                                        default:
                                            $scope.challenge.team2rankdescription = $scope.challenge.team2rank + 'th';
                                            break;
                                    }

                                    var range = $scope.challenge.team1rating - $scope.challenge.team2rating;

                                    var difficulty = "";
                                    var difficultytext = "";
                                    switch (true) {
                                        case range <= 100 && range >= -100:
                                            $scope.challenge.difficulty = "Medium.png";
                                            $scope.challenge.difficultytext = "Medium";
                                            break;
                                        case range < -100 && range > -200:
                                            $scope.challenge.difficulty = "Hard.png";
                                            $scope.challenge.difficultytext = "Hard";
                                            break;
                                        case range <= -200:
                                            $scope.challenge.difficulty = "Extreme.png";
                                            $scope.challenge.difficultytext = "Extreme";
                                            break;
                                        case range > 100 && range <= 200:
                                            $scope.challenge.difficulty = "Easy.png";
                                            $scope.challenge.difficultytext = "Easy";
                                            break;
                                        case range > 200:
                                            $scope.challenge.difficulty = "VeryEasy.png";
                                            $scope.challenge.difficultytext = "Very Easy";
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            })



                        }
                    })



                    $scope.$apply();

                }
                else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Team not Found',
                        template: 'Looks like your admin decided to delete this game'
                    }).then(function () {
                        $state.go('app.homepage');
                    })
                }

            })

        } catch (error) {
            alert(error.message);
        }

        $scope.CancelChallenge = function (challenge) {
            try {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Decline',
                    template: 'Are you sure you want to Cancel the game?'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        /*HomeStore.DeleteChallenge(challenge).then(function () {

                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: 'Challenge Cancelled'
                            }).then(function () {
                                $state.go('app.homepage');
                            })

                        }, function (error) {
                            alert(error.message);
                        })*/
                    }

                })

            } catch (error) {
                alert(error.message);
            }
        }

        $scope.SelectWinner = function (Winner) {

            var message = "";

            switch (Winner) {
                case 1:
                    message = "Are you sure you want to select " + $scope.challenge.team1name + " " + "as a winner?"
                    break;
                case 2:
                    message = "Are you sure you want to select " + $scope.challenge.team2name + " " + "as a winner?"
                    break;
                case 3:
                    message = "Are you sure the match ended with a draw?"
                    break;

                default:
                    break;
            }

            var confirmPopup = $ionicPopup.confirm({
                template: message
            });
            confirmPopup.then(function (res) {
                AdminStore.ChooseWinner($scope.challenge, Winner).then(function () {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Success',
                        template: 'Game Result Saved'
                    });
                }, function (error) {

                })
            })

        }

        $scope.gotoadd = function () {
            $state.go("app.teamadd");
        }



    })




    .controller('AdminAddPromotions', function ($scope, $ionicPopover, AdminStore, $ionicPopup, $ionicLoading) {

        $scope.year = '2016';
        $scope.month = '2016';
        $scope.day = '2016';
        $scope.hours = '2016';
        $scope.minutes = '2016';

        $scope.starttime = new Date($scope.year, $scope.month, $scope.day, 9, 0, 0, 0);

        $scope.endtime = new Date($scope.year, $scope.month, $scope.day, 21, 0, 0, 0);

        $scope.promotion =
            {
                stadium: "",
                ministadium: "",
                date: "Monday",
                starttime: $scope.starttime,
                startminute: "",
                price: "",
                endtime: $scope.endtime,
                endminute: "",
                discount: 0,
                newprice: "50000",
                weekly: false
            }


        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        try {



            AdminStore.GetMyStadiums(function (leagues) {
                $scope.mystadiums = leagues;
                $scope.promotion.stadium = $scope.mystadiums[0].key;

                AdminStore.GetMyMiniStadiums($scope.promotion.stadium, function (leagues) {
                    $ionicLoading.hide();
                    $scope.myministadiums = leagues;

                }, function (error) {
                    alert(error.message);
                })

                alert(error.message);


            })
        }
        catch (error) {
            alert(error.message);
        }

        $scope.changeprice = function () {
            for (i = 0; i < $scope.myministadiums.length; i++) {
                if ($scope.myministadiums[i].name == $scope.promotion.ministadium.trim()) {
                    $scope.promotion.price = $scope.promotion.newprice = $scope.myministadiums[i].price;
                    break;

                }
            }
        }

        $scope.RefreshDiscount = function () {
            var disc = ((1 - ($scope.promotion.newprice / $scope.promotion.price)) * 100);
            $scope.promotion.discount = disc;
        }


        $scope.addpromotion = function () {
            try {



                AdminStore.AddPromotion($scope.promotion)
                    .then(function (value) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Success',
                            template: 'Promotion Added'
                        });
                    }, function (error) {
                        alert(error.message);

                        alertPopup.then(function (res) {
                            // Custom functionality....
                        });
                        //$scope.allfreestadiums.

                    })
            }
            catch (error) {
                alert(error.message);
            }
        }


        $scope.deletepromotion = function (item) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            try {

                //  alert(ministadium.typefloor);
                // alert($scope.ministadium.name);



                AdminStore.DeletePromotion(item)
                    .then(function (value) {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Success',
                            template: 'Promotion Successfully Deleted'
                        });
                    }, function (error) {
                        alert(error.message);

                        alertPopup.then(function (res) {
                            // Custom functionality....
                        });
                        //$scope.allfreestadiums.

                    })
            }
            catch (error) {
                alert(error.message);
            }

        }

    })


    .controller('CustomerController', function ($scope, $state, $ionicPopover, AdminStore, $ionicPopup, $ionicLoading, $ionicFilterBar) {

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        AdminStore.GetMyCustomers(function (mycustomers) {
            console.log(mycustomers);
            $ionicLoading.hide();
            $scope.mycustomers = mycustomers;
            $scope.filteredCustomers = $scope.mycustomers;
            //console.log($scope.mycustomers);
            console.log($scope.filteredCustomers);
        });

        $scope.OpenCustomerDetails = function (item) {
            $state.go('app.customerdetails', {
                Customer: item
            });
        }

        //Filter bar stuff
        var filterBarInstance;

        //function getItems () {
        //    var items = [];
        //    for (var x = 1; x < 2000; x++) {
        //        items.push({text: 'This is item number ' + x + ' which is an ' + (x % 2 === 0 ? 'EVEN' : 'ODD') + ' number.'});
        //    }
        //    $scope.items = items;
        //}

        //getItems();

        //$scope.$digest();
        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.mycustomers,
                update: function (filteredItems, filterText) {
                    if (filterText != "" && filterText != null) {
                        console.log("filterText is: " + filterText)
                        $scope.filteredCustomers = filteredItems;
                    }
                    else {
                        console.log("filterText non empty is: " + filterText)
                        $scope.filteredCustomers = $scope.mycustomers;
                    }
                }//,
                //filterProperties: ['displayname', 'firstname', 'lastname']
            });
        };


        $scope.refreshItems = function () {
            if (filterBarInstance) {
                filterBarInstance();
                filterBarInstance = null;
            }

            $timeout(function () {
                getItems();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };

        //------------filter bar stuff ----/
    })

    .controller('CustomerDetailsController', function ($scope, $ionicHistory, $state, $ionicPopover, AdminStore, $ionicPopup, $ionicLoading, $stateParams) {

        $scope.Customer = $state.params.Customer;
        console.log($scope.Customer);
        $scope.SaveCustomer = function () {

            try {
                AdminStore.SaveCustomer($scope.Customer).then(function (value) {

                    var alertPopup = $ionicPopup.alert({
                        title: 'Success',
                        template: 'Customer Saved'
                    });

                    alertPopup.then(function (res) {
                        $ionicHistory.goBack();
                    })

                }, function (error) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: error.message
                    });

                })
            }
            catch (error) {
                alert(error.message)
            }
        }
    })

    .controller('CustomerCreateController', function ($scope, $ionicHistory, $ionicPopover, AdminStore, $ionicPopup, $ionicLoading) {
        $scope.newcustomer = {
            name: "",
            lastname: "",
            email: "",
            telephone: "",
            key: ""
        }

        $scope.notselected = false;

        $scope.addcustomer = function () {
            if ($scope.newcustomer.name === "" || $scope.newcustomer.telephone === "") {

                alert("please fill some info");
                $scope.notselected = true;
            }
            else {
                try {

                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    var query = firebase.database().ref('/admins/' + id + '/mycustomers').orderByChild("telephone").equalTo($scope.newcustomer.telephone.trim());

                    query.once('value', function (snapshot) {

                        if (snapshot.exists()) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: 'This Number Already Exists'
                            });
                        }
                        else {
                            var newPostKey = firebase.database().ref().child('players').push().key;
                            AdminStore.AddUser($scope.newcustomer, newPostKey).then(function (value) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: 'Customer Saved'
                                });

                                alertPopup.then(function (res) {
                                    $ionicHistory.goBack();
                                })
                            }, function (error) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: error.message
                                });

                            })
                        }


                    })


                }
                catch (error) {
                    alert(error.message)
                }
            }

        }
    })
var weekday = new Array(7);
weekday[0] = "Su,";
weekday[1] = "Mo,";
weekday[2] = "Tu,";
weekday[3] = "We,";
weekday[4] = "Th,";
weekday[5] = "Fr,";
weekday[6] = "Sa,";

var weekdayFull = new Array(7);
weekdayFull[0] = "Sunday";
weekdayFull[1] = "Monday";
weekdayFull[2] = "Tuesday";
weekdayFull[3] = "Wednesday";
weekdayFull[4] = "Thursday";
weekdayFull[5] = "Friday";
weekdayFull[6] = "Saturday";


monthChar = new Array(12);
monthChar[0] = "Jan";
monthChar[1] = "Feb";
monthChar[2] = "Mar";
monthChar[3] = "Apr";
monthChar[4] = "May";
monthChar[5] = "Jun";
monthChar[6] = "Jul";
monthChar[7] = "Aug";
monthChar[8] = "Sep";
monthChar[9] = "Oct";
monthChar[10] = "Nov";
monthChar[11] = "Dec";


var nesheDate = new Date();
var dateArrayThingy = new Array();
dateArrayThingy.push("Today");
dateArrayThingy.push("Tomorrow");
//alert(nesheDate.getDay());
nesheDate.setDate(nesheDate.getDate() + 1);
for (i = 0; i < 7; i++) {
    nesheDate.setDate(nesheDate.getDate() + 1);
    dateArrayThingy.push(weekdayFull[nesheDate.getDay()]);
}
for (i = 0; i < 100; i++) {
    nesheDate.setDate(nesheDate.getDate() + 1);
    //alert(weekday[nesheDate.getDay()]);
    var day = weekday[nesheDate.getDay()];
    var month = monthChar[nesheDate.getMonth()];
    var dayInMonth = nesheDate.getDate();
    dateArrayThingy.push(day + " " + month + " " + dayInMonth);
}
