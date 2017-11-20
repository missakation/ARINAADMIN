angular.module('football.controllers', [])


    .factory('LoginStore', function () {
        var TempItems = [];
        var myaccount =
            {
                code: "00001"
            };

        return {

            AddUser: function (newuser, username) {

                if (newuser != null) {
                    var usertoadd =
                        {
                            uid: newuser.uid,
                            email: newuser.email,
                            winstreak: 0,
                            userdescription: "",
                            telephone: "",
                            enableinvitations: true,
                            highestrating: 1500,
                            firstname: "",
                            lastname: "",
                            status: "0",
                            playposition: "Defender",
                            displayname: username,
                            favouritesport: "football",
                            middlename: "",
                            ranking: 100

                        }
                    //alert(newPostKey);
                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};
                    updates['/players/' + newuser.uid + '/'] = usertoadd;
                    updates['/admins/' + newuser.uid + '/'] = usertoadd;


                    return firebase.database().ref().update(updates);
                }

            }

        }

    })

    .controller('FirstPageController', function ($scope, $ionicPopover, $ionicHistory, $ionicPopup, $ionicLoading, $state, $timeout) {


        try {

            $timeout(function () {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });

                var user = firebase.auth().currentUser;
                if (user) {

                    $state.go('app.adminbookings');

                } else {
                    $state.go('signin');
                }

            }, 2000);

        }
        catch (error) {
            alert(error.message);

        }

    })



    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            firebase.auth().signOut().then(function () {
                // Sign-out successful.
                alert("Logged Out");
            }, function (error) {
                // An error happened.
                alert(error.message);
            });
            // $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {



            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function (result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;

                alert(user.uid);

                // ...
            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                alert(errorCode);

                var errorMessage = error.message;
                // The email of the user's account used.
                alert(errorMessage);

                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                alert(email);


                var credential = error.credential;
                // ...


                alert(credential);
            });

            firebase.auth().getRedirectResult().then(function (result) {
                if (result.credential) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = result.credential.accessToken;
                    // ...
                }
                // The signed-in user info.
                var user = result.user;
            }).catch(function (error) {
                var errorCode = error.code;
                alert(errorCode);

                var errorMessage = error.message;
                // The email of the user's account used.
                alert(errorMessage);

                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                alert(email);


                var credential = error.credential;
                // ...


                alert(credential);
            });







            //var provider = new firebase.auth.FacebookAuthProvider();


            //firebase.auth().signInWithRedirect(provider).then(function (result) {
            //    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            //    var token = result.credential.accessToken;
            //    // The signed-in user info.
            //    var user = result.user;
            //    // ...
            //}).catch(function (error) {
            //    // Handle Errors here.
            //    var errorCode = error.code;
            //    alert(errorCode);
            //    var errorMessage = error.message;
            //    alert(errorMessage);

            //    // The email of the user's account used.
            //    var email = error.email;
            //    alert(email);
            //    // The firebase.auth.AuthCredential type that was used.
            //    var credential = error.credential;
            //    // ...
            //});


            //firebase.initializeApp(config);
            //firebase.auth().signInAnonymously().catch(function (error) {
            //    // Handle Errors here.
            //    var errorCode = error.code;
            //    var errorMessage = error.message;
            //    // ...
            //});


            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
        };
    })

    .controller('LoginController', function ($scope, $ionicModal, $ionicHistory, $ionicPopup, $timeout, $state, LoginStore) {
        var user = firebase.auth().currentUser;

        if (user) {
            $state.go("app.adminbookings");
        } else {

        }
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.email = '';
        $scope.displayname = '';
        $scope.password = '';


        $scope.registerusername = '';
        $scope.registerpassword = '';

        //$scope.registerusername = '';
        //$scope.registerpassword = '';

        $scope.Register = function (username) {
            //$scope.modal.show();
            //alert("aa");
            //alert($scope.username);
            //alert($scope.password);

            firebase.auth().createUserWithEmailAndPassword($scope.email, $scope.password).then(function (user) {
                var newuser = firebase.auth().currentUser;
                var name, email, photoUrl, uid;

                if (user != null) {

                    LoginStore.AddUser(newuser, $scope.displayname);

                    var alertPopup = $ionicPopup.alert({
                        title: 'Account Registed',
                        template: 'Thank you for registering. You will be redirected to the homepage'
                    });

                    alertPopup.then(function () {
                        $state.go("app.adminpage");
                    });



                }

            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage);


                // ...
            });
        };


        $scope.LogIn = function (username) {

            firebase.auth().signInWithEmailAndPassword($scope.registerusername, $scope.registerpassword).then(function (user) {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go("app.adminbookings");
            })
                .catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    alert(errorMessage);
                    // ...
                });
        };


        $scope.FacebookLogin = function () {
            try {
                // alert("test1");
                var auth = firebase.auth();
                // alert("test2");
                facebookConnectPlugin.login(['email', 'public_profile', 'user_friends'], //first argument is an array of scope permissions
                    function (userData) {

                        if (userData.authResponse) {
                            facebookConnectPlugin.api('me/?fields=email,gender,name,first_name,last_name', ["public_profile"],
                                function (infoesult) {

                                    alert(JSON.stringify(infoesult));
                                    alert('Good to see you, ' +
                                        infoesult.email + infoesult.name + '.');
                                });

                        }

                        facebookConnectPlugin.getAccessToken(function (token) {
                            //alert("Token: " + token);
                            var credential = firebase.auth.FacebookAuthProvider.credential(token);
                            firebase.auth().signInWithCredential(credential).then(function (result) {

                                $state.go('app.adminpage');

                            }).catch(function (error) {
                                // Handle Errors here.
                                alert("test3");
                                alert(error.code);
                                alert(error.message);
                                // ...
                            });
                        });



                    },
                    function (error) {
                        alert(error);

                        alert(JSON.stringify(error));
                    }
                )
            }
            catch (error) {
                alert(error.message);
            }

        };

        $scope.GoToRegister = function () {
            $state.go('registerpage');
        };

        //firebase.auth().onAuthStateChanged(function (user) {
        //    if (user) {
        //        var user = firebase.auth().currentUser;
        //        var name, email, photoUrl, uid;

        //        if (user != null) {
        //            alert(user.displayName);
        //            alert(user.email);
        //            alert(user.photoURL);
        //            alert(user.uid);  // The user's ID, unique to the Firebase project. Do NOT use
        //            // this value to authenticate with your backend server, if
        //            // you have one. Use User.getToken() instead.
        //        }
        //    } else {
        //        //alert("user signed out");
        //    }
        //});





    })

    .controller('SignInCtrl', function ($scope) {
        $scope.playlists = [
            { title: 'Reggaess', id: 1 },
            { title: 'Chill', id: 2 },
            { title: 'Dubstep', id: 3 },
            { title: 'Indie', id: 4 },
            { title: 'Rap', id: 5 },
            { title: 'Cowbell', id: 6 }
        ];
    })



    .controller('PlaylistsCtrl', function ($scope) {
        $scope.playlists = [
            { title: 'Reggaess', id: 1 },
            { title: 'Chill', id: 2 },
            { title: 'Dubstep', id: 3 },
            { title: 'Indie', id: 4 },
            { title: 'Rap', id: 5 },
            { title: 'Cowbell', id: 6 }
        ];
    })

    .controller('FeedBackController', ['$scope', function ($scope) {

        $scope.submit = function () {
            //$scope.list.push(this.text);
            //$scope.text = '';
            alert("Yo")
            $scope.text = 'tee';

        };
    }])

    .controller('ExampleController', ['$scope', function ($scope) {
        $scope.example = {
            text: 'guest',
            word: /^\s*\w*\s*$/
        };
    }])

    .controller('SubmitSearch', function ($scope, $ionicModal, $timeout, $state) {
        alert("Yo"); $scope.submit = function () {


            $state.go('availablestadiums');
        };
    })

    ;
