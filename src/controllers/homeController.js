(function () {
  'use strict';

  angular.module('appowa')
      .controller('homeController',
      ['$q', '$location', 'officeService', 'restService',
        homeController]);

  /**
   * Controller constructor
   * @param $q                Angular's $q promise service.
   * @param $location         Angular's $location service.
   * @param officeService     Custom Angular service for talking to the Office client.
   * @param restService   Custom Angular service for rest data.
   */
  function homeController($q, $location, officeService, restService) {
    var vm = this;


    /** *********************************************************** */

    Office.initialize = function () {
      console.log(">>> Office.initialize()");
      
      init();
    };

    /**
     * Initialize the controller
     */
    function init() {
      getCurrentMailboxItem()
          .then(function(){
            return getFiles()
              .then(function(){
                return getEmails()
                  .then(function(){
                    return getCompany();
                });
            });
          });
    }
    
    function getCurrentMailboxItem(){
      var deferred = $q.defer();

      officeService.getCurrentMailboxItem()
          .then(function(mailbox){

            vm.currentMailboxItem = mailbox;
            deferred.resolve();
          })
          .catch(function (error) {
              deferred.reject(error);
          });

      return deferred.promise;
    }

    function getFiles(){
      var deferred = $q.defer();

      restService.getFiles(vm.currentMailboxItem)
          .then(function(files){

            vm.files = files;
            deferred.resolve();
          })
          .catch(function (error) {
              deferred.reject(error);
          });

      return deferred.promise;
    }

    function getEmails(){
      var deferred = $q.defer();

      restService.getEmails(vm.currentMailboxItem)
          .then(function(emails){

            vm.emails = emails.data.value;
            deferred.resolve();

          })
          .catch(function (error) {
              deferred.reject(error);
          });

      return deferred.promise;
    }

    function getCompany(){
      var deferred = $q.defer();

      restService.getCompany(vm.currentMailboxItem)
          .then(function(companies){

            vm.companies = companies;
            vm.numEmployees = companies.length > 0 ? companies[0].Employees.length : 0;
            deferred.resolve();

          })
          .catch(function (error) {
              deferred.reject(error);
          });

      return deferred.promise;
    }
  }
})();