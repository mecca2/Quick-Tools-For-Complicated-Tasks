'use strict';

angular.module('myApp.view1', ['ngMaterial','ngRoute','angular.filter'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'rebuildQuoteController'
  });
}])

.controller('rebuildQuoteController', ['$scope', '$http', rebuildQuoteController]);

function rebuildQuoteController ($timeout, $q, $log) {
    var self = this;

    self.simulateQuery = false;
    self.isDisabled    = false;

    // list of `state` value/display objects
    self.states        = loadAll();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.selectedItemChangeNewPurchase = selectedItemChangeNewPurchase;
    self.searchTextChange   = searchTextChange;
    self.searchTextChangeNewPurchase = searchTextChangeNewPurchase;

    self.newState = newState;
    self.removeOrderItem = removeOrderItem; 

    self.orderItems = []; 
    self.rates = {
    	'planning' : 200, 
    	'dev' : 150
    }
    self.orderTotals = {
    	'low_hrs' : 0, 
    	'high_hrs' : 0,
    	'planning_low_hrs' : 0, 
    	'planning_high_hrs' : 0, 
    	'monthly'	: 0, 
    	'software' : 0, 
    	'cost_low' : 0, 
    	'cost_high' : 0, 
    	'cost_mid' : 0
    }
    self.customDevItem = {
    	'low_hrs' : 0, 
    	'high_hrs' : 0, 
    	'planning' : false, 
    	'name' : 0, 
    	'custom_dev' : 1
    }
    function newState(state) {
      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function reSetCustomDevItem(){
    	self.customDevItem = {
	    	'low_hrs' : 0, 
	    	'high_hrs' : 0, 
	    	'planning' : false, 
	    	'name' : 0, 
	    	'custom_dev' : 1
    	}
    }

    function searchTextChange(text) {
      console.log('Text changed to ' + text);
    }
    function searchTextChangeNewPurchase(text){
    	console.log('Text changed to ' + text);
    }

    function selectedItemChange(item) {
    	//self.orderItems = 
    	item.previouslyPurchased = '1';
    	addOrderTotals(item);
      	console.log('Item changed to ' + JSON.stringify(item));
    }
    function selectedItemChangeNewPurchase(item) {
    	//self.orderItems = 
    	item.newPurchase = '1';
    	addOrderTotals(item);
    	console.log(self.orderTotals.low_hrs);
      	console.log('Item changed to ' + JSON.stringify(item));
    }

    function addOrderTotals(item){
    	item.selected = '1';
    	self.orderItems.push(item);
    	self.orderTotals.low_hrs += item.low_hrs;
    	self.orderTotals.high_hrs += item.high_hrs;
    	self.orderTotals.monthly += item.monthly; 
    	//self.orderTotals.software += item.software;
    	if (item.previouslyPurchased  == 1){
    		self.orderTotals.software_previous += item.software;
    	}else{
    		self.orderTotals.software += item.software;
    	}
    	calcOrderCosts();
    }

    function calcOrderCosts(){
    	self.orderTotals.cost_low = 	(self.orderTotals.low_hrs *  self.rates.dev) + (self.orderTotals.planning_low_hrs *  self.rates.planning) + self.orderTotals.software ; 
    	self.orderTotals.cost_high = 	(self.orderTotals.high_hrs *  self.rates.dev) + (self.orderTotals.planning_high_hrs *  self.rates.planning) + self.orderTotals.software ; 
    	self.orderTotals.cost_mid = (self.orderTotals.cost_low + self.orderTotals.cost_high)/2 ; 
    }
    function removeOrderItem(item){
    	var index = self.orderItems.indexOf(item);
    	self.orderTotals.low_hrs -= item.low_hrs;
    	self.orderTotals.high_hrs -= item.high_hrs;
    	calcOrderCosts();
 	 	self.orderItems.splice(index, 1);  
 	 	console.log('testing');   
    }
   // removeOrderItem();
    
    /**
     * Build `states` list of key/value pairs
     */
    function loadAll() {
      var modulesLocal = [
			{
				'nm' : 'XYZ', 
				'low_hrs' : 10, 
				'high_hrs' : 20, 
				'ds' 	: ' XYZ and some more stuff', 
				'software' : 2000, 
				'monthly'	: 10, 
				'standard_imp' : false, 
				'group' : 'Super User Dashboard ', 
				'selected' : '0'
				
			},
			{
				'nm' : 'XYZ 2', 
				'low_hrs' : 20, 
				'high_hrs' : 30, 
				'ds' 	: ' XYZ and some more stuff XYZ 2', 
				'software' : 3000, 
				'monthly'	: 20, 
				'standard_imp' : false, 
				'group' : 'Service Level Options (Fixed Price)', 
				'selected' : '0'
			}, 
			{
				'nm' : 'XYZ Standard 3', 
				'low_hrs' : 20, 
				'high_hrs' : 30, 
				'ds' 	: ' XYZ and some more stuff XYZ 3', 
				'standard_imp' : true, 
				'software' : 2000, 
				'group' : 'Sage 100 (formerly MAS90/200) Packages (Providex 4.3+ or MS SQL 4.5+, using ERP Driver and Sage Business Objects): ', 
				'selected' : '0'
			}, 
			{
				'nm' : 'XYZ Standard 4', 
				'low_hrs' : 30, 
				'high_hrs' : 40, 
				'ds' 	: ' XYZ and some more stuff XYZ 4', 
				'standard_imp' : true, 
				'software' : 3000,
				'group' : 'Sage 300 (formerly Accpac) Packages (MS SQL using ERP Driver and Sage 300s Native Business Objects)', 
				'selected' : '0'
			}
		];
      return modulesLocal.map( function (repo) {
        repo.value = repo.nm.toLowerCase();
        return repo;
      });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };

    }
    function ItemSelected(){
    	alert('test');
    }
  };


