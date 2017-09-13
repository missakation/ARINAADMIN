
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

            //   alert(stadium.name);
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
                        //$scope.allfreestadiums.

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

        //comment4



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
            return $scope.scheduleswithday;
        };

        $scope.filterTeams = function (player) {
            var teamIsNew = indexedTeams.indexOf(player.mininame) == -1;
            if (teamIsNew) {
                indexedTeams.push(player.mininame);
            }
            return teamIsNew;
        };


        $scope.editmode = false;

        $scope.GoEditMode = function () {
            $scope.editmode = !$scope.editmode;
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



        //var commentsRef = firebase.database().ref('/stadiums');
        //commentsRef.on('child_added', function (data) {
        //    alert("WIHA");
        //});


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



    .controller('AdminAddBooking', function ($scope, $ionicPopover, $ionicHistory, AdminStore, $ionicPopup, $ionicLoading, $timeout, $state) {

        $scope.extrainfo = {
            bookingprice: 85000,
            duration: "90",
            recurring: "Once"
        }


        $scope.search = {
            date: new Date(),
        };

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
                try {


                    var newPostKey = firebase.database().ref().child('players').push().key;
                    AdminStore.AddUser($scope.newcustomer, newPostKey).then(function (value) {
                        $scope.newcustomer.key = newPostKey;
                        $scope.closePopover1($scope.newcustomer);

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




        $scope.search.date.setHours(21);
        $scope.search.date.setMinutes(0);
        $scope.search.date.setMilliseconds(0);
        $scope.search.date.setSeconds(0);

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




    })

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
                endtime: $scope.endtime,
                endminute: "",
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

    .controller('CustomerController', function ($scope, $state, $ionicPopover, AdminStore, $ionicPopup, $ionicLoading) {

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
            console.log($scope.mycustomers);

        });

        $scope.OpenCustomerDetails = function (item) {
            $state.go('app.customerdetails', {
                Customer: item
            });
        }
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

